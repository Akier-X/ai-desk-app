import { createClient } from '@supabase/supabase-js';
import type {
  Profile,
  Product,
  Setup,
  SetupItem,
  Interaction,
  CreateProfileSchema,
  CreateProductSchema,
  CreateSetupSchema,
  CreateSetupItemSchema,
  CreateInteractionSchema,
} from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ========================================
// PROFILE OPERATIONS
// ========================================
export async function createProfile(data: typeof CreateProfileSchema._type) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return profile as Profile;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, data: Partial<typeof CreateProfileSchema._type>) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return profile as Profile;
}

// ========================================
// PRODUCT OPERATIONS
// ========================================
export async function createProduct(data: typeof CreateProductSchema._type) {
  const { data: product, error } = await supabase
    .from('products')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return product as Product;
}

export async function getProduct(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select()
    .eq('id', productId)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function searchProducts(
  keywords: string,
  category?: string,
  maxPrice?: number,
  limit = 20
) {
  let query = supabase.from('products').select();

  if (keywords) {
    query = query.or(`name.ilike.%${keywords}%,description.ilike.%${keywords}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (maxPrice) {
    query = query.lte('price_jpy', maxPrice);
  }

  const { data, error } = await query.limit(limit);

  if (error) throw error;
  return data as Product[];
}

export async function getProductsByIds(productIds: string[]) {
  const { data, error } = await supabase
    .from('products')
    .select()
    .in('id', productIds);

  if (error) throw error;
  return data as Product[];
}

// ========================================
// SETUP OPERATIONS
// ========================================
export async function createSetup(userId: string, data: typeof CreateSetupSchema._type) {
  const { data: setup, error } = await supabase
    .from('setups')
    .insert([{ ...data, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return setup as Setup;
}

export async function getSetup(setupId: string) {
  const { data, error } = await supabase
    .from('setups')
    .select()
    .eq('id', setupId)
    .single();

  if (error) throw error;
  return data as Setup;
}

export async function getSetupDetail(setupId: string) {
  const { data: setup, error: setupError } = await supabase
    .from('setups')
    .select()
    .eq('id', setupId)
    .single();

  if (setupError) throw setupError;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', setup.user_id)
    .single();

  if (profileError) throw profileError;

  const { data: items, error: itemsError } = await supabase
    .from('setup_items')
    .select('*, product:products(*)')
    .eq('setup_id', setupId);

  if (itemsError) throw itemsError;

  const { data: likes } = await supabase
    .from('interactions')
    .select('id')
    .eq('target_id', setupId)
    .eq('target_type', 'setup')
    .eq('interaction_type', 'like');

  const { data: bookmarks } = await supabase
    .from('interactions')
    .select('id')
    .eq('target_id', setupId)
    .eq('target_type', 'setup')
    .eq('interaction_type', 'bookmark');

  return {
    setup: setup as Setup,
    user: profile as Profile,
    items: items || [],
    like_count: likes?.length || 0,
    bookmark_count: bookmarks?.length || 0,
  };
}

export async function listSetups(limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('setups')
    .select()
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as Setup[];
}

export async function getUserSetups(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('setups')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Setup[];
}

export async function updateSetup(setupId: string, userId: string, data: Partial<typeof CreateSetupSchema._type>) {
  const { data: setup, error } = await supabase
    .from('setups')
    .update(data)
    .eq('id', setupId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return setup as Setup;
}

export async function deleteSetup(setupId: string, userId: string) {
  const { error } = await supabase
    .from('setups')
    .delete()
    .eq('id', setupId)
    .eq('user_id', userId);

  if (error) throw error;
}

// ========================================
// SETUP_ITEM OPERATIONS
// ========================================
export async function addSetupItem(setupId: string, data: typeof CreateSetupItemSchema._type) {
  const { data: item, error } = await supabase
    .from('setup_items')
    .insert([{ ...data, setup_id: setupId }])
    .select()
    .single();

  if (error) throw error;
  return item as SetupItem;
}

export async function getSetupItems(setupId: string) {
  const { data, error } = await supabase
    .from('setup_items')
    .select('*, product:products(*)')
    .eq('setup_id', setupId);

  if (error) throw error;
  return data || [];
}

export async function removeSetupItem(itemId: string) {
  const { error } = await supabase
    .from('setup_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

export async function updateSetupItem(itemId: string, data: Partial<typeof CreateSetupItemSchema._type>) {
  const { data: item, error } = await supabase
    .from('setup_items')
    .update(data)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return item as SetupItem;
}

// ========================================
// INTERACTION OPERATIONS
// ========================================
export async function addInteraction(userId: string, data: typeof CreateInteractionSchema._type) {
  const { data: interaction, error } = await supabase
    .from('interactions')
    .insert([{ ...data, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return interaction as Interaction;
}

export async function removeInteraction(
  userId: string,
  targetType: string,
  targetId: string,
  interactionType: string
) {
  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('interaction_type', interactionType);

  if (error) throw error;
}

export async function hasInteraction(
  userId: string,
  targetType: string,
  targetId: string,
  interactionType: string
) {
  const { data, error } = await supabase
    .from('interactions')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('interaction_type', interactionType)
    .single();

  if (error && error.code === 'PGRST116') return false; // Not found
  if (error) throw error;
  return !!data;
}

export async function getInteractionCount(
  targetType: string,
  targetId: string,
  interactionType: string
) {
  const { count, error } = await supabase
    .from('interactions')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('interaction_type', interactionType);

  if (error) throw error;
  return count || 0;
}
