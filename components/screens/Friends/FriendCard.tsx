import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';

interface FriendCardProps {
  id: string;
  name: string;
  sessions: number;
  streak: number;
}

export const FriendCard = ({ id, name, sessions, streak }: FriendCardProps) => {
  const router = useRouter();

  return (
    <Pressable
      accessibilityLabel={`View ${name}'s profile`}
      accessibilityRole="button"
      className="flex-row items-center gap-3 rounded-20 bg-grey-50 p-4"
      onPress={() =>
        router.push({ pathname: '/friend-profile', params: { friendId: id } })
      }
      style={({ pressed }) => ({
        borderCurve: 'continuous',
        opacity: pressed ? 0.7 : 1,
      })}
      testID={`friends.friend-${id}`}
    >
      <Avatar showOnlineIndicator size="sm" />
      <View className="flex-1">
        <Text className="text-body-base font-sf-rounded-medium text-black">
          {name}
        </Text>
        <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
          {sessions} sessions
        </Text>
      </View>
      <View
        className="min-w-[68px] flex-row items-center justify-center gap-1 rounded-32 bg-clarity-blue-0 px-4 py-2.5"
        style={{ borderCurve: 'continuous' }}
      >
        <Icon color={COLORS.clarityBlue.DEFAULT} name="fire" size={16} />
        <Text className="text-body-base font-sf-rounded-medium text-clarity-blue">
          {streak}
        </Text>
      </View>
    </Pressable>
  );
};
