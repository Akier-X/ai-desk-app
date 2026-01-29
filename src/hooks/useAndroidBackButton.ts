import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { App } from '@capacitor/app';

/**
 * Hook for handling Android back button
 * Provides graceful app exit with confirmation when on home page
 */
export function useAndroidBackButton() {
  const router = useRouter();

  useEffect(() => {
    // Only initialize on native Android platform
    const initBackButton = async () => {
      try {
        const isNative = (window as any).Capacitor?.isNativePlatform?.();
        if (!isNative) return;

        // Handle back button press
        App.addListener('backButton', async ({ canGoBack }) => {
          if (canGoBack) {
            // If we can go back in history, do it
            router.back();
          } else {
            // If we're at the root, show exit confirmation
            // In a real app, you might want to show a native dialog
            // For now, we'll let the app close
            await App.exitApp();
          }
        });
      } catch (error) {
        console.debug('Back button not available:', error);
      }
    };

    initBackButton();

    // Cleanup listener on unmount
    return () => {
      App.removeAllListeners();
    };
  }, [router]);
}

/**
 * Hook for controlling app lifecycle
 */
export function useAppLifecycle() {
  useEffect(() => {
    try {
      const isNative = (window as any).Capacitor?.isNativePlatform?.();
      if (!isNative) return;

      // Pause event (app goes to background)
      const pauseListener = App.addListener('pause', () => {
        // Save state if needed
        console.debug('App paused');
      });

      // Resume event (app comes to foreground)
      const resumeListener = App.addListener('resume', () => {
        // Refresh data if needed
        console.debug('App resumed');
      });

      return () => {
        pauseListener?.remove();
        resumeListener?.remove();
      };
    } catch (error) {
      console.debug('Lifecycle events not available:', error);
    }
  }, []);
}
