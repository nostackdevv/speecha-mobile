import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEFAULT_PROFILE_AVATAR_KEY,
  type ProfileAvatarKey,
} from '@/constants/profileVisuals';

const PROFILE_AVATAR_KEY = '@speecha/profile-avatar-key';

const isProfileAvatarKey = (value: string): value is ProfileAvatarKey =>
  value.startsWith('avatar-');

export const profileAvatarStorage = {
  getSelectedAvatarKey: async (): Promise<ProfileAvatarKey> => {
    const value = await AsyncStorage.getItem(PROFILE_AVATAR_KEY);

    if (!value || !isProfileAvatarKey(value)) {
      return DEFAULT_PROFILE_AVATAR_KEY;
    }

    return value;
  },

  setSelectedAvatarKey: async (avatarKey: ProfileAvatarKey): Promise<void> => {
    await AsyncStorage.setItem(PROFILE_AVATAR_KEY, avatarKey);
  },
};
