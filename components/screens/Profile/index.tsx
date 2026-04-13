import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { COLORS } from '@/constants/colors';
import {
  DEFAULT_PROFILE_AVATAR_KEY,
  PROFILE_AVATAR_MAP,
  PROFILE_BADGE_VISUALS_MAP,
  type ProfileBadgeKey,
} from '@/constants/profileVisuals';
import { useMyBadges } from '@/hooks/useBadges';
import { useProfile } from '@/hooks/useProfile';
import { useSelectedProfileAvatar } from '@/hooks/useSelectedProfileAvatar';
import { useSpeechAnalysisList } from '@/hooks/useSpeechAnalyses';
import { useTier } from '@/hooks/useTier';
import { cn } from '@/lib/cn';
import type { SpeechAnalysis } from '@/types/database';

const toTitleCase = (value: string): string =>
  value
    .split(' ')
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ''}${word.slice(1)}`)
    .join(' ');

const formatCompactWords = (value: number): string => {
  if (value >= 1000) {
    const compact = (value / 1000).toFixed(value >= 100000 ? 0 : 1);
    return `${compact.replace('.0', '')}K`;
  }

  return String(value);
};

const readWordsCount = (analysis: SpeechAnalysis): number => {
  const data = analysis.transcript_data;

  if (!data || typeof data !== 'object' || Array.isArray(data)) return 0;

  const words = (data as { words?: unknown }).words;
  return Array.isArray(words) ? words.length : 0;
};

const readFillerWords = (analysis: SpeechAnalysis): string[] => {
  const data = analysis.transcript_data;

  if (!data || typeof data !== 'object' || Array.isArray(data)) return [];

  const fillers = (data as { fillers?: unknown }).fillers;
  if (!Array.isArray(fillers)) return [];

  return fillers
    .map((filler) => {
      if (!filler || typeof filler !== 'object') return null;
      const text = (filler as { displayText?: unknown }).displayText;
      return typeof text === 'string' ? text.trim().toLowerCase() : null;
    })
    .filter((word): word is string => Boolean(word));
};

const ProfileStatCard = ({
  className,
  title,
  value,
}: {
  className?: string;
  title: string;
  value: string;
}) => (
  <View
    className={cn(
      'h-[120px] items-center justify-center gap-0.5 rounded-xl bg-grey-100',
      className
    )}
    style={{ borderCurve: 'continuous' }}
  >
    <Text className="font-sf-rounded-semibold text-body-xl text-black">
      {value}
    </Text>
    <Text className="font-sf-rounded-medium text-body-sm uppercase tracking-wide text-grey-400">
      {title}
    </Text>
  </View>
);

const ProfileBadge = ({
  badgeKey,
  isUnlocked,
  label,
}: {
  badgeKey: string;
  isUnlocked: boolean;
  label: string;
}) => {
  const visual = PROFILE_BADGE_VISUALS_MAP[badgeKey as ProfileBadgeKey];
  const BadgeIcon = visual?.Icon;

  if (!BadgeIcon || !visual) return null;

  return (
    <View className="flex-1 items-center gap-2" style={{ opacity: isUnlocked ? 1 : 0.4 }}>
      <BadgeIcon height={visual.size} width={visual.size} />
      <Text className="text-center font-sf-rounded text-body-sm text-grey-800">
        {label}
      </Text>
    </View>
  );
};

export const Profile = () => {
  const router = useRouter();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: badges } = useMyBadges();
  const { data: selectedAvatarKey } = useSelectedProfileAvatar();
  const { data: sessions, isLoading: isSessionsLoading } =
    useSpeechAnalysisList();
  const { isPro } = useTier();

  const totalWords = useMemo(() => {
    return (sessions ?? []).reduce(
      (count, analysis) => count + readWordsCount(analysis),
      0
    );
  }, [sessions]);

  const averageClarity = useMemo(() => {
    if (!sessions || sessions.length === 0) return 0;

    const total = sessions.reduce(
      (sum, analysis) => sum + analysis.clarity_score,
      0
    );

    return Math.round(total / sessions.length);
  }, [sessions]);

  const commonFiller = useMemo(() => {
    const counts = new Map<string, number>();

    (sessions ?? []).forEach((analysis) => {
      readFillerWords(analysis).forEach((word) => {
        counts.set(word, (counts.get(word) ?? 0) + 1);
      });
    });

    const top = Array.from(counts.entries()).sort((a, b) => {
      if (a[1] === b[1]) return a[0].localeCompare(b[0]);
      return b[1] - a[1];
    })[0]?.[0];

    return top ? `"${toTitleCase(top)}"` : '--';
  }, [sessions]);

  const displayName =
    profile?.full_name?.trim() || profile?.username || 'Your Name';

  const previewBadges = useMemo(() => {
    const source = badges ?? [];
    const unlocked = source.filter((badge) => badge.is_unlocked);
    const prioritized = unlocked.length > 0 ? unlocked : source;

    return prioritized.slice(0, 3);
  }, [badges]);

  const persistedAvatar =
    PROFILE_AVATAR_MAP[selectedAvatarKey ?? DEFAULT_PROFILE_AVATAR_KEY];

  const avatarSource = profile?.avatar_url
    ? { uri: profile.avatar_url }
    : persistedAvatar;

  if (isProfileLoading && !profile && isSessionsLoading) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        testID="profile.screen"
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
      testID="profile.screen"
    >
      <View className="gap-6">
        <View
          className="relative h-12 flex-row items-center justify-between"
          testID="profile.header"
        >
          <IconButton
            accessibilityLabel="Go back"
            className="size-12 rounded-full"
            icon="arrowLeft"
            onPress={() => router.back()}
            testID="profile.back-btn"
            variant="filled"
          />

          <View
            className="absolute inset-0 items-center justify-center"
            pointerEvents="none"
          >
            <Text className="font-sf-rounded-semibold text-h4 text-black">
              Profile
            </Text>
          </View>

          <IconButton
            accessibilityLabel="Open settings"
            className="size-12 rounded-full"
            icon="settings"
            onPress={() => router.push('/settings')}
            testID="profile.settings-btn"
            variant="filled"
          />
        </View>

        <View className="items-center gap-2">
          <View
            className="items-center justify-center rounded-full border-clarity-blue"
            style={{
              borderCurve: 'continuous',
              borderWidth: 3.6,
              height: 136,
              width: 136,
            }}
          >
            <View
              className="overflow-hidden rounded-full"
              style={{
                borderCurve: 'continuous',
                height: 120,
                width: 120,
              }}
            >
              <Image
                resizeMode="cover"
                source={avatarSource}
                style={{ height: '100%', width: '100%' }}
                testID="profile.avatar"
              />
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <Text className="font-sf-rounded-semibold text-h3 text-black">
              {displayName}
            </Text>
            <IconButton
              accessibilityLabel="Edit profile"
              className="size-12 rounded-full"
              icon="edit"
              onPress={() => router.push('/profile-picture')}
              testID="profile.edit-btn"
              variant="filled"
            />
          </View>
        </View>

        {isPro ? (
          <View
            className="relative overflow-hidden rounded-16 p-6"
            style={{
              borderCurve: 'continuous',
              minHeight: 105,
            }}
            testID="profile.pro-status"
          >
            <View className="absolute inset-0 bg-clarity-blue" />
            <View className="absolute inset-0 bg-white/5" />

            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Icon color={COLORS.white} name="crown" size={24} />
                <Text className="font-sf-rounded-semibold text-body-xl text-white">
                  Speecha Pro
                </Text>
              </View>
              <Text className="font-sf-rounded text-body-lg text-white">
                You have access to all Pro features
              </Text>
            </View>
          </View>
        ) : (
          <Pressable
            accessibilityLabel="Open Speecha Pro"
            accessibilityRole="button"
            className="relative overflow-hidden rounded-16 p-6"
            onPress={() => router.push('/paywall')}
            style={({ pressed }) => ({
              borderCurve: 'continuous',
              minHeight: 105,
              opacity: pressed ? 0.85 : 1,
            })}
            testID="profile.get-pro"
          >
            <View className="absolute inset-0 bg-clarity-blue" />
            <View className="absolute inset-0 bg-white/5" />

            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Icon color={COLORS.white} name="crown" size={24} />
                <Text className="font-sf-rounded-semibold text-body-xl text-white">
                  Get Speecha Pro
                </Text>
              </View>
              <Text className="font-sf-rounded text-body-lg text-white">
                Unlock your full speaking potentials
              </Text>
            </View>
          </Pressable>
        )}

        <View className="w-full gap-3">
          <View className="flex-row gap-3">
            <ProfileStatCard
              className="flex-1"
              title="TOTAL WORDS"
              value={formatCompactWords(totalWords)}
            />
            <ProfileStatCard
              className="flex-1"
              title="AVG CLARITY"
              value={`${averageClarity}%`}
            />
          </View>

          <ProfileStatCard title="COMMON FILLER" value={commonFiller} />
        </View>

        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-sf-rounded-semibold text-body-lg text-black">
              Badges
            </Text>
            <Pressable
              accessibilityLabel="See all badges"
              accessibilityRole="button"
              onPress={() => router.push('/badges')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              testID="profile.badges-see-all"
            >
              <Text className="font-sf-rounded-semibold text-body-lg text-grey-400">
                see all
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-start justify-between gap-3">
            {previewBadges.map((badge) => (
              <ProfileBadge
                badgeKey={badge.badge_key}
                isUnlocked={badge.is_unlocked}
                key={badge.badge_key}
                label={badge.title}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
