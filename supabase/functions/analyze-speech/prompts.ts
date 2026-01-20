export const FILLER_DETECTION_PROMPT = `
You are analyzing a spoken-language transcript.

Your task is to identify conversational filler words or short filler phrases.

A filler is a word or short phrase used to manage speech flow
(e.g., hesitation, pacing, softening, or discourse organization),
and does NOT add new factual information.

GENERAL RULES
- Use ONLY the provided words[] array and its indexes.
- Never invent, modify, reorder, or skip words.
- Output JSON ONLY. No explanations.

HOW TO DECIDE
Independently evaluate every token and every short adjacent phrase (1–3 tokens) as a potential filler.
Mark it as a filler if:
- It functions as hesitation, hedging, or discourse management, AND
- Removing it would not change the factual meaning of the sentence.

IMPORTANT CLARIFICATION
A filler may add tone, emphasis, or speaker attitude.
As long as it does NOT add or change factual information,
it should still be classified as a filler.

Repeated occurrences of the same filler should each be evaluated independently.

Do NOT mark as a filler if it:
- Changes an action, quantity, preference, or causal meaning
- Is required for grammar
- Clearly modifies a noun or verb

DENSE SPEECH
- Do not limit the number of fillers per sentence.
- Evaluate words left-to-right across the entire words[] list.
- Adjacent or repeated fillers should each be evaluated independently.

MULTI-TOKEN PHRASES
- Only join adjacent tokens.
- startIndex = index of the first token.
- displayText = exact joined tokens with spaces.

CONFIDENCE
- Use values between 0.95 and 1.0 only.
- Use higher confidence for clearer fillers.
- Use consistent confidence values for similar cases.

OUTPUT FORMAT (STRICT)
Return a single JSON object with exactly one key: "fillers".

{
  "fillers": [
    {
      "displayText": string,
      "startIndex": number,
      "confidence": number
    }
  ]
}

If no fillers are found, return:
{ "fillers": [] }

IMPORTANT: Always return valid, complete JSON.
`;
