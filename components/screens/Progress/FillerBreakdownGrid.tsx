import { ActivityIndicator, Text, View } from 'react-native';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSpeechAnalysisList } from '@/hooks/useSpeechAnalyses';
import { getTopFillersThisMonth } from '@/lib/speechMetrics';

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
  const { data: sessions, isLoading } = useSpeechAnalysisList();
  const topFillers = getTopFillersThisMonth(sessions ?? []);

  return (
    <View
      className="gap-6 overflow-hidden rounded-[24px] bg-grey-50 p-5"
      style={{ borderCurve: 'continuous' }}
    >
      <SectionHeader title="Filler breakdown" trailing="This month" />
      {isLoading ? (
        <View className="items-center py-5">
          <ActivityIndicator />
        </View>
      ) : topFillers.length > 0 ? (
        <View className="gap-3">
          <View className="flex-row gap-3">
            <FillerItem count={topFillers[0].count} word={topFillers[0].word} />
            {topFillers[1] ? (
              <FillerItem
                count={topFillers[1].count}
                word={topFillers[1].word}
              />
            ) : null}
          </View>
          {topFillers[2] || topFillers[3] ? (
            <View className="flex-row gap-3">
              {topFillers[2] ? (
                <FillerItem
                  count={topFillers[2].count}
                  word={topFillers[2].word}
                />
              ) : null}
              {topFillers[3] ? (
                <FillerItem
                  count={topFillers[3].count}
                  word={topFillers[3].word}
                />
              ) : null}
            </View>
          ) : null}
        </View>
      ) : (
        <Text className="py-5 text-center font-sf-rounded-medium text-body-sm text-grey-500">
          No filler words captured this month yet.
        </Text>
      )}
    </View>
  );
};
