import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import alertImage from '@/assets/images/alert.png';

interface ErrorViewProps {
  onTryAgain: () => void;
  testID?: string;
}

export const ErrorView = ({ onTryAgain, testID }: ErrorViewProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-white px-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      testID={testID}
    >
      <View className="items-center gap-10">
        <Image
          contentFit="contain"
          source={alertImage}
          style={{ width: 186, height: 85 }}
        />

        <View className="items-center gap-6">
          <View className="gap-2">
            <Text className="text-center font-sf-rounded-semibold text-h4 text-black">
              We couldn&apos;t analyze your audio.
            </Text>

            <Text className="text-center font-sf-rounded-medium text-body-lg text-grey-700">
              Something went wrong while generating your results. Please try
              again.
            </Text>
          </View>

          <Button
            className="h-12 w-[140px]"
            onPress={onTryAgain}
            testID={testID ? `${testID}.try-again-btn` : undefined}
            title="Try again!"
          />
        </View>
      </View>
    </View>
  );
};
