import { ActivityIndicator, Text, View } from 'react-native';

import { useSpeechAnalysisList } from '@/hooks/useSpeechAnalyses';
import { getThisWeekSummary } from '@/lib/speechMetrics';

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-1 items-center gap-0.5 p-2">
    <Text className="font-sf-rounded-medium text-base text-black">{value}</Text>
    <Text className="font-sf-rounded-medium text-body-sm uppercase text-grey-500">
      {label}
    </Text>
  </View>
);

const Divider = () => (
  <View className="self-stretch py-2">
    <View className="w-0.5 flex-1 rounded-full bg-grey-100" />
  </View>
);

export const WeekSummary = () => {
  const { data: sessions, isLoading } = useSpeechAnalysisList();
  const weekSummary = getThisWeekSummary(sessions ?? []);

  return (
    <View
      className="overflow-hidden rounded-[24px] bg-grey-50 p-5"
      style={{ borderCurve: 'continuous' }}
    >
      <View className="gap-4">
        <Text className="font-sf-rounded-medium text-body-lg text-black">
          This week summary
        </Text>
        {isLoading ? (
          <View className="items-center py-5">
            <ActivityIndicator />
          </View>
        ) : (
          <View className="flex-row items-center">
            <StatItem label="SESSIONS" value={String(weekSummary.sessions)} />
            <Divider />
            <StatItem
              label="FILLER/MIN"
              value={String(weekSummary.fillersPerMinute)}
            />
            <Divider />
            <StatItem
              label="AVR CLARITY"
              value={`${weekSummary.avgClarity}%`}
            />
          </View>
        )}
      </View>
    </View>
  );
};
