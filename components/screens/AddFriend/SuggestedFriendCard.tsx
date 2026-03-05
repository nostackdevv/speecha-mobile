import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/cn';

interface SuggestedFriendCardProps {
  added: boolean;
  className?: string;
  id: string;
  name: string;
  onAdd: () => void;
  subtitle: string;
}

export const SuggestedFriendCard = ({
  added,
  className,
  id,
  name,
  onAdd,
  subtitle,
}: SuggestedFriendCardProps) => {
  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAdd();
  };

  return (
    <View
      className={cn(
        'flex-row items-center gap-3 rounded-20 bg-grey-50 p-4',
        className
      )}
      style={{ borderCurve: 'continuous' }}
      testID={`add-friend.suggested-${id}`}
    >
      <Avatar size="sm" />
      <View className="flex-1">
        <Text className="text-body-base font-sf-rounded-medium text-black">
          {name}
        </Text>
        <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
          {subtitle}
        </Text>
      </View>
      <Pressable
        accessibilityLabel={added ? `Added ${name}` : `Add ${name}`}
        accessibilityRole="button"
        className={cn(
          'h-8 items-center justify-center rounded-32 px-4',
          added ? 'bg-grey-200/40' : 'bg-clarity-blue'
        )}
        disabled={added}
        onPress={handleAdd}
        style={({ pressed }) => ({
          borderCurve: 'continuous',
          opacity: added ? 0.6 : pressed ? 0.85 : 1,
        })}
        testID={`add-friend.add-${id}`}
      >
        <Text
          className={cn(
            'font-sf-rounded-medium text-body-sm',
            added ? 'text-grey-500' : 'text-white'
          )}
        >
          {added ? 'Added' : 'Add'}
        </Text>
      </Pressable>
    </View>
  );
};
