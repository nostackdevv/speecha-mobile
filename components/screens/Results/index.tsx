import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Results = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      testID="results.screen"
    >
      <Text className="font-sf-rounded-semibold text-h4 text-black">
        Result Screen here
      </Text>
    </View>
  );
};
