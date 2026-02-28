import { ExpoConfig, ConfigContext } from 'expo/config';

const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const googleIosUrlScheme = googleIosClientId
  ? googleIosClientId.split('.').reverse().join('.')
  : undefined;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Speecha',
  slug: 'speecha-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'speechamobile',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'app.speecha.mobile',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'app.speecha.mobile',
    edgeToEdgeEnabled: true,
    permissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.MODIFY_AUDIO_SETTINGS',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-audio',
      {
        microphonePermission:
          'Allow $(PRODUCT_NAME) to access your microphone to record your speech for analysis.',
      },
    ],
    googleIosUrlScheme
      ? [
          '@react-native-google-signin/google-signin',
          { iosUrlScheme: googleIosUrlScheme },
        ]
      : '@react-native-google-signin/google-signin',
  ],
  experiments: {
    typedRoutes: true,
  },
});
