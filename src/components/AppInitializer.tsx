'use client';

import { useEffect } from 'react';
import { useAndroidBackButton, useAppLifecycle } from '@/hooks/useAndroidBackButton';

/**
 * Client-side initializer for app-level hooks and listeners
 * Handles Android back button, app lifecycle, etc.
 */
export function AppInitializer() {
  // Initialize Android back button handling
  useAndroidBackButton();

  // Initialize app lifecycle listeners
  useAppLifecycle();

  // Initialize Status Bar
  useEffect(() => {
    const initStatusBar = async () => {
      try {
        const isNative = (window as any).Capacitor?.isNativePlatform?.();
        if (!isNative) return;

        const { StatusBar } = await import('@capacitor/status-bar');
        // Set status bar to light style with white background on Android
        StatusBar.setStyle({ style: 'LIGHT' });
        StatusBar.setBackgroundColor({ color: '#ffffff' });
      } catch (error) {
        console.debug('StatusBar not available:', error);
      }
    };

    initStatusBar();
  }, []);

  return null;
}
