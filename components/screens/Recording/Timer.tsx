import { Text } from 'react-native';

interface TimerProps {
  seconds: number;
  testID?: string;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const Timer = ({ seconds, testID }: TimerProps) => {
  return (
    <Text
      className="font-sf-rounded-semibold text-h2 text-black"
      style={{ fontVariant: ['tabular-nums'] }}
      testID={testID}
    >
      {formatTime(seconds)}
    </Text>
  );
};
