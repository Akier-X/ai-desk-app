import { useCallback } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Hook for triggering haptic feedback
 * Falls back gracefully if not on a Capacitor/native app
 */
export function useHaptics() {
  const trigger = useCallback(async (type: HapticType = 'light') => {
    try {
      // Check if we're in a Capacitor app
      const isNative = (window as any).Capacitor?.isNativePlatform?.();
      if (!isNative) {
        return;
      }

      switch (type) {
        case 'light':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'heavy':
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case 'success':
          await Haptics.notification({ type: 'SUCCESS' });
          break;
        case 'warning':
          await Haptics.notification({ type: 'WARNING' });
          break;
        case 'error':
          await Haptics.notification({ type: 'ERROR' });
          break;
      }
    } catch (error) {
      // Silently fail if haptics not available
      console.debug('Haptics not available:', error);
    }
  }, []);

  return { trigger };
}
