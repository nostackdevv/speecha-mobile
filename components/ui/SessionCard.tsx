import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

import { Icon } from './Icon';

interface SessionCardProps {
  className?: string;
  date: string;
  duration: string;
  onLongPress?: () => void;
  onPress?: () => void;
  selected?: boolean;
  showCheckbox?: boolean;
  testID?: string;
  title: string;
}

export const SessionCard = ({
  className,
  date,
  duration,
  onLongPress,
  onPress,
  selected = false,
  showCheckbox = false,
  testID,
  title,
}: SessionCardProps) => {
  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.();
  };

  return (
    <Pressable
      className={cn(
        'flex-row items-center',
        showCheckbox && 'gap-4',
        className
      )}
      onLongPress={onLongPress ? handleLongPress : undefined}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      testID={testID}
    >
      {showCheckbox ? (
        <View
          className={cn(
            'size-7 items-center justify-center rounded-[20px]',
            selected ? 'bg-clarity-blue' : 'border-2 border-grey-300'
          )}
        >
          {selected ? (
            <Icon color={COLORS.white} name="check" size={14} />
          ) : null}
        </View>
      ) : null}

      <View
        className="flex-1 flex-row items-center gap-4 rounded-[24px] bg-grey-50 p-4"
        style={{ borderCurve: 'continuous' }}
      >
        <View className="size-10 items-center justify-center rounded-full bg-grey-200">
          <Icon color={COLORS.grey[500]} name="play" size={20} />
        </View>

        <View className="flex-1 flex-row items-center justify-between">
          <View className="gap-1">
            <Text className="font-sf-rounded-medium text-base text-black">
              {title}
            </Text>
            <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
              {date}
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Icon color={COLORS.grey[500]} name="clock" size={20} />
            <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
              {duration}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
