import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deskcanvas.app',
  appName: 'Canvas',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Ensure the server works correctly on Android
    cleartext: true,
  },
  ios: {
    scheme: 'Canvas',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'AAB', // For Google Play Store
    },
    // Handle back button behavior
    handleBackButton: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchFadeOutDuration: 0,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#ffffff',
      overlaysWebView: true,
    },
    App: {
      // Prevent app from closing on back button on home screen
      // (will be handled by useAndroidBackButton hook)
    },
  },
};

export default config;
