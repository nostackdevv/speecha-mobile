import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { useAuth } from './useAuth';
import { useProfile, useUpdateProfile } from './useProfile';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const getExpoProjectId = () =>
  Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

const getDevicePushToken = async () => {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus === 'undetermined') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId = getExpoProjectId();
  if (!projectId) {
    return null;
  }

  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  return data;
};

export const usePushNotificationRegistration = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  useEffect(() => {
    if (!user?.id || !profile) {
      return;
    }

    if (!profile.notifications_enabled) {
      return;
    }

    const syncPushToken = async () => {
      try {
        const token = await getDevicePushToken();

        if (!token) {
          if (profile.push_token) {
            await updateProfile({ push_token: null });
          }
          return;
        }

        if (token === profile.push_token) {
          return;
        }

        await updateProfile({ push_token: token });
      } catch (error) {
        console.error('Push token registration failed:', error);
      }
    };

    void syncPushToken();
  }, [
    profile?.notifications_enabled,
    profile?.push_token,
    profile,
    updateProfile,
    user?.id,
  ]);
};
