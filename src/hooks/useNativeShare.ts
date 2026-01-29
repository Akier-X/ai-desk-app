import { useCallback } from 'react';
import { Share } from '@capacitor/share';

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  files?: string[];
}

/**
 * Hook for native sharing using OS share sheet
 * Falls back to Web Share API if Capacitor not available
 */
export function useNativeShare() {
  const share = useCallback(async (options: ShareOptions) => {
    try {
      // Try native share first
      const isNative = (window as any).Capacitor?.isNativePlatform?.();
      if (isNative) {
        await Share.share({
          title: options.title,
          text: options.text,
          url: options.url,
          files: options.files,
        });
      } else {
        // Fall back to Web Share API
        if (navigator.share) {
          await navigator.share({
            title: options.title,
            text: options.text,
            url: options.url,
          });
        } else {
          throw new Error('Share not supported');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  }, []);

  return { share };
}
