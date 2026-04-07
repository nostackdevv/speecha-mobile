import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useSpeechAnalysisList } from '@/hooks/useSpeechAnalyses';

import { MonthCalendar } from './MonthCalendar';

const getMonthsBetween = (
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number
): { month: number; year: number }[] => {
  const months: { month: number; year: number }[] = [];
  let y = startYear;
  let m = startMonth;

  while (y < endYear || (y === endYear && m <= endMonth)) {
    months.push({ month: m, year: y });
    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
  }

  return months;
};

export const Calendar = () => {
  const insets = useSafeAreaInsets();
  const { data: sessions, isLoading } = useSpeechAnalysisList();

  const { months, practicedDates, sessionCountByMonth } = useMemo(() => {
    const dates = new Set<string>();
    const countByMonth: Record<string, number> = {};

    const allSessions = sessions ?? [];

    if (allSessions.length === 0) {
      const now = new Date();
      return {
        months: [{ month: now.getMonth(), year: now.getFullYear() }],
        practicedDates: dates,
        sessionCountByMonth: countByMonth,
      };
    }

    let earliestDate = new Date(allSessions[0].created_at);

    allSessions.forEach((session) => {
      const dateStr = session.created_at.split('T')[0];
      dates.add(dateStr);

      const d = new Date(session.created_at);
      if (d < earliestDate) earliestDate = d;

      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      countByMonth[monthKey] = (countByMonth[monthKey] ?? 0) + 1;
    });

    const now = new Date();
    const futureLimit = new Date(now.getTime() + 6 * 7 * 24 * 60 * 60 * 1000);

    const monthList = getMonthsBetween(
      earliestDate.getFullYear(),
      earliestDate.getMonth(),
      futureLimit.getFullYear(),
      futureLimit.getMonth()
    );

    return {
      months: monthList,
      practicedDates: dates,
      sessionCountByMonth: countByMonth,
    };
  }, [sessions]);

  return (
    <View className="flex-1 bg-white" testID="calendar.screen">
      <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
        <ScreenHeader testID="calendar" title="Calendar" />
      </View>

      {isLoading ? (
        <View className="items-center py-10">
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-10 pt-8"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-8">
            {months.length > 0 ? (
              months.map(({ month, year }) => (
                <MonthCalendar
                  key={`${year}-${month}`}
                  month={month}
                  practicedDates={practicedDates}
                  sessionCount={sessionCountByMonth[`${year}-${month}`] ?? 0}
                  year={year}
                />
              ))
            ) : (
              <Text className="text-body-base text-center font-sf-rounded-medium text-grey-500">
                No sessions yet
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
