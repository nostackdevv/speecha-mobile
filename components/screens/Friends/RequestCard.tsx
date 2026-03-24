import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';

interface RequestCardProps {
  id: string;
  name: string;
  onRespond: (status: 'accepted' | 'rejected') => void;
  streak: number;
}

export const RequestCard = ({
  id,
  name,
  onRespond,
  streak,
}: RequestCardProps) => {
  const handleAccept = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRespond('accepted');
  };

  const handleReject = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRespond('rejected');
  };

  return (
    <View
      className="flex-row items-center gap-3 rounded-20 bg-grey-50 p-4"
      style={{ borderCurve: 'continuous' }}
      testID={`friends.request-${id}`}
    >
      <Avatar size="sm" />
      <View className="flex-1">
        <Text className="text-body-base font-sf-rounded-medium text-black">
          {name}
        </Text>
        <View className="flex-row items-center gap-1">
          <Icon color={COLORS.clarityBlue.DEFAULT} name="fire" size={16} />
          <Text className="text-body-base font-sf-rounded-medium text-clarity-blue">
            {streak}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <Pressable
          accessibilityLabel={`Accept ${name}'s request`}
          accessibilityRole="button"
          className="h-8 w-8 items-center justify-center rounded-full bg-clarity-blue"
          onPress={handleAccept}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          testID={`friends.accept-${id}`}
        >
          <Icon color={COLORS.white} name="check" size={18} />
        </Pressable>
        <Pressable
          accessibilityLabel={`Reject ${name}'s request`}
          accessibilityRole="button"
          className="h-8 w-8 items-center justify-center rounded-full bg-grey-200"
          onPress={handleReject}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          testID={`friends.reject-${id}`}
        >
          <Icon color={COLORS.grey[500]} name="close" size={16} />
        </Pressable>
      </View>
    </View>
  );
};
