'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';
import { ShareButtons } from '@/components/ShareButtons';
import { ExternalLink } from 'lucide-react';

interface Setup {
  id: string;
  title: string;
  description: string;
  totalBudget: number;
  items: Array<{
    id: string;
    name: string;
    brand: string;
    price: number;
  }>;
  username: string;
  createdAt: string;
  shareUrl?: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function SetupDetailPage({ params }: PageProps) {
  const [setup, setSetup] = useState<Setup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock: In production, fetch from /api/setups/:id
    const mockSetup: Setup = {
      id: params.id,
      title: 'Ultimate Productivity Station',
      description: 'High-performance workstation optimized for deep work',
      totalBudget: 180000,
      items: [
        { id: '1', name: 'BenQ SW240', brand: 'BenQ', price: 39800 },
        { id: '2', name: 'Keychron K6 Pro', brand: 'Keychron', price: 9900 },
        { id: '3', name: 'Logitech MX Master 3S', brand: 'Logitech', price: 11900 },
        { id: '4', name: 'FLEXISPOT E7 Desk', brand: 'FLEXISPOT', price: 29900 },
        { id: '5', name: 'Sony WH-1000XM5', brand: 'Sony', price: 59400 },
      ],
      username: 'productivityninja',
      createdAt: new Date().toISOString(),
      shareUrl: typeof window !== 'undefined' ? `${window.location.origin}/setup/${params.id}` : '',
    };

    setSetup(mockSetup);
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading setup...</p>
      </div>
    );
  }

  if (!setup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Setup not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2 text-gray-900">
            {setup.title}
          </h1>
          <p className="text-gray-600">by @{setup.username}</p>
        </motion.div>

        <div className="space-y-6">
          {/* Description & Budget */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassmorphicCard variant="elevated" padding="lg">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{setup.description}</p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                    <p className="text-2xl font-light text-gray-900">
                      ¥{setup.totalBudget.toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Components</p>
                    <p className="text-2xl font-light text-gray-900">
                      {setup.items.length}
                    </p>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Items List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassmorphicCard variant="elevated" padding="lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recommended Components
              </h3>

              <div className="space-y-3 mb-4">
                {setup.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600">{item.brand}</p>
                    </div>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href={`https://amazon.co.jp/s?k=${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ¥{item.price.toLocaleString('ja-JP')}
                      <ExternalLink size={14} />
                    </motion.a>
                  </motion.div>
                ))}
              </div>

              {/* One-click buy button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Add All to Cart
              </motion.button>
            </GlassmorphicCard>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ShareButtons
              setupId={setup.id}
              title={setup.title}
              budget={setup.totalBudget}
              items={setup.items}
              username={setup.username}
              shareUrl={setup.shareUrl || ''}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
