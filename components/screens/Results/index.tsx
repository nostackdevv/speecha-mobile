import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { MOCK_ANALYSIS_RESULT } from '@/constants/mockData';

import { ArchetypeBadge } from './ArchetypeBadge';
import { AudioPlayer } from './AudioPlayer';
import { ClarityScoreRing } from './ClarityScoreRing';
import { FillerBreakdown } from './FillerBreakdown';
import { ProTipCard } from './ProTipCard';
import { SpeechTranscript } from './SpeechTranscript';
import { StatsRow } from './StatsRow';

export const Results = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const data = MOCK_ANALYSIS_RESULT;

  const handleDone = () => {
    router.replace('/');
  };

  const handleTryAgain = () => {
    router.replace('/');
  };

  const score = data.clarityScore?.score ?? 0;
  const hasFillers = data.fillerStats.totalFillers > 0;
  const topFiller = data.fillerStats.topFillers[0]?.text;

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
      testID="results.screen"
    >
      <View className="flex-row items-center justify-between px-6 py-3">
        <View className="w-12" />
        <Text className="font-sf-rounded-semibold text-body-xl text-black">
          Session Result
        </Text>
        <IconButton
          accessibilityLabel="Done"
          className="size-12 rounded-32"
          icon="checkmark"
          onPress={handleDone}
          testID="results.done"
          variant="dark"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-10 px-6 pb-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pt-8">
          <ClarityScoreRing score={score} />
        </View>

        <ArchetypeBadge score={score} />

        <View className="gap-6">
          <StatsRow
            fillerCount={data.fillerStats.totalFillers}
            fillersPerMinute={data.fillerStats.fillersPerMinute}
            totalWords={data.fillerStats.totalWords}
          />

          {hasFillers && (
            <FillerBreakdown topFillers={data.fillerStats.topFillers} />
          )}

          {data.words.length > 0 && (
            <SpeechTranscript fillers={data.fillers} words={data.words} />
          )}

          {hasFillers && <ProTipCard topFiller={topFiller} />}
        </View>

        <View className="flex-row gap-3">
          <Button
            className="flex-1"
            icon="rotateBack"
            onPress={handleTryAgain}
            testID="results.try-again"
            title="Try again"
            variant="secondary"
          />
          <Button
            className="flex-1"
            icon="share"
            onPress={() => {}}
            testID="results.share"
            title="Share"
          />
        </View>
      </ScrollView>

      <View style={{ paddingBottom: insets.bottom }}>
        <AudioPlayer />
      </View>
    </View>
  );
};
