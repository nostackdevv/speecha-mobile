import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  DEFAULT_PROFILE_AVATAR_KEY,
  PROFILE_AVATAR_MAP,
} from '@/constants/profileVisuals';
import { useProfile } from '@/hooks/useProfile';
import { useSelectedProfileAvatar } from '@/hooks/useSelectedProfileAvatar';
import { useSpeechAnalysisList } from '@/hooks/useSpeechAnalyses';
import {
  formatHomeDate,
  formatTimeAgo,
  getCompletedDaysThisWeek,
  getSessionTitle,
} from '@/lib/speechMetrics';

import { HomeHeader } from './HomeHeader';
import { RecordingModeCard } from './RecordingModeCard';
import { StreakCard } from './StreakCard';

export const Home = () => {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: selectedAvatarKey } = useSelectedProfileAvatar();
  const { data: sessions, isLoading: isSessionsLoading } =
    useSpeechAnalysisList();

  const lastSession = sessions?.[0] ?? null;
  const completedDays = useMemo(
    () => getCompletedDaysThisWeek(sessions ?? []),
    [sessions]
  );
  const name =
    profile?.full_name?.trim().split(' ')[0] ?? profile?.username ?? 'there';
  const dateLabel = formatHomeDate();
  const streak = profile?.current_streak ?? 0;
  const lastSessionTitle = getSessionTitle(lastSession?.prompt_id ?? null);
  const lastSessionTimeAgo = lastSession
    ? formatTimeAgo(lastSession.created_at)
    : undefined;

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pb-10 pt-16"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      testID="home.screen"
    >
      <View className="gap-8">
        <HomeHeader
          avatarSource={
            profile?.avatar_url
              ? { uri: profile.avatar_url }
              : PROFILE_AVATAR_MAP[
                  selectedAvatarKey ?? DEFAULT_PROFILE_AVATAR_KEY
                ]
          }
          date={dateLabel}
          name={name}
          onAvatarPress={() => router.push('/profile')}
        />

        <StreakCard completedDays={completedDays} streak={streak} />

        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <SectionHeader title="Start a new session" />
            <IconButton
              accessibilityLabel="How speecha works"
              icon="question"
              className="h-9 w-9 rounded-full"
              iconSize={18}
              onPress={() => router.push('/how-speecha-works')}
              testID="home.how-it-works"
              variant="ghost"
            />
          </View>

          <View className="flex-row gap-3">
            <RecordingModeCard
              color="blue"
              icon="mic"
              onPress={() => router.push('/recording')}
              testID="home.record-random"
              title={'Random\nPractice'}
            />
            <RecordingModeCard
              color="orange"
              icon="prompt"
              onPress={() => router.push('/prompt-categories')}
              testID="home.record-prompt"
              title={'Pick a\nPrompt'}
            />
          </View>
        </View>

        <View className="gap-4">
          <SectionHeader title="Last session" trailing={lastSessionTimeAgo} />

          <Card testID="home.last-session">
            {isSessionsLoading ? (
              <View className="items-center py-3">
                <ActivityIndicator />
              </View>
            ) : lastSession ? (
              <View className="flex-row items-center justify-between">
                <Text className="font-sf-rounded-medium text-body-md text-black">
                  {lastSessionTitle}
                </Text>
                <View className="items-end">
                  <Text className="font-sf-rounded-bold text-body-xl text-clarity-blue">
                    {lastSession.clarity_score}%
                  </Text>
                  <Text className="font-sf-rounded-medium text-body-xs text-grey-400">
                    CLARITY
                  </Text>
                </View>
              </View>
            ) : (
              <Text className="font-sf-rounded-medium text-body-md text-grey-500">
                No sessions yet. Start your first practice.
              </Text>
            )}
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};
