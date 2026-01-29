'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';
import { Copy, Share2, Download } from 'lucide-react';

interface SetupItem {
  id: string;
  name: string;
  brand: string;
  price: number;
}

interface Setup {
  id: string;
  title: string;
  description: string;
  totalBudget: number;
  items: SetupItem[];
  shareUrl?: string;
}

export default function Share() {
  const [setups, setSetups] = useState<Setup[]>([
    {
      id: '1',
      title: 'My Dream Setup',
      description: 'High-performance workstation for creative professionals',
      totalBudget: 150000,
      items: [
        { id: '1', name: 'BenQ Monitor', brand: 'BenQ', price: 39800 },
        { id: '2', name: 'Keychron Keyboard', brand: 'Keychron', price: 9900 },
        { id: '3', name: 'Logitech Mouse', brand: 'Logitech', price: 11900 },
      ],
      shareUrl: 'https://canvas.local/setup/xyz123',
    },
  ]);

  const [selectedSetup, setSelectedSetup] = useState<Setup | null>(null);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Setup link copied to clipboard!');
  };

  const handleGenerateOGP = (setup: Setup) => {
    console.log('Generating OGP for:', setup.title);
    // Implementation: Generate OGP image from setup data
  };

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
            Share Your Setup
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Create custom desk setups and share them with the community. Generate beautiful preview images for social media.
          </p>
        </motion.div>

        {/* Setups List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {setups.map((setup) => (
            <GlassmorphicCard
              key={setup.id}
              variant="elevated"
              padding="lg"
              className="space-y-6"
            >
              {/* Setup Header */}
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  {setup.title}
                </h2>
                <p className="text-gray-600">{setup.description}</p>
              </div>

              {/* Budget Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                  <p className="text-2xl font-light text-gray-900">
                    ¥{setup.totalBudget.toLocaleString('ja-JP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Items</p>
                  <p className="text-2xl font-light text-gray-900">
                    {setup.items.length}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Components</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {setup.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">{item.brand}</p>
                      </div>
                      <p className="text-sm text-gray-700">
                        ¥{item.price.toLocaleString('ja-JP')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                {setup.shareUrl && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCopyLink(setup.shareUrl!)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium transition-colors"
                  >
                    <Copy size={16} />
                    Copy Link
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  <Share2 size={16} />
                  Share on Social
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenerateOGP(setup)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium transition-colors"
                >
                  <Download size={16} />
                  Generate Image
                </motion.button>
              </div>
            </GlassmorphicCard>
          ))}
        </motion.div>

        {/* Empty State */}
        {setups.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 mb-4">
              You haven't created any setups yet.
            </p>
            <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
              Create Your First Setup
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
