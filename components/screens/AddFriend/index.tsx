import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { InviteSheet } from '@/components/screens/InviteSheet';
import { Chip } from '@/components/ui/Chip';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MOCK_SUGGESTED_FRIENDS } from '@/constants/mockFriends';
import { useSearchProfiles, useSendFriendRequest } from '@/hooks/useFriends';
import type { FriendshipStatus } from '@/types/friendship';

import { ActionCard } from './ActionCard';
import { SearchBar } from './SearchBar';
import { SearchResultCard } from './SearchResultCard';
import { SuggestedFriendCard } from './SuggestedFriendCard';

export const AddFriend = () => {
  const [searchText, setSearchText] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [inviteSheetVisible, setInviteSheetVisible] = useState(false);

  // TODO: add 300ms debounce on searchText before passing to useSearchProfiles
  const isSearching = searchText.length >= 2;
  const { data: searchResults, isLoading: isSearchLoading } =
    useSearchProfiles(searchText);
  // TODO: add optimistic update + error toast on sendFriendRequest mutation
  const { mutate: sendFriendRequest } = useSendFriendRequest();

  const handleAdd = (id: string) => {
    sendFriendRequest(id);
    setAddedIds((prev) => new Set(prev).add(id));
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerClassName="px-6 pb-10 pt-16"
        keyboardDismissMode="on-drag"
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
          {isSearching ? (
            <View className="gap-4">
              <SectionHeader title="Search results" />
              {isSearchLoading ? (
                <ActivityIndicator
                  className="py-8"
                  testID="add-friend.search-loading"
                />
              ) : searchResults && searchResults.length > 0 ? (
                searchResults.map((profile) => (
                  <SearchResultCard
                    id={profile.id}
                    key={profile.id}
                    name={profile.full_name}
                    onAdd={() => handleAdd(profile.id)}
                    status={
                      addedIds.has(profile.id)
                        ? 'pending_sent'
                        : (profile.friendship_status as FriendshipStatus)
                    }
                    username={profile.username}
                  />
                ))
              ) : (
                <Text className="text-body-base py-8 text-center font-sf-rounded-medium text-grey-500">
                  No users found
                </Text>
              )}
            </View>
          ) : (
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
          )}
        </View>
      </ScrollView>
      <InviteSheet
        onClose={() => setInviteSheetVisible(false)}
        visible={inviteSheetVisible}
      />
    </>
  );
};
