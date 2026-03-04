import { Text } from 'react-native';

import { Card } from '@/components/ui/Card';
import { splitTranscriptIntoChunks } from '@/lib/chunking';

import type { Filler, NormalizedWord } from '@/types/api';

interface SpeechTranscriptProps {
  fillers: Filler[];
  words: NormalizedWord[];
}

export const SpeechTranscript = ({ fillers, words }: SpeechTranscriptProps) => {
  const chunks = splitTranscriptIntoChunks(words, fillers);

  return (
    <Card className="bg-grey-100" testID="results.transcript">
      <Text className="mb-3 font-sf-rounded-medium text-body-xl text-black">
        Speech transcript
      </Text>
      <Text className="text-body font-sf-rounded text-grey-700">
        {chunks.map((chunk, index) => {
          const text = chunk.words.map((w) => w.displayText).join(' ');
          if (chunk.type === 'filler') {
            return (
              <Text
                key={index}
                className="text-body font-sf-rounded-medium text-clarity-blue"
                style={{ backgroundColor: '#cdeffc', borderRadius: 4 }}
              >
                {' '}
                {text}{' '}
              </Text>
            );
          }
          return (
            <Text key={index}>
              {index > 0 ? ' ' : ''}
              {text}
            </Text>
          );
        })}
      </Text>
    </Card>
  );
};
