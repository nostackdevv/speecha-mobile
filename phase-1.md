# Phase 1: Core Recording Flow (End-to-End)

## Context

Every screen uses mock data. Hooks and Supabase queries exist but are not wired to the UI. Phase 1 delivers the app's core value: **Record → Transcribe → Analyze → Save → Display Results**. AudioPlayer stays static for now. All subsequent phases build on this foundation.

---

## Step 0: Auth Foundation

**Why:** Every hook (`useCreateSpeechAnalysis`, `useProfile`, etc.) calls `useAuth()` which throws without `AuthProvider` in the tree. Auth is the prerequisite for all data persistence.

**Changes:**

### `app/_layout.tsx`

- Wrap Stack in `<AuthProvider>` (inside QueryClientProvider)
- Extract a `RootNavigator` component that uses `useAuth()` + `useSegments()` to redirect:
  - Not authenticated → `/sign-in`
  - Authenticated on sign-in page → `/`
  - Loading → return null (splash still showing)
- Add `<Stack.Screen name="sign-in" />` to the Stack

### `app/sign-in.tsx` (new — thin route wrapper)

- Returns `<SignIn />` from `@/components/screens/SignIn`

### `components/screens/SignIn/index.tsx` (new)

- Minimal dev auth screen: email + password inputs, Sign In / Sign Up buttons
- `supabase.auth.signInWithPassword({ email, password })`
- `supabase.auth.signUp({ email, password })` for first-time
- Error display (invalid credentials, etc.)
- No fancy UI needed — this is a dev-only screen replaced by proper onboarding later

---

## Step 1: Prompt Utilities

**Why:** User confirmed: pass `promptId` only, derive text from static data via lookup.

### `constants/prompts.ts` — add `getPromptById`

- Create a flat `Map<string, Prompt>` built once from all categories
- Export `getPromptById(id: string): Prompt | undefined`
- Used by Recording screen to display prompt text from an ID

---

## Step 2: Wire `useAnalyzeRecording`

**File:** `hooks/useAnalyzeRecording.ts`

### Changes:

1. Uncomment `useAuth()` and `useCreateSpeechAnalysis()` (lines 11-12, 32-33)
2. Change `mutationFn` signature from `(uri: string)` to `({ uri, promptId }: { uri: string; promptId?: string })`
3. Uncomment the Supabase save block (lines 61-73), add `prompt_id: promptId ?? null`
4. After Supabase save, persist audio locally:
   ```ts
   const analysisId = savedRecord.id;
   audioRecordingStorage.save(analysisId, uri);
   ```
5. Return `{ ...result, analysisId }` — add `analysisId` to the return type
6. Update `analyze()` and `analyzeAsync()` signatures to accept `{ uri, promptId }`

### Return type addition:

- Return `{ analysis: RecordingAnalysis; analysisId: string }` from `analyzeAsync()`
- Keeps `RecordingAnalysis` as a pure data type

---

## Step 3: Create `lib/transformAnalysis.ts` (new)

**Why:** Results screen needs `RecordingAnalysis` (UI type), but Supabase returns `SpeechAnalysis` (DB row with `transcript_data: Json | null`). Need a mapper.

**Key decision:** Store full `NormalizedWord[]` in `transcript_data.words` so the transform is lossless (preserves `startChar`, `endChar`, `confidence` for transcript highlighting).

---

## Step 4: Update Recording Screen

**File:** `components/screens/Recording/index.tsx`

### Changes:

1. Replace `useAnalyzeMockRecording` with `useAnalyzeRecording` (swap import)
2. Change URL params: `useLocalSearchParams<{ promptId?: string }>()` (was `prompt`)
3. Derive prompt text from `promptId` using `getPromptById`
4. Update `submitRecording` to pass `{ uri, promptId }` and navigate with `{ id: analysisId }`

### Also update:

- `components/screens/PromptList/index.tsx` — pass `promptId` instead of `prompt` text
- Home screen navigation if applicable

---

## Step 5: Update Results Screen

**File:** `components/screens/Results/index.tsx`

### Changes:

1. Read `id` from params
2. Fetch from Supabase via `useSpeechAnalysisDetail(id)`
3. Transform DB row to UI type via `transformAnalysis()`
4. Add loading + error states
5. Remove `MOCK_ANALYSIS_RESULT`
6. AudioPlayer stays static

---

## Step 6: Wire `useTier`

**File:** `hooks/useTier.ts`

- Uncomment `useProfile()`, derive tier from `profile.pricing_plan`, fallback to `'free'`

---

## Files Summary

### Modified (7 files)

| File                                      | Change                                              |
| ----------------------------------------- | --------------------------------------------------- |
| `app/_layout.tsx`                         | Add AuthProvider, auth gate, sign-in route          |
| `hooks/useAnalyzeRecording.ts`            | Uncomment saves, add audio persist, accept promptId |
| `hooks/useTier.ts`                        | Uncomment useProfile                                |
| `components/screens/Recording/index.tsx`  | Swap mock hook, update params                       |
| `components/screens/Results/index.tsx`    | Fetch by ID, remove mock                            |
| `components/screens/PromptList/index.tsx` | Pass promptId                                       |
| `constants/prompts.ts`                    | Add getPromptById utility                           |

### New (3 files)

| File                                  | Purpose                    |
| ------------------------------------- | -------------------------- |
| `app/sign-in.tsx`                     | Auth route (thin wrapper)  |
| `components/screens/SignIn/index.tsx` | Minimal dev sign-in screen |
| `lib/transformAnalysis.ts`            | DB row → UI type mapper    |

---

## Edge Cases

| Scenario                            | Handling                                           |
| ----------------------------------- | -------------------------------------------------- |
| Empty transcript (silence/noise)    | Save with zero score, Results shows empty state    |
| API timeout during transcription    | ErrorView shown, user retries without re-recording |
| Audio file move fails               | Catch error, still navigate to Results             |
| User navigates back during analysis | Mutation continues in background                   |
| Results with invalid/missing ID     | Show error state with "Go home" button             |
| Profile not loaded in useTier       | Default to 'free'                                  |
| Sign-in with wrong credentials      | Show error message                                 |

---

## Data Flow

```
User taps Record
  → useRecording.start() (expo-audio)
  → User speaks...
  → useRecording.stop() → returns temp audio URI

User taps Submit
  → useAnalyzeRecording.analyzeAsync({ uri, promptId })
    1. transcribeAudio(uri) → Deepgram via Vercel backend
    2. analyzeTranscript(transcript) → OpenAI via Vercel backend
    3. createAnalysis.mutateAsync(result) → INSERT into Supabase → returns { id }
    4. audioRecordingStorage.save(id, tempUri) → move to persistent local storage
    5. Return { analysis, analysisId }
  → router.replace('/results', { id: analysisId })

Results screen
  → useSpeechAnalysisDetail(id) → SELECT from Supabase
  → transformAnalysis(dbRow) → RecordingAnalysis for UI
  → AudioPlayer stays static (Phase 1)
```

---

## Verification

1. Start app → redirected to sign-in (no session)
2. Sign up with test email → redirected to Home
3. Tap "Random Practice" → Recording screen shows "Say something random"
4. Record for 5+ seconds → Submit → AnalyzingView shows progress
5. Results screen shows real clarity score, fillers, transcript
6. Check Supabase: `speech_analyses` has new row with correct data
7. Check device storage: audio file exists at `documents/speecha/recordings/{id}.m4a`
8. Pick a specific prompt → Record → Verify `prompt_id` saved in Supabase
9. Kill and reopen app → still signed in (session persisted)
10. Run `npm run verify` — all checks pass

---

## Implementation Order

1. **Step 0** — Auth (prerequisite for everything)
2. **Step 1** — Prompt utility (small, no dependencies)
3. **Step 2** — Wire useAnalyzeRecording (core mutation)
4. **Step 3** — transformAnalysis (needed by Results)
5. **Step 4** — Recording screen (uses Steps 1-2)
6. **Step 5** — Results screen (uses Steps 3-4)
7. **Step 6** — useTier (small, independent)
