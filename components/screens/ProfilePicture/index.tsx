import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import {
  DEFAULT_PROFILE_AVATAR_KEY,
  PROFILE_AVATARS,
  PROFILE_AVATAR_MAP,
  type ProfileAvatarKey,
} from '@/constants/profileVisuals';
import { COLORS } from '@/constants/colors';
import { useProfile } from '@/hooks/useProfile';
import {
  useSelectedProfileAvatar,
  useSetSelectedProfileAvatar,
} from '@/hooks/useSelectedProfileAvatar';

export const ProfilePicture = () => {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: selectedAvatarKey } = useSelectedProfileAvatar();
  const setSelectedAvatar = useSetSelectedProfileAvatar();
  const [pendingAvatarKey, setPendingAvatarKey] = useState<
    ProfileAvatarKey | undefined
  >(undefined);

  const activeAvatarKey =
    pendingAvatarKey ?? selectedAvatarKey ?? DEFAULT_PROFILE_AVATAR_KEY;

  const activeAvatarSource = useMemo(
    () => PROFILE_AVATAR_MAP[activeAvatarKey],
    [activeAvatarKey]
  );

  const displayName =
    profile?.full_name?.trim() || profile?.username || 'Jemimah Bature';

  const handleSelectAvatar = (avatarKey: ProfileAvatarKey) => {
    setPendingAvatarKey(avatarKey);
    Haptics.selectionAsync();

    setSelectedAvatar.mutate(avatarKey, {
      onSettled: () => {
        setPendingAvatarKey(undefined);
      },
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-grey-100"
      contentContainerClassName="px-5 pb-12 pt-16"
      showsVerticalScrollIndicator={false}
      testID="profile-picture.screen"
    >
      <View className="gap-6">
        <View className="h-12 flex-row items-center justify-between">
          <Text className="font-sf-rounded-semibold text-h2 text-black">
            Edit Profile
          </Text>
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            className="size-10 items-center justify-center rounded-full bg-grey-200"
            onPress={() => router.back()}
            style={({ pressed }) => ({
              borderCurve: 'continuous',
              opacity: pressed ? 0.8 : 1,
            })}
            testID="profile-picture.close-btn"
          >
            <Icon color={COLORS.grey[500]} name="close" size={18} />
          </Pressable>
        </View>

        <View
          className="h-[250px] items-center justify-center overflow-hidden rounded-[40px] bg-error-300"
          style={{ borderCurve: 'continuous' }}
          testID="profile-picture.preview-card"
        >
          <View className="absolute inset-0 bg-error-200 opacity-30" />
          <Image
            resizeMode="contain"
            source={activeAvatarSource}
            style={{ height: 130, width: 130 }}
            testID="profile-picture.preview"
          />
        </View>

        <View
          className="h-14 justify-center rounded-16 bg-grey-200 px-5"
          style={{ borderCurve: 'continuous' }}
        >
          <Text className="font-sf-rounded-semibold text-body-xl text-black">
            {displayName}
          </Text>
        </View>

        <View
          className="flex-row flex-wrap justify-between gap-y-7"
          testID="profile-picture.grid"
        >
          {PROFILE_AVATARS.map((avatar) => {
            const isActive = avatar.key === activeAvatarKey;

            return (
              <Pressable
                accessibilityLabel={`Select ${avatar.key}`}
                accessibilityRole="button"
                className="size-[84px] items-center justify-center rounded-full"
                key={avatar.key}
                onPress={() => handleSelectAvatar(avatar.key)}
                style={({ pressed }) => ({
                  borderCurve: 'continuous',
                  opacity: pressed ? 0.8 : 1,
                })}
                testID={`profile-picture.avatar-${avatar.key}`}
              >
                {isActive ? (
                  <View
                    className="size-[84px] items-center justify-center rounded-full border-[5px] border-clarity-blue"
                    style={{ borderCurve: 'continuous' }}
                  >
                    <View
                      className="size-[72px] overflow-hidden rounded-full"
                      style={{ borderCurve: 'continuous' }}
                    >
                      <Image
                        resizeMode="cover"
                        source={avatar.source}
                        style={{ height: '100%', width: '100%' }}
                      />
                    </View>
                  </View>
                ) : (
                  <View
                    className="size-[72px] overflow-hidden rounded-full"
                    style={{ borderCurve: 'continuous' }}
                  >
                    <Image
                      resizeMode="cover"
                      source={avatar.source}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};
