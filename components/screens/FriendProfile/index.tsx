import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { COLORS } from '@/constants/colors';
import {
  useFriendList,
  useFriendStats,
  useRemoveFriend,
} from '@/hooks/useFriends';

import { ProfileStats } from './ProfileStats';
import { RemoveFriendSheet } from './RemoveFriendSheet';

export const FriendProfile = () => {
  const router = useRouter();
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const [removeVisible, setRemoveVisible] = useState(false);

  const { data: friends } = useFriendList();
  const { data: stats, isLoading: statsLoading } = useFriendStats(friendId);
  const removeFriend = useRemoveFriend();

  const friend = friends?.find((f) => f.id === friendId);

  const handleRemoveFriend = () => {
    removeFriend.mutate(friendId!, {
      onSuccess: () => {
        setRemoveVisible(false);
        router.back();
      },
    });
  };

  // TODO: this could break if stuck as the user can't navigate back
  if (!friend) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 flex-grow pt-16 pb-6"
      showsVerticalScrollIndicator={false}
      testID="friend-profile.screen"
    >
      <View className="gap-6">
        <ScreenHeader testID="friend-profile" />

        <View className="items-center gap-3">
          <Avatar size="lg" />
          <Text className="font-sf-rounded-semibold text-h3 text-black">
            {friend.full_name}
          </Text>
          <View
            className="flex-row items-center gap-1.5 rounded-32 bg-clarity-blue-0 px-4 py-2.5"
            style={{ borderCurve: 'continuous' }}
          >
            <Icon color={COLORS.clarityBlue.DEFAULT} name="fire" size={16} />
            <Text className="text-body-base font-sf-rounded-medium text-clarity-blue">
              {friend.current_streak}-day streak
            </Text>
          </View>
        </View>

        <View className="gap-4">
          <SectionHeader title="Speech Activity" trailing="Last 7 days" />
          {statsLoading ? (
            <View className="items-center py-6">
              <ActivityIndicator />
            </View>
          ) : stats ? (
            <ProfileStats stats={stats} />
          ) : null}
        </View>
      </View>
      <Pressable
        accessibilityLabel="Remove friend"
        accessibilityRole="button"
        className="mt-auto items-center py-2"
        onPress={() => setRemoveVisible(true)}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        testID="friend-profile.remove-btn"
      >
        <Text className="font-sf-rounded-medium text-body-lg text-grey-500">
          Remove Friend?
        </Text>
      </Pressable>

      {removeVisible && (
        <RemoveFriendSheet
          name={friend.full_name}
          onClose={() => setRemoveVisible(false)}
          onConfirm={handleRemoveFriend}
          visible={removeVisible}
        />
      )}
    </ScrollView>
  );
};
