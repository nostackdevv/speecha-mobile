import { Text, View } from 'react-native';

import { StatCard } from '@/components/ui/StatCard';
import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';

interface StatsRowProps {
  fillerCount: number;
  fillersPerMinute: number;
  totalWords: number;
}

export const StatsRow = ({
  fillerCount,
  fillersPerMinute,
  totalWords,
}: StatsRowProps) => {
  const hasFillers = fillerCount > 0;

  return (
    <View className="gap-3">
      {hasFillers ? (
        <View className="flex-row gap-3">
          <StatCard
            className="flex-1"
            label="Filler Count"
            testID="results.filler-count"
            value={String(fillerCount)}
          />
          <StatCard
            className="flex-1"
            label="Filler Per Min"
            testID="results.filler-per-min"
            value={String(fillersPerMinute)}
          />
        </View>
      ) : (
        <View
          className="items-center gap-2 rounded-20 bg-success-50 p-6"
          style={{ borderCurve: 'continuous' }}
          testID="results.no-fillers"
        >
          <Icon color={COLORS.success[500]} name="smiley" size={28} />
          <Text className="font-sf-rounded-semibold text-body-md text-success-600">
            Yay! You have no filler words
          </Text>
        </View>
      )}
      <StatCard
        label="Total Words"
        testID="results.total-words"
        value={String(totalWords)}
      />
    </View>
  );
};
