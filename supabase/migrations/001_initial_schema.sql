-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PROFILES TABLE
-- ========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ========================================
-- PRODUCTS TABLE
-- ========================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_platform TEXT NOT NULL, -- 'amazon' | 'rakuten'
  external_id TEXT NOT NULL,     -- ASIN for Amazon, item ID for Rakuten
  name TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  price_jpy DECIMAL(10, 2),
  image_url TEXT,
  affiliate_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(source_platform, external_id)
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_source_platform ON products(source_platform);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- ========================================
-- SETUPS TABLE (User-generated desk environment posts)
-- ========================================
CREATE TABLE setups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  total_price_jpy DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_setups_user_id ON setups(user_id);
CREATE INDEX idx_setups_created_at ON setups(created_at DESC);
ALTER TABLE setups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Setups are viewable by everyone" ON setups
  FOR SELECT USING (true);

CREATE POLICY "Users can create setups" ON setups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own setups" ON setups
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own setups" ON setups
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- SETUP_ITEMS TABLE (Bridge: Setups ↔ Products)
-- ========================================
CREATE TABLE setup_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setup_id UUID NOT NULL REFERENCES setups(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position_x FLOAT,           -- Image coordinate X (0-100 percentage)
  position_y FLOAT,           -- Image coordinate Y (0-100 percentage)
  notes TEXT,                 -- Optional notes about why this product was selected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(setup_id, product_id)
);

CREATE INDEX idx_setup_items_setup_id ON setup_items(setup_id);
CREATE INDEX idx_setup_items_product_id ON setup_items(product_id);
ALTER TABLE setup_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Setup items are viewable if setup is viewable" ON setup_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM setups WHERE setups.id = setup_items.setup_id));

-- ========================================
-- INTERACTIONS TABLE (Unified: Likes, Bookmarks, Follows)
-- ========================================
CREATE TYPE interaction_type AS ENUM ('like', 'bookmark', 'follow');

CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,  -- 'setup' | 'product' | 'user'
  target_id UUID NOT NULL,    -- setup_id, product_id, or user_id
  interaction_type interaction_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, target_type, target_id, interaction_type)
);

CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_target ON interactions(target_type, target_id);
CREATE INDEX idx_interactions_type ON interactions(interaction_type);
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all interactions" ON interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can create own interactions" ON interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions" ON interactions
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- UPDATED_AT TRIGGER FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_products_timestamp BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_setups_timestamp BEFORE UPDATE ON setups
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
