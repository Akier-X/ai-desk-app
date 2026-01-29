'use client';

import { useState } from 'react';
import { RecommendationForm } from '@/components/RecommendationForm';
import { Canvas } from '@/components/Canvas';
import { ProductDrawer } from '@/components/ProductDrawer';
import { recommendGadgets, type RecommendationResult } from '@/lib/ai-agent';
import { motion } from 'framer-motion';

interface SelectedProduct {
  productId: string;
  name: string;
  brand: string | null;
  price_jpy: number;
  reason: string;
  image_url?: string;
  category?: string;
  description?: string;
}

export default function Home() {
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSubmit = async (input: string, budget: number) => {
    setIsLoading(true);
    try {
      const result = await recommendGadgets(input, budget, []);
      setRecommendation(result);
    } catch (error) {
      console.error('Recommendation error:', error);
      alert('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product: SelectedProduct) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        {!recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4 text-gray-900">
              Design Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                Perfect Desk
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Tell us your vision, and let AI design the ideal gadget combination within your budget.
              Every item is carefully chosen to complement your workspace.
            </p>
          </motion.div>
        )}

        {/* Form Section */}
        <div className="mb-16">
          <RecommendationForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Canvas Section */}
        {recommendation && (
          <motion.div
            key="canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Canvas
              items={recommendation.recommendations}
              reasoning={recommendation.reasoning}
              totalPrice={recommendation.total_price_jpy}
              budgetRemaining={recommendation.budget_remaining_jpy}
              onItemClick={handleProductClick}
              isLoading={isLoading}
            />

            {/* New Recommendation Button */}
            <motion.div
              className="mt-12 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => setRecommendation(null)}
                className="px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium transition-colors"
              >
                Start Over
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Product Details Drawer */}
      <ProductDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedProduct || undefined}
      />
    </div>
  );
}
