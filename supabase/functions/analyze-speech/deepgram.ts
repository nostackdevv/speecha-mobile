import { createClient } from "npm:@deepgram/sdk@3";
import { TranscriptionResult, Word } from "./types.ts";

const DEEPGRAM_API_KEY = Deno.env.get("DEEPGRAM_API_KEY")!;

const deepgram = createClient(DEEPGRAM_API_KEY);

export const transcribeAudio = async (
  buffer: Uint8Array
): Promise<TranscriptionResult> => {
  const { result } = await deepgram.listen.prerecorded.transcribeFile(buffer, {
    model: "nova-2",
    filler_words: true,
    punctuate: true,
  });

  if (!result?.results?.channels?.[0]?.alternatives?.[0]) {
    throw new Error("Invalid transcription result from Deepgram");
  }

  const { transcript, words: rawWords } =
    result.results.channels[0].alternatives[0];
  const { duration } = result.metadata;

  const words: Word[] = (rawWords || []).map(
    (w: { word: string; start: number; end: number }) => ({
      word: w.word,
      start: w.start,
      end: w.end,
    })
  );

  return {
    transcript: transcript || "",
    words,
    duration: duration || 0,
  };
};
