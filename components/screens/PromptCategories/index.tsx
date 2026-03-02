import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PROMPT_CATEGORIES } from '@/constants/prompts';

import { CategoryCard } from './CategoryCard';

export const PromptCategories = () => {
  const router = useRouter();

  return (
    <FlatList
      data={PROMPT_CATEGORIES}
      numColumns={2}
      keyExtractor={(item) => item.id}
      contentContainerClassName="px-6 pb-14 pt-4 gap-8"
      columnWrapperClassName="gap-5 flex-1 space-around"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<ScreenHeader title="Choose category" />}
      renderItem={({ item }) => (
        <CategoryCard
          category={item}
          onPress={() =>
            router.push({
              pathname: '/prompt-list',
              params: { categoryId: item.id },
            })
          }
        />
      )}
    />
  );
};
