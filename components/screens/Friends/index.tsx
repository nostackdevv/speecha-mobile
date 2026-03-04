import { Text, View } from 'react-native';

export const Friends = () => {
  return (
    <View
      className="flex-1 items-center justify-center bg-white"
      testID="friends.screen"
    >
      <Text className="text-xl font-bold text-black">Friends</Text>
    </View>
  );
};
