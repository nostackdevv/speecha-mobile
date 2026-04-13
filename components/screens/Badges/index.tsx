import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import {
  PROFILE_BADGE_VISUALS_MAP,
  type ProfileBadgeKey,
} from '@/constants/profileVisuals';
import { useMyBadges } from '@/hooks/useBadges';
import type { MyBadge } from '@/types/database';

const BADGES_PER_ROW = 3;

const BadgesRow = ({ badges }: { badges: MyBadge[] }) => {
  const emptySlotsCount = Math.max(0, BADGES_PER_ROW - badges.length);

  return (
    <View className="flex-row items-start justify-between gap-3">
      {badges.map((badge) => {
        const visual =
          PROFILE_BADGE_VISUALS_MAP[badge.badge_key as ProfileBadgeKey];

        if (!visual) return null;

        return (
          <View
            className="flex-1 items-center gap-1"
            key={badge.badge_key}
            style={{ opacity: badge.is_unlocked ? 1 : 0.4 }}
          >
            <visual.Icon height={visual.size} width={visual.size} />
            <Text className="text-center font-sf-rounded-semibold text-body-sm text-grey-800">
              {badge.title}
            </Text>
            <Text className="text-center font-sf-rounded-medium text-body-xs text-grey-500">
              {badge.caption}
            </Text>
            <Text className="text-center font-sf-rounded-medium text-body-xs text-grey-400">
              {badge.is_unlocked ? 'Unlocked' : 'Locked'}
            </Text>
          </View>
        );
      })}

      {Array.from({ length: emptySlotsCount }).map((_, index) => (
        <View className="flex-1" key={`badge-empty-slot-${index}`} />
      ))}
    </View>
  );
};

export const Badges = () => {
  const router = useRouter();
  const { data: badges, isLoading } = useMyBadges();

  const badgeRows = useMemo(() => {
    const rows: MyBadge[][] = [];
    const source = badges ?? [];

    for (let index = 0; index < source.length; index += BADGES_PER_ROW) {
      rows.push(source.slice(index, index + BADGES_PER_ROW));
    }

    return rows;
  }, [badges]);

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
          {isLoading ? (
            <View className="py-8">
              <ActivityIndicator />
            </View>
          ) : null}
          {badgeRows.map((row, index) => (
            <BadgesRow badges={row} key={`badges-row-${index}`} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
