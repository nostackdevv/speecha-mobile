import type { Filler, NormalizedWord } from '@/types/api';

export type Chunk = {
  fillerId?: number;
  type: 'filler' | 'normal';
  words: NormalizedWord[];
};

export const splitTranscriptIntoChunks = (
  words: NormalizedWord[],
  fillers: Filler[]
): Chunk[] => {
  if (words.length === 0) return [];

  const wordToFiller = new Map<number, number>();

  fillers.forEach((filler, fillerId) => {
    const wordCount = filler.displayText.trim().split(/\s+/).length;
    const endIndex = filler.startIndex + wordCount - 1;
    for (let i = filler.startIndex; i <= endIndex; i++) {
      wordToFiller.set(i, fillerId);
    }
  });

  const chunks: Chunk[] = [];
  let currentChunk: Chunk | null = null;

  for (const word of words) {
    const fillerId = wordToFiller.get(word.index);
    const isFiller = fillerId !== undefined;
    const type = isFiller ? 'filler' : 'normal';

    const needsNewChunk =
      !currentChunk ||
      currentChunk.type !== type ||
      (isFiller && currentChunk.fillerId !== fillerId);

    if (needsNewChunk) {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = {
        type,
        ...(isFiller && { fillerId }),
        words: [],
      };
    }

    currentChunk!.words.push(word);
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};
