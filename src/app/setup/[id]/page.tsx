'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';
import { ShareButtons } from '@/components/ShareButtons';
import { ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import type { Setup, Profile, SetupItem, Product } from '@/types/database';

interface PageProps {
  params: {
    id: string;
  };
}

interface SetupData {
  setup: Setup;
  user: Profile | null;
  items: Array<SetupItem & { products: Product }>;
}

export default function SetupDetailPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClient();
  const [data, setData] = useState<SetupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        // Fetch setup
        const { data: setup, error: setupError } = await supabase
          .from('setups')
          .select('*')
          .eq('id', params.id)
          .single();

        if (setupError || !setup) {
          setError('Setup not found');
          setIsLoading(false);
          return;
        }

        // Fetch setup items with product details
        const { data: items, error: itemsError } = await supabase
          .from('setup_items')
          .select('*, products(*)')
          .eq('setup_id', params.id);

        if (itemsError) {
          console.error('Error fetching items:', itemsError);
        }

        // Fetch user profile
        const { data: user, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', setup.user_id)
          .single();

        if (userError) {
          console.error('Error fetching profile:', userError);
        }

        setData({
          setup,
          user: user || null,
          items: items || [],
        });
      } catch (err) {
        console.error('Error fetching setup:', err);
        setError('Failed to load setup');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSetupData();
  }, [params.id, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading setup...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Setup not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = data.setup.total_price_jpy || 0;
  const username = data.user?.username || 'Anonymous';

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
            {data.setup.title}
          </h1>
          <p className="text-gray-600">by @{username}</p>
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
                {data.setup.description && (
                  <p className="text-gray-700 leading-relaxed">{data.setup.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                    <p className="text-2xl font-light text-gray-900">
                      ¥{totalPrice.toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Components</p>
                    <p className="text-2xl font-light text-gray-900">
                      {data.items.length}
                    </p>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Items List */}
          {data.items.length > 0 && (
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
                  {data.items.map((item, index) => {
                    const product = item.products as Product;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          {product.brand && (
                            <p className="text-xs text-gray-600">{product.brand}</p>
                          )}
                          {item.notes && (
                            <p className="text-xs text-gray-600 italic mt-1">{item.notes}</p>
                          )}
                        </div>
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          href={product.affiliate_url || `https://amazon.co.jp/s?k=${encodeURIComponent(product.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          ¥{(product.price_jpy || 0).toLocaleString('ja-JP')}
                          <ExternalLink size={14} />
                        </motion.a>
                      </motion.div>
                    );
                  })}
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
          )}

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ShareButtons
              setupId={data.setup.id}
              title={data.setup.title}
              budget={totalPrice}
              items={data.items.map((item) => ({
                id: item.product_id,
                name: (item.products as Product).name,
                brand: (item.products as Product).brand || '',
                price: (item.products as Product).price_jpy || 0,
              }))}
              username={username}
              shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/setup/${params.id}` : ''}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
