'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useHaptics } from '@/hooks/useHaptics';
import { RecommendationForm } from '@/components/RecommendationForm';
import { Canvas } from '@/components/Canvas';
import { ProductDrawer } from '@/components/ProductDrawer';
import { Toast, useToast } from '@/components/Toast';
import { recommendGadgets, type RecommendationResult } from '@/lib/ai-agent';
import { saveSetup } from '@/app/actions/setup';
import type { SaveSetupInput } from '@/types/canvas';
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
  const { user } = useAuth();
  const router = useRouter();
  const { showToast, toasts } = useToast();
  const { trigger: haptic } = useHaptics();

  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [setupTitle, setSetupTitle] = useState('');
  const [setupDescription, setSetupDescription] = useState('');

  const handleSubmit = async (input: string, budget: number) => {
    setIsLoading(true);
    try {
      const result = await recommendGadgets(input, budget, []);
      setRecommendation(result);
      await haptic('medium');
    } catch (error) {
      console.error('Recommendation error:', error);
      await haptic('error');
      alert('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product: SelectedProduct) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleSaveSetup = async () => {
    // Check if user is authenticated
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Validate setup has a title
    if (!setupTitle.trim()) {
      showToast('Please enter a setup title', 'error');
      return;
    }

    // Validate recommendation exists
    if (!recommendation) {
      showToast('No recommendation to save', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Map recommendation items to SaveSetupInput format
      const setupData: SaveSetupInput = {
        title: setupTitle.trim(),
        description: setupDescription.trim() || undefined,
        items: recommendation.recommendations.map((item, index) => ({
          product_id: item.productId,
          position_x: index % 3, // Simple grid positioning
          position_y: Math.floor(index / 3),
          notes: item.reason,
        })),
      };

      const result = await saveSetup(setupData);

      if (result.success) {
        await haptic('success');
        showToast('Setup saved successfully!', 'success');
        // Redirect to the newly created setup
        setTimeout(() => {
          router.push(`/setup/${result.setupId}`);
        }, 500);
      } else {
        await haptic('error');
        showToast(result.error || 'Failed to save setup', 'error');
      }
    } catch (error) {
      console.error('Error saving setup:', error);
      await haptic('error');
      showToast('Failed to save setup', 'error');
    } finally {
      setIsSaving(false);
    }
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

            {/* Save Setup Section */}
            <motion.div
              className="mt-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-6">Save Your Setup</h3>

                {/* Title Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Setup Name
                  </label>
                  <input
                    type="text"
                    value={setupTitle}
                    onChange={(e) => setSetupTitle(e.target.value)}
                    placeholder="e.g., Creative Workspace, Gaming Rig"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    disabled={isSaving}
                  />
                </div>

                {/* Description Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={setupDescription}
                    onChange={(e) => setSetupDescription(e.target.value)}
                    placeholder="Describe your setup and what makes it special..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    disabled={isSaving}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveSetup}
                    disabled={isSaving || !setupTitle.trim()}
                    className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Setup'}
                  </button>
                  <button
                    onClick={() => setRecommendation(null)}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-900 font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>

            {/* New Recommendation Button */}
            <motion.div
              className="mt-12 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => {
                  setRecommendation(null);
                  setSetupTitle('');
                  setSetupDescription('');
                }}
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

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}
