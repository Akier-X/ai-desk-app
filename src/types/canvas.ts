/**
 * Canvas State Types
 * Represents the current state of a desk setup configuration
 */

export interface CanvasProduct {
  productId: string;
  name: string;
  brand: string | null;
  price: number;
  image_url?: string;
  position_x?: number;
  position_y?: number;
  notes?: string;
}

export interface CanvasState {
  title: string;
  description?: string;
  items: CanvasProduct[];
  totalBudget: number;
  image_url?: string; // Canvas screenshot or desk photo
}

export interface SaveSetupInput {
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
