import { useRouter } from 'expo-router';
import { useWindowDimensions, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';

export const ProWelcome = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const handleContinue = () => {
    router.replace('/');
  };

  const handleClose = () => {
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-clarity-blue" testID="pro-welcome.screen">
      <View
        className="mt-[62px] flex-1 overflow-hidden rounded-40 bg-white"
        style={{ borderCurve: 'continuous' }}
      >
        <View className="flex-1 justify-between">
          <View className="px-6 pt-[51px]">
            <IconButton
              accessibilityLabel="Close"
              className="size-10 rounded-32"
              icon="close"
              onPress={handleClose}
              testID="pro-welcome.close-btn"
              variant="filled"
            />
          </View>

          <View className="items-center gap-4 self-center">
            <View
              className="rounded-[38.4px] bg-clarity-blue px-[14.4px] py-[7.2px]"
              style={{
                borderCurve: 'continuous',
                shadowColor: '#c4c4c4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
              }}
            >
              <Text className="font-sf-rounded-bold text-[22px] leading-[22px] text-white">
                PRO
              </Text>
            </View>

            <Text className="w-[262px] text-center font-sf-rounded-semibold text-h3 text-black">
              Welcome to Speecha Pro
            </Text>
          </View>

          <View
            className="px-6"
            style={{ paddingBottom: Math.max(insets.bottom + 16, 24) }}
          >
            <Button
              fullWidth
              onPress={handleContinue}
              testID="pro-welcome.continue-btn"
              title="Let's go!"
            />
          </View>
        </View>
      </View>

      <View
        className="absolute inset-0"
        pointerEvents="none"
        style={{ elevation: 40, zIndex: 40 }}
      >
        <ConfettiCannon
          autoStart
          count={90}
          explosionSpeed={320}
          fadeOut
          fallSpeed={2800}
          origin={{ x: -20, y: 0 }}
        />
        <ConfettiCannon
          autoStart
          count={90}
          explosionSpeed={300}
          fadeOut
          fallSpeed={2600}
          origin={{ x: width + 20, y: 0 }}
        />
      </View>
    </View>
  );
};
