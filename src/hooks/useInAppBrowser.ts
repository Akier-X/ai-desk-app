import { useCallback } from 'react';
import { Browser } from '@capacitor/browser';

export interface BrowserOptions {
  url: string;
  toolbarColor?: string;
  title?: string;
}

/**
 * Hook for opening URLs in in-app browser
 * Falls back to window.open if Capacitor not available
 */
export function useInAppBrowser() {
  const open = useCallback(async (options: BrowserOptions) => {
    try {
      // Try native browser first
      const isNative = (window as any).Capacitor?.isNativePlatform?.();
      if (isNative) {
        await Browser.open({
          url: options.url,
          windowName: '_blank',
          toolbarColor: options.toolbarColor || '#3b82f6',
          title: options.title,
          presentationStyle: 'popover',
        });
      } else {
        // Fall back to window.open
        window.open(options.url, '_blank');
      }
    } catch (error) {
      console.error('Browser open error:', error);
      // Fallback to window.open
      window.open(options.url, '_blank');
    }
  }, []);

  return { open };
}
