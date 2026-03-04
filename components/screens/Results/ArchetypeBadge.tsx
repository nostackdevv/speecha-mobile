import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { getArchetype } from '@/constants/archetypes';
import { COLORS } from '@/constants/colors';

interface ArchetypeBadgeProps {
  score: number;
}

export const ArchetypeBadge = ({ score }: ArchetypeBadgeProps) => {
  const archetype = getArchetype(score);

  return (
    <View className="items-center gap-3">
      <Icon
        color={COLORS.momentumOrange.DEFAULT}
        name={archetype.icon}
        size={64}
      />
      <View className="items-center gap-1">
        <Text className="font-sf-rounded-semibold text-body-xl text-black">
          {archetype.title}
        </Text>
        <Text className="font-sf-rounded text-body-lg text-grey-500">
          +5% vs last session
        </Text>
      </View>
    </View>
  );
};
