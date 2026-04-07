import { useRouter } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { SessionCard } from '@/components/ui/SessionCard';
import { useSpeechAnalysisList } from '@/hooks/useSpeechAnalyses';
import {
  formatDuration,
  formatSessionDate,
  getSessionTitle,
} from '@/lib/speechMetrics';

export const SessionHistory = () => {
  const router = useRouter();
  const { data: sessions, isLoading } = useSpeechAnalysisList();
  const latestSessions = (sessions ?? []).slice(0, 5);

  return (
    <View className="gap-4">
      <SectionHeader
        onTrailingPress={() => router.push('/all-sessions')}
        title="Session history"
        trailing="see all"
        trailingIsAction
      />
      {isLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator />
        </View>
      ) : latestSessions.length > 0 ? (
        <View className="gap-3">
          {latestSessions.map((session) => (
            <SessionCard
              date={formatSessionDate(session.created_at)}
              duration={formatDuration(session.duration_seconds)}
              key={session.id}
              onPress={() => router.push(`/results?id=${session.id}`)}
              testID={`progress.session-${session.id}`}
              title={getSessionTitle(session.prompt_id)}
            />
          ))}
        </View>
      ) : (
        <Text className="py-4 text-center font-sf-rounded-medium text-body-sm text-grey-500">
          No sessions yet
        </Text>
      )}
    </View>
  );
};
