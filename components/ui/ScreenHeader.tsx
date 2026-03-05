import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/cn';

interface ScreenHeaderProps {
  className?: string;
  left?: React.ReactNode | null;
  onBack?: () => void;
  right?: React.ReactNode | null;
  testID?: string;
  title?: string;
  titlePlacement?: 'center' | 'left';
}

export const ScreenHeader = ({
  className,
  left,
  onBack,
  right,
  testID,
  title,
  titlePlacement = 'center',
}: ScreenHeaderProps) => {
  const router = useRouter();

  const backButton = (
    <IconButton
      accessibilityLabel="Go back"
      className="size-12 rounded-full"
      icon="arrowLeft"
      onPress={onBack ?? (() => router.back())}
      testID={testID ? `${testID}.back-btn` : undefined}
      variant="filled"
    />
  );

  const titleElement = title ? (
    <Text className="font-sf-rounded-semibold text-h4 text-black">{title}</Text>
  ) : null;

  if (titlePlacement === 'left') {
    return (
      <View className={cn('flex-row items-center', className)} testID={testID}>
        {titleElement}
        <View className="flex-1" />
        {right}
      </View>
    );
  }

  const leftSlot = left === undefined ? backButton : left;

  return (
    <View className={cn('flex-row items-center', className)} testID={testID}>
      {leftSlot}
      <View className="flex-1" />
      {titleElement ? (
        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
        >
          {titleElement}
        </View>
      ) : null}
      {right}
    </View>
  );
};
