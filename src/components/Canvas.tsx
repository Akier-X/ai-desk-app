'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphicCard } from './GlassmorphicCard';
import { ChevronRight } from 'lucide-react';

interface CanvasItem {
  productId: string;
  name: string;
  brand: string | null;
  price_jpy: number;
  reason: string;
  image_url?: string;
}

interface CanvasProps {
  items: CanvasItem[];
  reasoning: string;
  totalPrice: number;
  budgetRemaining: number;
  onItemClick?: (item: CanvasItem) => void;
  isLoading?: boolean;
}

export function Canvas({
  items,
  reasoning,
  totalPrice,
  budgetRemaining,
  onItemClick,
  isLoading,
}: CanvasProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Canvas Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-light tracking-tight text-gray-900">
          Your Perfect Setup
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl">
          {reasoning}
        </p>
      </motion.div>

      {/* Budget Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassmorphicCard variant="subtle" padding="md" className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Investment</p>
            <p className="text-2xl font-light text-gray-900">
              ¥{totalPrice.toLocaleString('ja-JP')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Remaining Budget</p>
            <p className="text-2xl font-light text-green-600">
              ¥{budgetRemaining.toLocaleString('ja-JP')}
            </p>
          </div>
        </GlassmorphicCard>
      </motion.div>

      {/* Items Grid */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                variants={itemVariants}
                exit="exit"
                onClick={() => onItemClick?.(item)}
                className="group"
              >
                <GlassmorphicCard
                  variant="interactive"
                  padding="md"
                  className="h-full flex flex-col cursor-pointer"
                >
                  {/* Product Image Placeholder */}
                  {item.image_url && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-40 flex items-center justify-center text-gray-400">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {item.brand || 'Brand'}
                        </p>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                      </div>
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                      </motion.div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 pt-2">
                      {item.reason}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-lg font-light text-gray-900">
                      ¥{item.price_jpy.toLocaleString('ja-JP')}
                    </p>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {items.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500">
            No recommendations yet. Start by describing your ideal setup above.
          </p>
        </motion.div>
      )}
    </div>
  );
}
