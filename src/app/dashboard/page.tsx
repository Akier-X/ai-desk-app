'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import type { Setup } from '@/types/database';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [setups, setSetups] = useState<Setup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchUserSetups();
    }
  }, [user, authLoading, router]);

  const fetchUserSetups = async () => {
    try {
      const { data, error } = await supabase
        .from('setups')
        .select()
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSetups(data || []);
    } catch (error) {
      console.error('Error fetching setups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (setupId: string) => {
    if (!window.confirm('Are you sure you want to delete this setup?')) return;

    try {
      const { error } = await supabase.from('setups').delete().eq('id', setupId);
      if (error) throw error;

      setSetups(setups.filter((s) => s.id !== setupId));
    } catch (error) {
      console.error('Error deleting setup:', error);
      alert('Failed to delete setup');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2 text-gray-900">
              My Setups
            </h1>
            <p className="text-gray-600">Manage all your desk configurations</p>
          </div>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              <Plus size={18} />
              New Setup
            </motion.button>
          </Link>
        </motion.div>

        {/* Setups List */}
        {setups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 mb-4">
              No setups yet. Start by creating a new desk configuration!
            </p>
            <Link href="/">
              <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                Create First Setup
              </button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {setups.map((setup, index) => (
              <motion.div
                key={setup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassmorphicCard variant="interactive" padding="md" className="h-full flex flex-col group">
                  {/* Setup Image */}
                  {setup.image_url && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
                      <img
                        src={setup.image_url}
                        alt={setup.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Setup Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {setup.title}
                    </h3>
                    {setup.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {setup.description}
                      </p>
                    )}
                    {setup.total_price_jpy && (
                      <p className="text-sm text-gray-700 font-medium">
                        ¥{setup.total_price_jpy.toLocaleString('ja-JP')}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                    <Link href={`/setup/${setup.id}`} className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium text-sm transition-colors"
                      >
                        <Eye size={16} />
                        View
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDelete(setup.id)}
                      className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-red-300 hover:bg-red-50 text-red-600 font-medium text-sm transition-colors"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
