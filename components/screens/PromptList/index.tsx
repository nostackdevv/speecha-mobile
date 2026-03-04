import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PROMPTS } from '@/constants/prompts';

import type { PromptCategoryId } from '@/types/prompts';

import { PromptCard } from './PromptCard';

export const PromptList = () => {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{
    categoryId: PromptCategoryId;
  }>();

  const prompts = PROMPTS[categoryId] ?? [];

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pb-14 pt-4"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-8">
        <ScreenHeader title="Pick a prompt" />

        <View className="gap-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              onPress={() =>
                router.push({
                  pathname: '/recording',
                  params: { prompt: prompt.text, source: 'prompt' },
                })
              }
              prompt={prompt}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
