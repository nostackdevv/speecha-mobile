import { Text, View } from 'react-native';

import type { FriendStats } from '@/types/database';

interface ProfileStatsProps {
  stats: FriendStats;
}

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <View
    className="h-[124px] flex-1 items-center justify-center gap-1 rounded-xl bg-grey-100"
    style={{ borderCurve: 'continuous' }}
  >
    <Text className="font-sf-rounded-semibold text-body-xl text-black">
      {value}
    </Text>
    <Text className="font-sf-rounded-medium text-body-sm uppercase text-grey-400">
      {label}
    </Text>
  </View>
);

export const ProfileStats = ({ stats }: ProfileStatsProps) => (
  <View className="gap-3">
    <View className="flex-row gap-3">
      <StatItem label="Total Session" value={String(stats.total_analyses)} />
      <StatItem
        label="Avg Clarity"
        value={`${Math.round(stats.avg_clarity)}%`}
      />
    </View>
    <View className="flex-row gap-3">
      <StatItem label="Top Filler Word" value={stats.top_filler_word ?? '-'} />
      <StatItem label="Total Words" value={String(stats.total_words ?? 0)} />
    </View>
  </View>
);
