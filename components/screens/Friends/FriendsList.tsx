import { ActivityIndicator, Text, View } from 'react-native';

import { useFriendList } from '@/hooks/useFriends';

import { FriendCard } from './FriendCard';

export const FriendsList = () => {
  const { data: friends, isLoading } = useFriendList();

  if (isLoading) {
    return (
      <View className="items-center py-10">
        <ActivityIndicator />
      </View>
    );
  }

  // TODO: add suggestions to add friends when the list is empty
  if (!friends?.length) {
    return (
      <View className="items-center py-10">
        <Text className="text-body-base font-sf-rounded-medium text-grey-500">
          No friends yet
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {friends.map((friend) => (
        <FriendCard
          id={friend.id}
          key={friend.id}
          name={friend.full_name}
          sessions={friend.sessions_count}
          streak={friend.current_streak}
        />
      ))}
    </View>
  );
};
