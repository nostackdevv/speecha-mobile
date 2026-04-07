import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { PROFILE_BADGES } from '@/constants/profileVisuals';

const BadgesRow = ({
  badges,
}: {
  badges: (typeof PROFILE_BADGES)[number][];
}) => {
  return (
    <View className="flex-row items-start justify-between gap-3">
      {badges.map((badge) => (
        <View className="flex-1 items-center gap-2" key={badge.key}>
          <badge.Icon height={badge.size} width={badge.size} />
          <Text className="text-center font-sf-rounded-medium text-body-sm text-grey-700">
            {badge.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export const Badges = () => {
  const router = useRouter();

  const badgeRows = useMemo(() => {
    const rows: (typeof PROFILE_BADGES)[] = [];

    for (let index = 0; index < PROFILE_BADGES.length; index += 3) {
      rows.push(PROFILE_BADGES.slice(index, index + 3));
    }

    return rows;
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
      testID="badges.screen"
    >
      <View className="gap-8">
        <View
          className="relative h-12 flex-row items-center"
          testID="badges.header"
        >
          <IconButton
            accessibilityLabel="Go back"
            className="size-12 rounded-full"
            icon="arrowLeft"
            onPress={() => router.back()}
            testID="badges.back-btn"
            variant="filled"
          />

          <View
            className="absolute inset-0 items-center justify-center"
            pointerEvents="none"
          >
            <Text className="font-sf-rounded-semibold text-h4 text-black">
              Badges
            </Text>
          </View>
        </View>

        <View className="gap-8">
          {badgeRows.map((row, index) => (
            <BadgesRow badges={row} key={`badges-row-${index}`} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
