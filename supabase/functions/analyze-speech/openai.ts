import OpenAI from "npm:openai@4";
import { Filler, Word } from "./types.ts";
import { FILLER_DETECTION_PROMPT } from "./prompts.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const detectFillers = async (
  transcript: string,
  words: Word[]
): Promise<Filler[]> => {
  try {
    const input = {
      text: transcript,
      words: words.map((w, index) => ({ index, text: w.word })),
    };

    const response = await openai.responses.create({
      model: "gpt-5.1",
      temperature: 0,
      instructions: FILLER_DETECTION_PROMPT,
      input: [
        {
          role: "user",
          content: `Analyze this transcript and return the fillers as JSON:\n\n${JSON.stringify(input)}`,
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
      max_output_tokens: 1100,
    });

    const outputText = response.output_text ?? "{}";
    const parsed = JSON.parse(outputText);
    return parsed.fillers || [];
  } catch (error) {
    console.error("Filler detection failed:", error);
    return [];
  }
};
