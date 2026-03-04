import { Text, View } from 'react-native';

import { ProgressBar } from '@/components/ui/ProgressBar';

interface FillerBreakdownProps {
  topFillers: { text: string; count: number }[];
}

export const FillerBreakdown = ({ topFillers }: FillerBreakdownProps) => {
  if (topFillers.length === 0) return null;

  const maxCount = topFillers[0].count;

  return (
    <View
      className="gap-4 rounded-20 bg-grey-100 p-6"
      style={{ borderCurve: 'continuous' }}
    >
      <Text className="font-sf-rounded-medium text-body-xl text-black">
        Your filler words
      </Text>
      <View className="gap-3">
        {topFillers.map((filler, index) => (
          <View key={filler.text} className="flex-row items-center gap-4">
            <View
              className="size-7 items-center justify-center rounded-32 bg-grey-200"
              style={{ borderCurve: 'continuous' }}
            >
              <Text className="font-sf-rounded-semibold text-body-xs text-grey-700">
                {index + 1}
              </Text>
            </View>
            <Text className="text-body w-20 font-sf-rounded-semibold text-black">
              {filler.text}
            </Text>
            <View className="w-[120px]">
              <ProgressBar progress={filler.count / maxCount} />
            </View>
            <Text className="text-body font-sf-rounded-semibold text-black">
              x{filler.count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
