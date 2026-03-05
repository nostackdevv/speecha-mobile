import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { cn } from '@/lib/cn';

interface SegmentedControlProps<T extends string> {
  badges?: Partial<Record<T, number>>;
  className?: string;
  onValueChange: (value: T) => void;
  segments: readonly T[];
  selectedValue: T;
  testID?: string;
}

const PADDING_INSET = 8;

export const SegmentedControl = <T extends string>({
  badges,
  className,
  onValueChange,
  segments,
  selectedValue,
  testID,
}: SegmentedControlProps<T>) => {
  const selectedIndex = segments.indexOf(selectedValue);
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);

  const itemWidth = containerWidth > 0 ? containerWidth / segments.length : 0;

  useEffect(() => {
    if (itemWidth > 0) {
      translateX.value = withTiming(selectedIndex * itemWidth, {
        duration: 250,
      });
    }
  }, [selectedIndex, itemWidth, translateX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: itemWidth,
  }));

  const handlePress = (segment: T) => {
    if (segment !== selectedValue) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onValueChange(segment);
  };

  return (
    <View
      accessibilityRole="tablist"
      className={cn('h-12 flex-row rounded-32 bg-grey-50 p-1', className)}
      testID={testID}
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width - PADDING_INSET);
      }}
      style={{ borderCurve: 'continuous' }}
    >
      {containerWidth > 0 && (
        <Animated.View
          className="absolute left-1 top-1 h-10 rounded-32 bg-clarity-blue"
          style={[pillStyle, { borderCurve: 'continuous' }]}
        />
      )}
      {segments.map((segment) => (
        <Pressable
          accessibilityLabel={segment}
          accessibilityRole="tab"
          accessibilityState={{ selected: segment === selectedValue }}
          className="flex-1 items-center justify-center"
          key={segment}
          onPress={() => handlePress(segment)}
          testID={
            testID
              ? `${testID}.${segment.toLowerCase().replace(/\s+/g, '-')}`
              : undefined
          }
        >
          <View className="flex-row items-center gap-1.5">
            <Text
              className={cn(
                'font-sf-rounded-semibold text-body-lg',
                segment === selectedValue ? 'text-white' : 'text-grey-500'
              )}
            >
              {segment}
            </Text>
            {/* TODO: should this be a component */}
            {badges?.[segment] ? (
              <View
                className={cn(
                  'h-6 min-w-6 items-center justify-center rounded-full px-1.5',
                  segment === selectedValue
                    ? 'bg-clarity-blue-00'
                    : 'bg-grey-200'
                )}
              >
                <Text
                  className={cn(
                    'font-sf-rounded-semibold text-body-xs',
                    segment === selectedValue ? 'text-white' : 'text-grey-500'
                  )}
                >
                  {badges[segment]}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
};
