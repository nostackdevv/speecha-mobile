import { ActivityIndicator, Text, View } from 'react-native';

import {
  useFriendRequests,
  useRespondToFriendRequest,
} from '@/hooks/useFriends';

import { RequestCard } from './RequestCard';

export const RequestsList = () => {
  const { data: requests, isLoading } = useFriendRequests();
  const { mutate: respond } = useRespondToFriendRequest();

  if (isLoading) {
    return (
      <View className="items-center py-8">
        <ActivityIndicator />
      </View>
    );
  }

  if (!requests?.length) {
    return (
      <View className="items-center py-8">
        <Text className="text-body-base font-sf-rounded-medium text-grey-400">
          No pending requests
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {requests.map((request) => (
        <RequestCard
          id={request.sender_id}
          key={request.id}
          name={request.full_name}
          onRespond={(status) => respond({ id: request.id, status })}
          streak={request.current_streak}
        />
      ))}
    </View>
  );
};
