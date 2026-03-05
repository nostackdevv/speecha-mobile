import { View } from 'react-native';

import { MOCK_FRIEND_REQUESTS } from '@/constants/mockFriends';

import { RequestCard } from './RequestCard';

export const RequestsList = () => (
  <View className="gap-4">
    {MOCK_FRIEND_REQUESTS.map((request) => (
      <RequestCard
        id={request.profile.id}
        key={request.friendship.id}
        name={request.profile.full_name}
        onAccept={() => {}}
        onReject={() => {}}
        streak={request.profile.current_streak}
      />
    ))}
  </View>
);
