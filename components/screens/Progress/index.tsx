import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FillerBreakdownGrid } from './FillerBreakdownGrid';
import { SessionHistory } from './SessionHistory';
import { StreakCards } from './StreakCards';
import { WeekSummary } from './WeekSummary';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useRouter } from 'expo-router';

export const Progress = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pb-10"
      showsVerticalScrollIndicator={false}
      style={{ paddingTop: insets.top + 16 }}
      testID="progress.screen"
    >
      <View className="gap-6">
        <ScreenHeader
          left={null}
          right={
            <IconButton
              accessibilityLabel="Open calendar"
              className="size-12 rounded-32"
              icon="calendar"
              onPress={() => router.push('/calendar')}
              testID="progress.calendar-btn"
              variant="filled"
            />
          }
          title="Progress"
          titlePlacement="left"
        />
        <StreakCards />
        <WeekSummary />
        <FillerBreakdownGrid />
        <SessionHistory />
      </View>
    </ScrollView>
  );
};
