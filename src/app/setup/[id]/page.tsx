'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';
import { Copy, Share2, Download, ExternalLink } from 'lucide-react';
import { generateOGPSVG } from '@/lib/ogp-generator';

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
  const [ogpImage, setOgpImage] = useState<string>('');
  const [copied, setCopied] = useState(false);

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
      shareUrl: `${window.location.origin}/setup/${params.id}`,
    };

    setSetup(mockSetup);

    // Generate OGP image
    const svg = generateOGPSVG({
      title: mockSetup.title,
      description: mockSetup.description,
      budget: mockSetup.totalBudget,
      items: mockSetup.items,
      username: mockSetup.username,
    });

    setOgpImage(svg);
    setIsLoading(false);
  }, [params.id]);

  const handleCopyLink = () => {
    if (setup?.shareUrl) {
      navigator.clipboard.writeText(setup.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareOnX = () => {
    if (setup?.shareUrl) {
      const text = `Check out my desk setup on Canvas: ${setup.title} - Total budget: ¥${setup.totalBudget.toLocaleString('ja-JP')}`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(setup.shareUrl)}`;
      window.open(url, '_blank');
    }
  };

  const handleDownloadImage = () => {
    if (ogpImage) {
      const link = document.createElement('a');
      link.href = ogpImage;
      link.download = `${setup?.title || 'setup'}-preview.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2 text-gray-900">
            {setup.title}
          </h1>
          <p className="text-gray-600">by {setup.username}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* OGP Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <GlassmorphicCard variant="elevated" padding="md">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Share Preview</h3>
                {ogpImage && (
                  <img
                    src={ogpImage}
                    alt="Setup preview"
                    className="w-full rounded-lg border border-gray-200"
                  />
                )}
                <p className="text-xs text-gray-600">
                  This is how your setup appears on social media
                </p>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Setup Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Description & Budget */}
            <GlassmorphicCard variant="elevated" padding="lg">
              <div className="space-y-4">
                <p className="text-gray-700">{setup.description}</p>

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

            {/* Items List */}
            <GlassmorphicCard variant="elevated" padding="lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recommended Components
              </h3>

              <div className="space-y-3">
                {setup.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                className="w-full mt-4 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Add All to Cart
              </motion.button>
            </GlassmorphicCard>

            {/* Share Actions */}
            <GlassmorphicCard variant="elevated" padding="lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Share This Setup
              </h3>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium transition-colors"
                >
                  <Copy size={18} />
                  {copied ? 'Copied!' : 'Copy Link'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShareOnX}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-black hover:bg-gray-900 text-white font-medium transition-colors"
                >
                  <Share2 size={18} />
                  Share on X (Twitter)
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadImage}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium transition-colors"
                >
                  <Download size={18} />
                  Download Preview Image
                </motion.button>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
