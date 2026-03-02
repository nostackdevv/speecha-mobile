import * as Haptics from 'expo-haptics';
import { Image, Pressable, Text, View } from 'react-native';

import type { PromptCategory } from '@/types/prompts';

interface CategoryCardProps {
  category: PromptCategory;
  onPress: () => void;
}

export const CategoryCard = ({ category, onPress }: CategoryCardProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={category.name}
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
      })}
      className="flex-1 gap-4"
    >
      <View
        className="h-[140px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-grey-100"
        style={{ borderCurve: 'continuous' }}
      >
        <Image
          className="h-full w-full"
          resizeMode="cover"
          source={category.image}
        />
      </View>
      <View className="items-center gap-1">
        <Text className="font-sf-rounded-semibold text-body-xl text-black">
          {category.name}
        </Text>
        <Text className="font-sf-rounded-semibold text-[15px] text-grey-500">
          {category.promptCount} Prompts
        </Text>
      </View>
    </Pressable>
  );
};
