import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { MOCK_FRIEND_REQUESTS } from '@/constants/mockFriends';
import { FriendsList } from './FriendsList';
import { RequestsList } from './RequestsList';

const SEGMENTS = ['Friends', 'Requests'] as const;
type Tab = (typeof SEGMENTS)[number];

export const Friends = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<Tab>('Friends');

  const requestBadges =
    MOCK_FRIEND_REQUESTS.length > 0
      ? { Requests: MOCK_FRIEND_REQUESTS.length }
      : undefined;

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
      testID="friends.screen"
    >
      <View className="gap-6">
        <ScreenHeader
          left={null}
          right={
            <IconButton
              accessibilityLabel="Add friend"
              className="size-12 rounded-full"
              icon="addFriend"
              onPress={() => router.push('/add-friend')}
              testID="friends.add-friend-btn"
              variant="filled"
            />
          }
          testID="friends.header"
          title="Friends"
          titlePlacement="left"
        />
        <SegmentedControl
          badges={requestBadges}
          onValueChange={setSelectedTab}
          segments={SEGMENTS}
          selectedValue={selectedTab}
          testID="friends.tabs"
        />
        {selectedTab === 'Friends' ? <FriendsList /> : <RequestsList />}
      </View>
    </ScrollView>
  );
};
