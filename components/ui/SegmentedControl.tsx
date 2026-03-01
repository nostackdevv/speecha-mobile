import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { cn } from '@/lib/cn';

interface SegmentedControlProps {
  className?: string;
  onValueChange: (value: string) => void;
  segments: string[];
  selectedValue: string;
}

const PADDING_INSET = 8;

export const SegmentedControl = ({
  className,
  onValueChange,
  segments,
  selectedValue,
}: SegmentedControlProps) => {
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

  const handlePress = (segment: string) => {
    if (segment !== selectedValue) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onValueChange(segment);
  };

  return (
    <View
      accessibilityRole="tablist"
      className={cn('h-12 flex-row rounded-32 bg-grey-100 p-1', className)}
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
        >
          <Text
            className={cn(
              'font-sf-rounded-semibold text-body-sm',
              segment === selectedValue ? 'text-white' : 'text-grey-500'
            )}
          >
            {segment}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
