import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { transcribeAudio } from "./deepgram.ts";
import { detectFillers } from "./openai.ts";
import { AnalysisResponse, RequestBody } from "./types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const decodeBase64ToBuffer = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const buffer = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    buffer[i] = binaryString.charCodeAt(i);
  }
  return buffer;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body: RequestBody = await req.json();

    if (!body.audio) {
      return jsonResponse({ error: "Missing audio data" }, 400);
    }

    const buffer = decodeBase64ToBuffer(body.audio);

    // Step 1: Transcribe with Deepgram
    const { transcript, words, duration } = await transcribeAudio(buffer);

    if (!transcript || transcript.trim().length === 0) {
      return jsonResponse({ error: "no_speech_detected" }, 400);
    }

    // Step 2: Detect fillers with OpenAI (graceful degradation)
    const fillers = await detectFillers(transcript, words);

    const response: AnalysisResponse = {
      transcript,
      words,
      duration,
      fillers,
    };

    return jsonResponse(response);
  } catch (error) {
    console.error("Error processing request:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Internal server error" },
      500
    );
  }
});
