import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';

interface ScreenHeaderProps {
  testID?: string;
  title: string;
}

export const ScreenHeader = ({ testID, title }: ScreenHeaderProps) => {
  const router = useRouter();

  return (
    <View className="h-12 flex-row items-center">
      <IconButton
        accessibilityLabel="Go back"
        icon="arrowLeft"
        onPress={() => router.back()}
        className="h-12 w-12 rounded-full"
        testID={testID ? `${testID}.back-btn` : undefined}
        variant="filled"
      />
      <Text className="flex-1 text-center font-sf-rounded-semibold text-h4 text-black">
        {title}
      </Text>
      <View className="h-12 w-12" />
    </View>
  );
};
