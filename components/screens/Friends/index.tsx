import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { MOCK_FRIEND_REQUESTS } from '@/constants/mockFriends';

import { FriendsHeader } from './FriendsHeader';
import { FriendsList } from './FriendsList';
import { RequestsList } from './RequestsList';

const SEGMENTS = ['Friends', 'Requests'] as const;
type Tab = (typeof SEGMENTS)[number];

export const Friends = () => {
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
        <FriendsHeader />
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
