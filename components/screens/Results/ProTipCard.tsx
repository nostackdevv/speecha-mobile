import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';

const getTipText = (topFiller?: string): string => {
  if (!topFiller) {
    return 'Great job! Keep practicing daily to maintain your speaking clarity.';
  }
  return `Try pausing to articulate your thought instead "${topFiller}". A brief pause sounds more confident.`;
};

interface ProTipCardProps {
  topFiller?: string;
}

export const ProTipCard = ({ topFiller }: ProTipCardProps) => (
  <Card className="bg-grey-100" testID="results.pro-tip">
    <View className="flex-row items-center gap-2">
      <Icon color={COLORS.clarityBlue.DEFAULT} name="bulb" size={28} />
      <Text className="font-sf-rounded-medium text-body-xl text-black">
        Pro tip
      </Text>
    </View>
    <Text className="text-body mt-4 font-sf-rounded-medium text-grey-500">
      {getTipText(topFiller)}
    </Text>
  </Card>
);
