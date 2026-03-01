import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { HomeHeader } from '@/components/home/HomeHeader';
import { RecordingModeCard } from '@/components/home/RecordingModeCard';
import { StreakCard } from '@/components/home/StreakCard';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { SectionHeader } from '@/components/ui/SectionHeader';

// Mock data — replace with real data from hooks
const MOCK_NAME = 'Samuel';
const MOCK_DATE = 'Monday, Feb 16';
const MOCK_STREAK = 1;
const MOCK_COMPLETED_DAYS = [true, false, false, false, false, false, false];
const MOCK_LAST_SESSION = {
  clarityScore: 88,
  prompt: 'Interview Preparation',
  timeAgo: '2m ago',
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pb-10 pt-16"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-8">
        <HomeHeader
          date={MOCK_DATE}
          name={MOCK_NAME}
          onAvatarPress={() => {}}
        />

        <StreakCard completedDays={MOCK_COMPLETED_DAYS} streak={MOCK_STREAK} />

        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <SectionHeader title="Start a new session" />
            <IconButton
              accessibilityLabel="How speecha works"
              icon="question"
              onPress={() => router.push('/how-speecha-works')}
              size={36}
              variant="ghost"
            />
          </View>

          <View className="flex-row gap-3">
            <RecordingModeCard
              color="blue"
              icon="mic"
              onPress={() => {}}
              title={'Random\nPractice'}
            />
            <RecordingModeCard
              color="orange"
              icon="prompt"
              onPress={() => {}}
              title={'Pick a\nPrompt'}
            />
          </View>
        </View>

        <View className="gap-4">
          <SectionHeader
            title="Last session"
            trailing={MOCK_LAST_SESSION.timeAgo}
          />

          <Card>
            <View className="flex-row items-center justify-between">
              <Text className="font-sf-rounded-medium text-body-md text-black">
                {MOCK_LAST_SESSION.prompt}
              </Text>
              <View className="items-end">
                <Text className="font-sf-rounded-bold text-body-xl text-clarity-blue">
                  {MOCK_LAST_SESSION.clarityScore}%
                </Text>
                <Text className="font-sf-rounded-medium text-body-xs text-grey-400">
                  CLARITY
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
