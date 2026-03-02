import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { COLORS } from '@/constants/colors';

import type { IconName } from '@/constants/icons';

const STEPS: { description: string; icon: IconName; title: string }[] = [
  {
    description: 'Record yourself speak for up to 1 minute.',
    icon: 'mic',
    title: 'Record',
  },
  {
    description: 'We highlight your filler words and score your clarity.',
    icon: 'bolt',
    title: 'Get instant feedback',
  },
  {
    description: 'Practice daily and watch your speech improve over time.',
    icon: 'chart',
    title: 'Track Progress',
  },
];

export const HowSpeechaWorks = () => {
  const router = useRouter();

  return (
    <View className="gap-8 bg-white px-6 pt-10">
      <View className="flex-row items-center justify-between">
        <Text className="font-sf-rounded-semibold text-h4 text-black">
          How Speecha works
        </Text>
        <IconButton
          accessibilityLabel="Close"
          icon="close"
          onPress={router.back}
          variant="ghost"
        />
      </View>

      <View className="gap-8">
        {STEPS.map((step) => (
          <View className="flex-row items-start gap-4" key={step.title}>
            <View
              className="h-14 w-14 items-center justify-center rounded-full bg-clarity-blue-0"
              style={{ borderCurve: 'continuous' }}
            >
              <Icon
                color={COLORS.clarityBlue.DEFAULT}
                name={step.icon}
                size={36}
              />
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-sf-rounded-semibold text-body-lg text-black">
                {step.title}
              </Text>
              <Text className="font-sf-rounded-medium text-body-md text-grey-500">
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View>
        <Button fullWidth onPress={router.back} title="Got it!" />
      </View>
    </View>
  );
};
