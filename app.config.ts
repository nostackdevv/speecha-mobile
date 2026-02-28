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
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
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
  extra: {
    eas: {
      projectId: '602e35eb-62db-4675-bd96-b329f247e94f',
    },
  },
  experiments: {
    typedRoutes: true,
  },
});
