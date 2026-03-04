import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { COLORS } from '@/constants/colors';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const AudioPlayer = () => {
  return (
    <View
      className="gap-3 bg-white px-6 pb-2 pt-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      }}
      testID="results.audio-player"
    >
      <View className="gap-3">
        <View className="h-3 overflow-hidden rounded-24 bg-grey-200">
          <View className="h-full w-0 rounded-24 bg-clarity-blue" />
        </View>
        <View className="flex-row items-center justify-between">
          <Text
            className="font-sf-rounded-medium text-body-xs text-grey-700"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(0)}
          </Text>
          <Text
            className="font-sf-rounded-medium text-body-xs text-grey-700"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(0)}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-center gap-10">
        <IconButton
          accessibilityLabel="Rewind 15 seconds"
          className="size-12 rounded-32"
          icon="rotateBack"
          onPress={() => {}}
          testID="results.rewind"
          variant="filled"
        />
        <View
          className="h-14 w-24 items-center justify-center rounded-32 bg-clarity-blue"
          style={{ borderCurve: 'continuous' }}
          testID="results.play-pause"
        >
          <Icon color={COLORS.white} name="play" size={24} />
        </View>
        <IconButton
          accessibilityLabel="Forward 15 seconds"
          className="size-12 rounded-32"
          icon="rotateForward"
          onPress={() => {}}
          testID="results.forward"
          variant="filled"
        />
      </View>
    </View>
  );
};
