import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3665c5849bb449e2a984609ab2865b60',
  appName: 'bridge-finances',
  webDir: 'dist',
  server: {
    url: 'https://3665c584-9bb4-49e2-a984-609ab2865b60.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
