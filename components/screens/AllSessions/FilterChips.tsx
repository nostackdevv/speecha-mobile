import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/cn';

type FilterValue = 'all' | 'prompt' | 'random';

interface FilterChipsProps {
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  selectionMode?: boolean;
}

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Prompt', value: 'prompt' },
  { label: 'Random Practice', value: 'random' },
];

export const FilterChips = ({
  activeFilter,
  onFilterChange,
  selectionMode = false,
}: FilterChipsProps) => {
  return (
    <View
      className={cn('flex-row gap-4', selectionMode && 'opacity-[0.56]')}
      pointerEvents={selectionMode ? 'none' : 'auto'}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <Pressable
            accessibilityLabel={filter.label}
            accessibilityRole="button"
            className={cn(
              'rounded-[32px] px-4 py-2',
              isActive ? 'bg-clarity-blue' : 'bg-grey-50'
            )}
            key={filter.value}
            onPress={() => onFilterChange(filter.value)}
            style={{ borderCurve: 'continuous' }}
            testID={`all-sessions.filter-${filter.value}`}
          >
            <Text
              className={cn(
                'font-sf-rounded-medium text-body-sm',
                isActive ? 'text-white' : 'text-grey-500'
              )}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
