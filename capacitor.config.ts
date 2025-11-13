import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cz.faktix.app',
  appName: 'Faktix',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    hostname: 'faktix.cz',
    allowNavigation: ['faktix.cz', '*.faktix.cz']
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      spinnerColor: '#00ff88',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
      overlaysWebView: false
    },
    App: {
      backgroundColor: '#000000'
    }
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'Faktix'
  },
  android: {
    buildOptions: {
      keystorePath: 'faktix-release-key.keystore',
      keystoreAlias: 'faktix'
    }
  }
};

export default config;

