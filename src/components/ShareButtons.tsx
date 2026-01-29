'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Copy, Loader } from 'lucide-react';
import { generateGIF, downloadGIF, shareGIF } from '@/lib/video-generator';
import { GlassmorphicCard } from './GlassmorphicCard';

interface ShareButtonsProps {
  setupId: string;
  title: string;
  budget: number;
  items: Array<{
    name: string;
    price: number;
    image_url?: string;
  }>;
  username: string;
  setupImageUrl?: string;
  shareUrl: string;
}

export function ShareButtons({
  setupId,
  title,
  budget,
  items,
  username,
  setupImageUrl = '',
  shareUrl,
}: ShareButtonsProps) {
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'none' | 'link' | 'image' | 'gif'>('none');

  // Generate OGP image URL
  useEffect(() => {
    const itemsParam = items.map((item) => ({
      name: item.name,
      price: `¥${item.price.toLocaleString('ja-JP')}`,
    }));

    const ogUrl = new URL('/api/og', window.location.origin);
    ogUrl.searchParams.set('title', title);
    ogUrl.searchParams.set('budget', `¥${budget.toLocaleString('ja-JP')}`);
    ogUrl.searchParams.set('items', JSON.stringify(itemsParam));
    ogUrl.searchParams.set('username', username);
    ogUrl.searchParams.set('color', '#3b82f6');

    setOgImageUrl(ogUrl.toString());
  }, [title, budget, items, username]);

  const handleGenerateGIF = async () => {
    setIsGeneratingGif(true);
    try {
      // Collect images for GIF
      const images = [setupImageUrl, ...items.map((item) => item.image_url || '')].filter(Boolean);

      if (images.length === 0) {
        alert('No images available for GIF generation');
        setIsGeneratingGif(false);
        return;
      }

      const gif = await generateGIF({
        images,
        title,
        width: 1080,
        height: 1920,
        duration: 8,
        fps: 2,
      });

      setGifUrl(gif);
      setShareMethod('gif');
    } catch (error) {
      console.error('GIF generation error:', error);
      alert('Failed to generate GIF. Please try again.');
    } finally {
      setIsGeneratingGif(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareOnX = () => {
    const text = `Check out my desk setup on Canvas! 🖥️\n\nTitle: ${title}\nBudget: ¥${budget.toLocaleString('ja-JP')}\n\n#デスク #ガジェット #Canvas`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, '_blank', 'width=550,height=420');
  };

  const handleShareOnInstagram = async () => {
    // Instagram doesn't support direct URL sharing, so we guide the user
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(ogImageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${title}-setup.png`, { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My Desk Setup',
            text: `Check out my desk setup: ${title}`,
            files: [file],
          });
          return;
        }
      } catch (error) {
        console.error('Instagram share error:', error);
      }
    }

    // Fallback: Guide user to download and upload manually
    alert('Download the image and share it to Instagram Stories or Feed!');
    const link = document.createElement('a');
    link.href = ogImageUrl;
    link.download = `${title}-setup.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = ogImageUrl;
    link.download = `${title}-setup.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadGIF = () => {
    if (gifUrl) {
      downloadGIF(gifUrl, `${title}-setup.gif`);
    }
  };

  const handleShareGIF = async () => {
    if (gifUrl) {
      const success = await shareGIF(gifUrl, title, `Check out my desk setup: ${title}`);
      if (!success) {
        alert('Sharing failed. You can download the GIF instead.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Share Options Buttons */}
      <GlassmorphicCard variant="elevated" padding="lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Share Your Masterpiece
        </h3>

        <div className="space-y-3">
          {/* Copy Link Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium transition-colors"
          >
            <Copy size={18} />
            {copied ? 'Copied!' : 'Copy Share Link'}
          </motion.button>

          {/* Share on X */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareOnX}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-black hover:bg-gray-900 text-white font-medium transition-colors"
          >
            <Share2 size={18} />
            Share on X (Twitter)
          </motion.button>

          {/* Share on Instagram */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareOnInstagram}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-colors"
          >
            <Share2 size={18} />
            Share on Instagram
          </motion.button>

          {/* Generate GIF Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateGIF}
            disabled={isGeneratingGif}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 text-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingGif ? (
              <>
                <Loader size={18} className="animate-spin" />
                Generating GIF...
              </>
            ) : (
              <>
                <Share2 size={18} />
                Generate Animated GIF
              </>
            )}
          </motion.button>

          {/* Download Image Button */}
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

      {/* OGP Image Preview */}
      {ogImageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg overflow-hidden border border-gray-200"
        >
          <img
            src={ogImageUrl}
            alt="Setup preview for social media"
            className="w-full h-auto"
            onError={(e) => {
              console.error('Failed to load OGP image:', e);
            }}
          />
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600">
            This is how your setup appears on social media
          </div>
        </motion.div>
      )}

      {/* GIF Preview & Actions */}
      <AnimatePresence>
        {gifUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassmorphicCard variant="elevated" padding="lg">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Your Animated Setup
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Perfect for Stories, Reels, and TikTok!
                  </p>
                </div>

                {/* GIF Preview */}
                <img
                  src={gifUrl}
                  alt="Setup animation"
                  className="w-full rounded-lg border border-gray-200"
                />

                {/* GIF Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadGIF}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium text-sm transition-colors"
                  >
                    <Download size={16} />
                    Download GIF
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShareGIF}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
                  >
                    <Share2 size={16} />
                    Share GIF
                  </motion.button>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GlassmorphicCard variant="subtle" padding="md">
          <div className="text-xs text-gray-600 space-y-2">
            <p>
              <strong>💡 Tip:</strong> Generate an animated GIF to make your setup stand out on social media!
            </p>
            <p>
              <strong>🎬 Best For:</strong> Instagram Stories, Reels, TikTok, and Twitter
            </p>
            <p>
              <strong>📱 Sharing:</strong> Copy the link to share with friends, or download images to upload directly.
            </p>
          </div>
        </GlassmorphicCard>
      </motion.div>
    </div>
  );
}
