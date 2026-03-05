import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';

export const FriendsHeader = () => {
  const router = useRouter();

  return (
    <View
      className="flex-row items-center justify-between"
      testID="friends.header"
    >
      <Text className="font-sf-rounded-semibold text-h4 text-black">
        Friends
      </Text>
      <IconButton
        accessibilityLabel="Add friend"
        className="h-12 w-12 rounded-full"
        icon="addFriend"
        onPress={() => router.push('/add-friend')}
        testID="friends.add-friend-btn"
        variant="filled"
      />
    </View>
  );
};
