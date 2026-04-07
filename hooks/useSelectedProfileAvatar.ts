import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type ProfileAvatarKey } from '@/constants/profileVisuals';
import { profileAvatarStorage } from '@/lib/profileAvatarStorage';

const SELECTED_PROFILE_AVATAR_QUERY_KEY = ['selected-profile-avatar'];

export const useSelectedProfileAvatar = () => {
  return useQuery<ProfileAvatarKey>({
    queryKey: SELECTED_PROFILE_AVATAR_QUERY_KEY,
    queryFn: profileAvatarStorage.getSelectedAvatarKey,
  });
};

export const useSetSelectedProfileAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarKey: ProfileAvatarKey) => {
      await profileAvatarStorage.setSelectedAvatarKey(avatarKey);
      return avatarKey;
    },
    onSuccess: (avatarKey) => {
      queryClient.setQueryData(SELECTED_PROFILE_AVATAR_QUERY_KEY, avatarKey);
    },
  });
};
