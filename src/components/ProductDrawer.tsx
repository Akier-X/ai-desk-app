'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Heart } from 'lucide-react';
import { GlassmorphicCard } from './GlassmorphicCard';
import { useState } from 'react';

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    productId: string;
    name: string;
    brand: string | null;
    price_jpy: number;
    reason: string;
    image_url?: string;
    description?: string;
    category?: string;
  };
}

export function ProductDrawer({ isOpen, onClose, product }: ProductDrawerProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-white shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {product && (
                <>
                  {/* Product Image */}
                  {product.image_url && (
                    <div className="rounded-xl overflow-hidden bg-gray-100 h-80 flex items-center justify-center">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="space-y-3 pt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      {product.category || 'Product'}
                    </p>
                    <h2 className="text-2xl font-light text-gray-900">
                      {product.name}
                    </h2>
                    {product.brand && (
                      <p className="text-sm text-gray-600">{product.brand}</p>
                    )}
                  </div>

                  {/* Price */}
                  <GlassmorphicCard variant="subtle" padding="md">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light text-gray-900">
                        ¥{product.price_jpy.toLocaleString('ja-JP')}
                      </span>
                    </div>
                  </GlassmorphicCard>

                  {/* AI Recommendation Reason */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">Why This Product?</h3>
                    <GlassmorphicCard variant="subtle" padding="md">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {product.reason}
                      </p>
                    </GlassmorphicCard>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900">About</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    {/* Buy Button */}
                    <button className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-colors">
                      <ExternalLink size={18} />
                      View on Amazon
                    </button>

                    {/* Favorite Button */}
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className="w-full py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Heart
                        size={18}
                        className={isFavorited ? 'fill-red-500 text-red-500' : ''}
                      />
                      {isFavorited ? 'Favorited' : 'Add to Favorites'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
