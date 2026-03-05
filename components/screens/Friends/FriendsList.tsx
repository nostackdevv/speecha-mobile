import { View } from 'react-native';

import { MOCK_FRIENDS } from '@/constants/mockFriends';

import { FriendCard } from './FriendCard';

export const FriendsList = () => (
  <View className="gap-4">
    {MOCK_FRIENDS.map((friend) => (
      <FriendCard
        id={friend.id}
        key={friend.id}
        name={friend.full_name}
        sessions={friend.sessions}
        streak={friend.current_streak}
      />
    ))}
  </View>
);
