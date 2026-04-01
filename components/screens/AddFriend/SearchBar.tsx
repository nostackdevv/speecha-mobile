import { TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { COLORS } from '@/constants/colors';

interface SearchBarProps {
  className?: string;
  onChangeText: (text: string) => void;
  value: string;
}

export const SearchBar = ({
  className,
  onChangeText,
  value,
}: SearchBarProps) => (
  <View
    className={cn(
      'h-[52px] flex-row items-center gap-3 rounded-32 bg-grey-50 px-4',
      className
    )}
    style={{ borderCurve: 'continuous' }}
  >
    <Icon color={COLORS.grey[500]} name="search" size={24} />
    <TextInput
      accessibilityLabel="Search friends by email or username"
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect={false}
      className="flex-1 font-sf-rounded-medium text-body-lg text-black"
      onChangeText={onChangeText}
      placeholder="Search by email or username"
      placeholderTextColor={COLORS.grey[500]}
      testID="add-friend.search"
      value={value}
    />
  </View>
);
