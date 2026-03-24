import { Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { FRIENDSHIP_STATUS_CONFIG } from '@/constants/friendship';
import { cn } from '@/lib/cn';
import { FriendshipStatus } from '@/types/friendship';

interface SearchResultCardProps {
  className?: string;
  id: string;
  name: string;
  onAdd: () => void;
  status: FriendshipStatus;
  username: string;
}

export const SearchResultCard = ({
  className,
  id,
  name,
  onAdd,
  status,
  username,
}: SearchResultCardProps) => {
  const { disabled, label } = FRIENDSHIP_STATUS_CONFIG[status];

  return (
    <View
      className={cn(
        'flex-row items-center gap-3 rounded-20 bg-grey-50 p-4',
        className
      )}
      style={{ borderCurve: 'continuous' }}
      testID={`add-friend.result-${id}`}
    >
      <Avatar size="sm" />
      <View className="flex-1">
        <Text className="text-body-base font-sf-rounded-medium text-black">
          {name}
        </Text>
        <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
          @{username}
        </Text>
      </View>
      <Button
        accessibilityLabel={disabled ? `${label} ${name}` : `Add ${name}`}
        disabled={disabled}
        onPress={onAdd}
        size="sm"
        testID={`add-friend.add-${id}`}
        title={label}
        variant={disabled ? 'secondary' : 'primary'}
      />
    </View>
  );
};
