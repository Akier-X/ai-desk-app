'use client';

import { motion } from 'framer-motion';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';
import { Heart, Share2 } from 'lucide-react';

// Mock gallery data
const mockSetups = [
  {
    id: '1',
    title: 'Minimalist Creator Station',
    username: 'alex_creates',
    image: 'https://images.unsplash.com/photo-1593642532400-2682a8a8fca7',
    budget: '¥150,000',
    items: 5,
    likes: 234,
    shares: 45,
  },
  {
    id: '2',
    title: 'RGB Gaming Paradise',
    username: 'gamer_max',
    image: 'https://images.unsplash.com/photo-1587145820266-a5c69b5e583b',
    budget: '¥200,000',
    items: 8,
    likes: 512,
    shares: 89,
  },
  {
    id: '3',
    title: 'Productive Home Office',
    username: 'remote_worker',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
    budget: '¥80,000',
    items: 4,
    likes: 156,
    shares: 32,
  },
];

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Gallery() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Community Gallery
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explore beautiful desk setups created by our community. Get inspired and find your perfect combination.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mockSetups.map((setup) => (
            <motion.div key={setup.id} variants={itemVariants}>
              <GlassmorphicCard
                variant="interactive"
                padding="0"
                className="overflow-hidden group cursor-pointer h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100 aspect-video">
                  <img
                    src={setup.image}
                    alt={setup.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {setup.username}
                    </p>
                    <h3 className="text-lg font-medium text-gray-900">
                      {setup.title}
                    </h3>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{setup.items} items</span>
                    <span>•</span>
                    <span>{setup.budget}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Heart size={16} />
                      <span>{setup.likes}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500 transition-colors ml-auto"
                    >
                      <Share2 size={16} />
                      <span>{setup.shares}</span>
                    </motion.button>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
