import { z } from 'zod';

// ========================================
// PROFILE TYPES
// ========================================
export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1).max(255),
  avatar_url: z.string().url().nullable(),
  bio: z.string().max(500).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateProfileSchema = z.object({
  username: z.string().min(1).max(255),
  avatar_url: z.string().url().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
});

// ========================================
// PRODUCT TYPES
// ========================================
export type ProductSource = 'amazon' | 'rakuten';

export interface Product {
  id: string;
  source_platform: ProductSource;
  external_id: string;
  name: string;
  brand: string | null;
  description: string | null;
  price_jpy: number | null;
  image_url: string | null;
  affiliate_url: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export const ProductSchema = z.object({
  id: z.string().uuid(),
  source_platform: z.enum(['amazon', 'rakuten']),
  external_id: z.string(),
  name: z.string(),
  brand: z.string().nullable(),
  description: z.string().nullable(),
  price_jpy: z.number().nullable(),
  image_url: z.string().url().nullable(),
  affiliate_url: z.string().url().nullable(),
  category: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateProductSchema = z.object({
  source_platform: z.enum(['amazon', 'rakuten']),
  external_id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  description: z.string().optional(),
  price_jpy: z.number().positive().optional(),
  image_url: z.string().url().optional(),
  affiliate_url: z.string().url().optional(),
  category: z.string().optional(),
});

// ========================================
// SETUP TYPES
// ========================================
export interface Setup {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  total_price_jpy: number | null;
  created_at: string;
  updated_at: string;
}

export const SetupSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  image_url: z.string().url().nullable(),
  total_price_jpy: z.number().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateSetupSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  image_url: z.string().url().optional(),
});

// ========================================
// SETUP_ITEM TYPES
// ========================================
export interface SetupItem {
  id: string;
  setup_id: string;
  product_id: string;
  position_x: number | null;
  position_y: number | null;
  notes: string | null;
  created_at: string;
}

export const SetupItemSchema = z.object({
  id: z.string().uuid(),
  setup_id: z.string().uuid(),
  product_id: z.string().uuid(),
  position_x: z.number().min(0).max(100).nullable(),
  position_y: z.number().min(0).max(100).nullable(),
  notes: z.string().max(500).nullable(),
  created_at: z.string().datetime(),
});

export const CreateSetupItemSchema = z.object({
  product_id: z.string().uuid(),
  position_x: z.number().min(0).max(100).optional(),
  position_y: z.number().min(0).max(100).optional(),
  notes: z.string().max(500).optional(),
});

// ========================================
// INTERACTION TYPES
// ========================================
export type InteractionType = 'like' | 'bookmark' | 'follow';
export type InteractionTargetType = 'setup' | 'product' | 'user';

export interface Interaction {
  id: string;
  user_id: string;
  target_type: InteractionTargetType;
  target_id: string;
  interaction_type: InteractionType;
  created_at: string;
}

export const InteractionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  target_type: z.enum(['setup', 'product', 'user']),
  target_id: z.string().uuid(),
  interaction_type: z.enum(['like', 'bookmark', 'follow']),
  created_at: z.string().datetime(),
});

export const CreateInteractionSchema = z.object({
  target_type: z.enum(['setup', 'product', 'user']),
  target_id: z.string().uuid(),
  interaction_type: z.enum(['like', 'bookmark', 'follow']),
});

// ========================================
// COMPOSITE TYPES
// ========================================
export interface SetupWithItems extends Setup {
  items: (SetupItem & { product: Product })[];
}

export interface SetupDetailResponse {
  setup: Setup;
  user: Profile;
  items: (SetupItem & { product: Product })[];
  like_count: number;
  bookmark_count: number;
}
