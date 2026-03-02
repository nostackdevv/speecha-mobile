import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';

interface ScreenHeaderProps {
  title: string;
}

export const ScreenHeader = ({ title }: ScreenHeaderProps) => {
  const router = useRouter();

  return (
    <View className="h-12 flex-row items-center">
      <IconButton
        accessibilityLabel="Go back"
        icon="arrowLeft"
        onPress={() => router.back()}
        size={48}
        variant="filled"
      />
      <Text className="flex-1 text-center font-sf-rounded-semibold text-h4 text-black">
        {title}
      </Text>
      <View className="h-12 w-12" />
    </View>
  );
};
