'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader } from 'lucide-react';
import { GlassmorphicCard } from './GlassmorphicCard';

interface RecommendationFormProps {
  onSubmit: (input: string, budget: number) => Promise<void>;
  isLoading?: boolean;
}

export function RecommendationForm({ onSubmit, isLoading = false }: RecommendationFormProps) {
  const [input, setInput] = useState('');
  const [budget, setBudget] = useState(30000);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    await onSubmit(input, budget);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <GlassmorphicCard variant="elevated" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Input */}
          <div>
            <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-2">
              Your Desk Vision
            </label>
            <textarea
              id="request"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., '3万円で集中できるデスク環境' or 'Budget gaming setup with RGB lighting'"
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Budget Slider */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-3">
              Budget: ¥{budget.toLocaleString('ja-JP')}
            </label>
            <input
              id="budget"
              type="range"
              min="5000"
              max="300000"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>¥5,000</span>
              <span>¥300,000</span>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Creating your canvas...
              </>
            ) : (
              <>
                <Send size={18} />
                Design My Setup
              </>
            )}
          </motion.button>
        </form>
      </GlassmorphicCard>
    </motion.div>
  );
}
