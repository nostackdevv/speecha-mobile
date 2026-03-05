import { Text, View } from 'react-native';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { MOCK_TOP_FILLERS } from '@/constants/mockSessions';

const FillerItem = ({ count, word }: { count: number; word: string }) => (
  <View
    className="h-[124px] flex-1 items-center justify-center rounded-[12px] bg-grey-200"
    style={{ borderCurve: 'continuous' }}
  >
    <View className="items-center gap-2">
      <Text className="font-sf-rounded-medium text-base text-black">
        &ldquo;{word}&rdquo;
      </Text>
      <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
        {count}x
      </Text>
    </View>
  </View>
);

export const FillerBreakdownGrid = () => {
  return (
    <View
      className="gap-6 overflow-hidden rounded-[24px] bg-grey-50 p-5"
      style={{ borderCurve: 'continuous' }}
    >
      <SectionHeader title="Filler breakdown" trailing="This month" />
      <View className="gap-3">
        <View className="flex-row gap-3">
          <FillerItem
            count={MOCK_TOP_FILLERS[0].count}
            word={MOCK_TOP_FILLERS[0].word}
          />
          <FillerItem
            count={MOCK_TOP_FILLERS[1].count}
            word={MOCK_TOP_FILLERS[1].word}
          />
        </View>
        <View className="flex-row gap-3">
          <FillerItem
            count={MOCK_TOP_FILLERS[2].count}
            word={MOCK_TOP_FILLERS[2].word}
          />
          <FillerItem
            count={MOCK_TOP_FILLERS[3].count}
            word={MOCK_TOP_FILLERS[3].word}
          />
        </View>
      </View>
    </View>
  );
};
