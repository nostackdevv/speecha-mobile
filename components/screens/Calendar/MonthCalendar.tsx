import { Text, View } from 'react-native';

import { DateCell } from './DateCell';

interface MonthCalendarProps {
  month: number;
  practicedDates: Set<string>;
  sessionCount: number;
  year: number;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfWeek = (year: number, month: number): number =>
  new Date(year, month, 1).getDay();

const formatDateKey = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const getMonthName = (month: number): string => {
  const names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return names[month];
};

const buildCalendarGrid = (
  year: number,
  month: number
): (number | null)[][] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const rows: (number | null)[][] = [];
  let currentDay = 1;

  const firstRow: (number | null)[] = [];
  for (let i = 0; i < 7; i++) {
    if (i < firstDay) {
      firstRow.push(null);
    } else {
      firstRow.push(currentDay++);
    }
  }
  rows.push(firstRow);

  while (currentDay <= daysInMonth) {
    const row: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay <= daysInMonth) {
        row.push(currentDay++);
      } else {
        row.push(null);
      }
    }
    rows.push(row);
  }

  return rows;
};

export const MonthCalendar = ({
  month,
  practicedDates,
  sessionCount,
  year,
}: MonthCalendarProps) => {
  const grid = buildCalendarGrid(year, month);

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-sf-rounded-semibold text-base text-black">
          {getMonthName(month)} {year}
        </Text>
        <Text className="font-sf-rounded-medium text-base text-grey-500">
          {sessionCount} sessions
        </Text>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center py-2.5">
          {DAY_LABELS.map((label) => (
            <View className="flex-1 items-center" key={label}>
              <Text className="font-sf-rounded-medium text-base text-grey-400">
                {label}
              </Text>
            </View>
          ))}
        </View>

        <View className="gap-5">
          {grid.map((row, rowIndex) => (
            <View className="flex-row" key={rowIndex}>
              {row.map((day, colIndex) => (
                <DateCell
                  day={day}
                  key={`${rowIndex}-${colIndex}`}
                  practiced={
                    day !== null &&
                    practicedDates.has(formatDateKey(year, month, day))
                  }
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
