import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Redirect, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { usePendingRecordingSync } from '@/hooks/usePendingRecordingSync';
import { usePushNotificationRegistration } from '@/hooks/usePushNotificationRegistration';

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  if (isLoading) return null;

  const onSignIn = segments[0] === 'sign-in';

  if (!isAuthenticated && !onSignIn) {
    return <Redirect href="/sign-in" />;
  }

  if (isAuthenticated && onSignIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="dev" options={{ headerShown: false }} />
      <Stack.Screen name="prompt-categories" options={{ headerShown: false }} />
      <Stack.Screen name="prompt-list" options={{ headerShown: false }} />
      <Stack.Screen name="recording" options={{ headerShown: false }} />
      <Stack.Screen name="results" options={{ headerShown: false }} />
      <Stack.Screen name="all-sessions" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
      <Stack.Screen name="add-friend" options={{ headerShown: false }} />
      <Stack.Screen name="friend-profile" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="badges" options={{ headerShown: false }} />
      <Stack.Screen name="profile-picture" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="paywall" options={{ headerShown: false }} />
      <Stack.Screen name="pro-welcome" options={{ headerShown: false }} />
      <Stack.Screen
        name="how-speecha-works"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
        }}
      />
    </Stack>
  );
};

const BackgroundSyncBootstrap = () => {
  usePendingRecordingSync();
  return null;
};

const PushNotificationBootstrap = () => {
  usePushNotificationRegistration();
  return null;
};

export default function RootLayout() {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const [fontsLoaded, fontError] = useFonts({
    'SFProRounded-Regular': require('../assets/fonts/SF-Pro-Rounded-Regular.otf'),
    'SFProRounded-Medium': require('../assets/fonts/SF-Pro-Rounded-Medium.otf'),
    'SFProRounded-Semibold': require('../assets/fonts/SF-Pro-Rounded-Semibold.otf'),
    'SFProRounded-Bold': require('../assets/fonts/SF-Pro-Rounded-Bold.otf'),
    'SFProRounded-Heavy': require('../assets/fonts/SF-Pro-Rounded-Heavy.otf'),
  });
  /* eslint-enable @typescript-eslint/no-require-imports */

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BackgroundSyncBootstrap />
        <PushNotificationBootstrap />
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}
