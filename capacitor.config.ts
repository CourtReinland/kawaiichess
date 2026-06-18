import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kawaiichess.app',
  appName: 'Kawaii Chess',
  webDir: 'dist/client',
  server: {
    androidScheme: 'https',
  },
};

export default config;
