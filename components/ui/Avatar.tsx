import { Pressable, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

import { Icon } from './Icon';

const SIZES = {
  lg: { avatar: 120, border: 3.6, container: 136, fallbackIcon: 48 },
  md: { avatar: 48, border: 2, container: 56, fallbackIcon: 20 },
  sm: { avatar: 36, border: 2, container: 44, fallbackIcon: 16 },
} as const;

const RING_STYLES = {
  lg: {
    alignItems: 'center' as const,
    borderRadius: 68,
    borderWidth: 3.6,
    height: 136,
    justifyContent: 'center' as const,
    width: 136,
  },
  md: {
    alignItems: 'center' as const,
    borderRadius: 28,
    borderWidth: 2,
    height: 56,
    justifyContent: 'center' as const,
    width: 56,
  },
  sm: {
    alignItems: 'center' as const,
    borderRadius: 22,
    borderWidth: 2,
    height: 44,
    justifyContent: 'center' as const,
    width: 44,
  },
} as const;

const ONLINE_INDICATOR_SIZES = {
  lg: { height: 24, width: 24 },
  md: { height: 14, width: 14 },
  sm: { height: 14, width: 14 },
} as const;

interface AvatarProps {
  className?: string;
  onPress?: () => void;
  ringColor?: string;
  showOnlineIndicator?: boolean;
  size?: 'lg' | 'md' | 'sm';
}

export const Avatar = ({
  className,
  onPress,
  ringColor,
  showOnlineIndicator,
  size = 'md',
}: AvatarProps) => {
  const { avatar, fallbackIcon } = SIZES[size];
  const showRing = !!ringColor;

  const content = (
    <View className={cn('items-center justify-center', className)}>
      <View
        style={
          showRing
            ? { ...RING_STYLES[size], borderColor: ringColor }
            : undefined
        }
      >
        <View
          className="items-center justify-center overflow-hidden rounded-full bg-grey-200"
          style={{ height: avatar, width: avatar }}
        >
          <Icon
            color={COLORS.grey[400]}
            name="userProfile"
            size={fallbackIcon}
          />
        </View>
      </View>
      {showOnlineIndicator && (
        <View
          className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-success-500"
          style={ONLINE_INDICATOR_SIZES[size]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};
