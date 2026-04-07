import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

import {
  useFriendRequests,
  useRespondToFriendRequest,
} from '@/hooks/useFriends';

import { RequestCard } from './RequestCard';

export const RequestsList = () => {
  const { data: requests, isLoading } = useFriendRequests();
  const { mutate: respond } = useRespondToFriendRequest();
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);

  const handleRespond = (
    requestId: string,
    status: 'accepted' | 'rejected',
    name: string
  ) => {
    if (pendingRequestId === requestId) return;

    setPendingRequestId(requestId);
    respond(
      { id: requestId, status },
      {
        onError: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Action failed', 'Please try again.');
        },
        onSettled: () => {
          setPendingRequestId(null);
        },
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert(
            status === 'accepted' ? 'Friend Added' : 'Request Declined',
            status === 'accepted'
              ? `You accepted ${name}'s request.`
              : `You declined ${name}'s request.`
          );
        },
      }
    );
  };

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
          isSubmitting={pendingRequestId === request.id}
          key={request.id}
          name={request.full_name}
          onRespond={(status) =>
            handleRespond(request.id, status, request.full_name)
          }
          streak={request.current_streak}
        />
      ))}
    </View>
  );
};
