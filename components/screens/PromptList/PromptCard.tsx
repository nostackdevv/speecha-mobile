import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';

import type { Prompt } from '@/types/prompts';

interface PromptCardProps {
  onPress: () => void;
  prompt: Prompt;
  testID?: string;
}

export const PromptCard = ({ onPress, prompt, testID }: PromptCardProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={prompt.text}
      accessibilityRole="button"
      className="flex-row items-center gap-4 rounded-20 bg-grey-50 py-4 pl-5 pr-3"
      onPress={handlePress}
      testID={testID}
      style={({ pressed }) => ({
        borderCurve: 'continuous',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text className="flex-1 font-sf-rounded-semibold text-body-lg text-black">
        {prompt.text}
      </Text>
      <View className="h-12 w-12 items-center justify-center rounded-full bg-grey-100">
        <Icon
          color={COLORS.clarityBlue.DEFAULT}
          name="arrowUpRight"
          size={16}
        />
      </View>
    </Pressable>
  );
};
