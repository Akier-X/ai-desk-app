'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

interface SaveSetupParams {
  title: string;
  description?: string;
  image_url?: string;
  items: Array<{
    product_id: string;
    position_x?: number;
    position_y?: number;
    notes?: string;
  }>;
}

/**
 * Save a new setup to the database with associated items
 * Handles transaction-like behavior by creating setup first, then items
 */
export async function saveSetup(params: SaveSetupParams) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Calculate total price from items
    const { data: products } = await supabase
      .from('products')
      .select('id, price_jpy')
      .in(
        'id',
        params.items.map((item) => item.product_id)
      );

    const totalPrice =
      products?.reduce((sum, p) => sum + (p.price_jpy || 0), 0) || 0;

    // Create setup
    const { data: setup, error: setupError } = await supabase
      .from('setups')
      .insert([
        {
          user_id: user.id,
          title: params.title,
          description: params.description,
          image_url: params.image_url,
          total_price_jpy: totalPrice,
        },
      ])
      .select()
      .single();

    if (setupError) throw setupError;
    if (!setup) throw new Error('Failed to create setup');

    // Create setup items
    const setupItems = params.items.map((item) => ({
      setup_id: setup.id,
      product_id: item.product_id,
      position_x: item.position_x,
      position_y: item.position_y,
      notes: item.notes,
    }));

    const { error: itemsError } = await supabase
      .from('setup_items')
      .insert(setupItems);

    if (itemsError) throw itemsError;

    // Revalidate paths
    revalidatePath('/dashboard');
    revalidatePath(`/setup/${setup.id}`);

    return {
      success: true,
      setupId: setup.id,
      message: 'Setup saved successfully',
    };
  } catch (error) {
    console.error('Error saving setup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update an existing setup
 */
export async function updateSetup(
  setupId: string,
  params: Partial<SaveSetupParams>
) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Verify ownership
    const { data: setup, error: fetchError } = await supabase
      .from('setups')
      .select('user_id')
      .eq('id', setupId)
      .single();

    if (fetchError || !setup || setup.user_id !== user.id) {
      throw new Error('Unauthorized');
    }

    // Update setup
    const updateData: any = {};
    if (params.title) updateData.title = params.title;
    if (params.description) updateData.description = params.description;
    if (params.image_url) updateData.image_url = params.image_url;

    const { error: updateError } = await supabase
      .from('setups')
      .update(updateData)
      .eq('id', setupId);

    if (updateError) throw updateError;

    // Update items if provided
    if (params.items && params.items.length > 0) {
      // Delete old items
      await supabase.from('setup_items').delete().eq('setup_id', setupId);

      // Insert new items
      const setupItems = params.items.map((item) => ({
        setup_id: setupId,
        product_id: item.product_id,
        position_x: item.position_x,
        position_y: item.position_y,
        notes: item.notes,
      }));

      const { error: itemsError } = await supabase
        .from('setup_items')
        .insert(setupItems);

      if (itemsError) throw itemsError;
    }

    revalidatePath('/dashboard');
    revalidatePath(`/setup/${setupId}`);

    return {
      success: true,
      setupId,
      message: 'Setup updated successfully',
    };
  } catch (error) {
    console.error('Error updating setup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a setup and its associated items
 */
export async function deleteSetup(setupId: string) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Verify ownership
    const { data: setup, error: fetchError } = await supabase
      .from('setups')
      .select('user_id')
      .eq('id', setupId)
      .single();

    if (fetchError || !setup || setup.user_id !== user.id) {
      throw new Error('Unauthorized');
    }

    // Delete items first (foreign key constraint)
    await supabase.from('setup_items').delete().eq('setup_id', setupId);

    // Delete setup
    const { error: deleteError } = await supabase
      .from('setups')
      .delete()
      .eq('id', setupId);

    if (deleteError) throw deleteError;

    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Setup deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting setup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
