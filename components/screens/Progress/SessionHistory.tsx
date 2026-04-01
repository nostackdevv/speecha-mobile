import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { SessionCard } from '@/components/ui/SessionCard';
import {
  formatDuration,
  formatSessionDate,
  MOCK_SESSIONS,
} from '@/constants/mockSessions';

export const SessionHistory = () => {
  const router = useRouter();
  const latestSessions = MOCK_SESSIONS.slice(0, 5);

  return (
    <View className="gap-4">
      <SectionHeader
        onTrailingPress={() => router.push('/all-sessions')}
        title="Session history"
        trailing="see all"
        trailingIsAction
      />
      <View className="gap-3">
        {latestSessions.map((session) => (
          <SessionCard
            date={formatSessionDate(session.date)}
            duration={formatDuration(session.durationSeconds)}
            key={session.id}
            onPress={() => router.push(`/results?id=${session.id}&mock=true`)}
            testID={`progress.session-${session.id}`}
            title={session.title}
          />
        ))}
      </View>
    </View>
  );
};
