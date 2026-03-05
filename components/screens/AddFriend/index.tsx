import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { InviteSheet } from '@/components/screens/InviteSheet';
import { Chip } from '@/components/ui/Chip';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MOCK_SUGGESTED_FRIENDS } from '@/constants/mockFriends';

import { ActionCard } from './ActionCard';
import { SearchBar } from './SearchBar';
import { SuggestedFriendCard } from './SuggestedFriendCard';

export const AddFriend = () => {
  const [searchText, setSearchText] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [inviteSheetVisible, setInviteSheetVisible] = useState(false);

  const handleAdd = (id: string) => {
    setAddedIds((prev) => new Set(prev).add(id));
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerClassName="px-6 pb-10 pt-16"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        testID="add-friend.screen"
      >
        <View className="gap-6">
          <ScreenHeader testID="add-friend" title="Add friends" />
          <SearchBar onChangeText={setSearchText} value={searchText} />
          <View className="flex-row gap-3">
            <ActionCard
              icon="addFriend"
              label="Add from contacts"
              // TODO: implement contacts import
              onPress={() => {}}
              testID="add-friend.contacts-card"
            />
            <ActionCard
              icon="share"
              label="Share invite link"
              onPress={() => setInviteSheetVisible(true)}
              testID="add-friend.invite-card"
            />
          </View>
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <SectionHeader title="Suggested friends" />
              <Chip
                label={`${MOCK_SUGGESTED_FRIENDS.length} new`}
                variant="accent"
              />
            </View>
            {MOCK_SUGGESTED_FRIENDS.map((friend) => (
              <SuggestedFriendCard
                added={addedIds.has(friend.id)}
                id={friend.id}
                key={friend.id}
                name={friend.full_name}
                onAdd={() => handleAdd(friend.id)}
                subtitle={friend.subtitle}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <InviteSheet
        onClose={() => setInviteSheetVisible(false)}
        visible={inviteSheetVisible}
      />
    </>
  );
};
