import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'hu.nyilvolgy.jatek',
  appName: 'Fletchvale',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
}

export default config
