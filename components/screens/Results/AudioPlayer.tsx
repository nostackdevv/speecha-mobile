import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

interface AudioPlayerProps {
  bottomInset?: number;
  uri: string | null;
}

export const AudioPlayer = ({ bottomInset = 0, uri }: AudioPlayerProps) => {
  const source = useMemo(() => (uri ? { uri } : null), [uri]);
  const player = useAudioPlayer(source, { updateInterval: 200 });
  const status = useAudioPlayerStatus(player);

  const duration = status.duration || 0;
  const currentTime = status.currentTime || 0;
  const isPlayable = Boolean(uri) && status.isLoaded;
  const progressPercent =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleTogglePlay = async () => {
    if (!isPlayable) return;
    if (status.playing) {
      player.pause();
      return;
    }

    if (currentTime >= duration && duration > 0) {
      await player.seekTo(0);
    }

    player.play();
  };

  const handleSeek = async (secondsDelta: number) => {
    if (!isPlayable || duration <= 0) return;
    const nextTime = Math.min(
      Math.max(currentTime + secondsDelta, 0),
      duration
    );
    await player.seekTo(nextTime);
  };

  return (
    <View
      className="gap-3 bg-white px-6 pt-4"
      style={{
        paddingBottom: Math.max(bottomInset, 8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      }}
      testID="results.audio-player"
    >
      {!uri ? (
        <Text className="text-center font-sf-rounded-medium text-body-sm text-grey-500">
          Audio replay is available only on this device.
        </Text>
      ) : null}
      <View className="gap-3">
        <View className="h-3 overflow-hidden rounded-24 bg-grey-200">
          <View
            className="h-full rounded-24 bg-clarity-blue"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text
            className="font-sf-rounded-medium text-body-xs text-grey-700"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(currentTime)}
          </Text>
          <Text
            className="font-sf-rounded-medium text-body-xs text-grey-700"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(duration)}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-center gap-10">
        <IconButton
          accessibilityLabel="Rewind 15 seconds"
          className="size-12 rounded-32"
          disabled={!isPlayable}
          icon="rotateBack"
          onPress={() => void handleSeek(-15)}
          testID="results.rewind"
          variant="filled"
        />
        <Pressable
          accessibilityLabel={status.playing ? 'Pause audio' : 'Play audio'}
          accessibilityRole="button"
          className={cn(
            'h-14 w-24 items-center justify-center rounded-32',
            isPlayable ? 'bg-clarity-blue' : 'bg-grey-300'
          )}
          disabled={!isPlayable}
          onPress={() => void handleTogglePlay()}
          style={({ pressed }) => ({
            borderCurve: 'continuous',
            opacity: !isPlayable ? 0.7 : pressed ? 0.85 : 1,
          })}
          testID="results.play-pause"
        >
          <Icon
            color={COLORS.white}
            name={status.playing ? 'pause' : 'play'}
            size={24}
          />
        </Pressable>
        <IconButton
          accessibilityLabel="Forward 15 seconds"
          className="size-12 rounded-32"
          disabled={!isPlayable}
          icon="rotateForward"
          onPress={() => void handleSeek(15)}
          testID="results.forward"
          variant="filled"
        />
      </View>
    </View>
  );
};
