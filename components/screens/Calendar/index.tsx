import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MOCK_SESSIONS } from '@/constants/mockSessions';

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

  const { months, practicedDates, sessionCountByMonth } = useMemo(() => {
    const dates = new Set<string>();
    const countByMonth: Record<string, number> = {};

    let earliestDate = new Date(MOCK_SESSIONS[0].date);

    MOCK_SESSIONS.forEach((session) => {
      const dateStr = session.date.split('T')[0];
      dates.add(dateStr);

      const d = new Date(session.date);
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
  }, []);

  return (
    <View className="flex-1 bg-white" testID="calendar.screen">
      <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
        <ScreenHeader testID="calendar" title="Calendar" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-10 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-8">
          {months.map(({ month, year }) => (
            <MonthCalendar
              key={`${year}-${month}`}
              month={month}
              practicedDates={practicedDates}
              sessionCount={sessionCountByMonth[`${year}-${month}`] ?? 0}
              year={year}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
