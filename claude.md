# Speecha Mobile

Speech improvement app that helps users eliminate filler words through daily recording practice and AI-powered feedback. Users record themselves speaking, then receive analysis of detected filler words with a clarity score.

## Stack

- ios only
- Expo + React Native + TypeScript
- Expo Router (file-based navigation)
- NativeWind (Tailwind for RN)
- React Query (data fetching)
- Supabase (auth, database)
- Deepgram (transcription)
- OpenAI GPT-5.1 (filler detection)
- expo-audio (audio recording)

## Auth

- Apple and Google sign-in only

## User Tiers

- Free (signed in): 3 recordings/day, 60s max, 3 friends max, cloud sync
- Pro: Unlimited recordings, 120s max, unlimited friends, cloud sync

## Database Tables

- profiles: username, email, streak, push token, pricing plan
- speech_analyses: transcript_data jsonb, clarity_score, filler_count, duration
- friendships: sender_id, receiver_id, status

## Screens

3 tabs: Home, Progress, Friends (Profile pushed from Home avatar, not a tab)

## Commands

- `npm run start` - Start dev server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npx eas build` - Build for production

## Verification

After making changes, run verification to catch errors:

- `npm run verify` - Run all checks (typecheck, lint, format, test)
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - ESLint
- `npm run format:check` - Prettier formatting
- `npm run test` - Jest unit tests

Always run `npm run verify` after making changes.

## Environment

Required in `.env`:

- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY
- EXPO_PUBLIC_API_URL
- EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
- EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID

## Conventions

- File naming: camelCase for hooks (`useAuth.ts`), PascalCase for components and contexts (`Button.tsx`, `AuthContext.tsx`), lowercase for screens (`profile.tsx`). Use `.tsx` only when file contains JSX, otherwise `.ts`
- Exports: Named exports with arrow functions (`export const Button = () => {}`)
- Props: Sort alphabetically
- Styling: NativeWind only, no StyleSheet.create()
- Functions: Arrow functions in .tsx files

## Folder Structure

- `/app` - Screens and routes (Expo Router). Orchestrate components and hooks, no heavy logic.
- `/components/ui` - Generic reusable components (Button, Card, Avatar, SegmentedControl, etc.)
- `/components/home` - Home tab components (StreakDisplay, WeekProgressDots, RecordingModeCard, LastSessionCard)
- `/components/recording` - Recording UI (timer, controls, prompt display)
- `/components/results` - Results display (ClarityScoreCircle, FillerBreakdown, HighlightedTranscript, AudioPlayer)
- `/components/progress` - Progress tab components (StreakCards, WeekSummary, SessionHistoryItem, CalendarGrid)
- `/components/friends` - Friends tab components (FriendListItem, FriendRequestItem, SearchFriendInput)
- `/components/profile` - Profile components (ProfileHeader, BadgesPreview, ProUpgradeCard)
- `/components/onboarding` - Onboarding flow (slides, pagination, auth buttons)
- `/components/paywall` - Paywall UI (feature list, pricing toggle)
- `/contexts` - React Context providers (auth). Singleton app state, not server state.
- `/hooks` - Custom hooks with Supabase queries, use React Query
- `/lib` - Supabase client, utils
- `/constants` - Static values (colors, prompts, limits, badges, archetypes)
- `/types` - Shared TypeScript interfaces
- `/assets` - Images, fonts

## Non-obvious Patterns

- Path alias: `@/*` maps to project root (configured in tsconfig.json)
- Husky + lint-staged: pre-commit hook auto-runs ESLint on staged `.ts`/`.tsx` files
- API calls go to an external Next.js app on Vercel (`EXPO_PUBLIC_API_URL`), not local — Deepgram and OpenAI keys live there
- Supabase client uses AsyncStorage for session persistence (`lib/supabase.ts`)
- SF Pro Rounded uses iOS PostScript names (`.SFProRounded-Regular` etc.), no font bundling needed
- Icons use `@expo/vector-icons/Ionicons`, not expo-symbols
- `constants/colors.ts` exports `COLORS` const mirroring Tailwind tokens for programmatic use (icon tints, chart colors)

## Do / Don't

DO: Use TypeScript, React Query for data fetching, NativeWind for styling, arrow functions, sort props alphabetically, keep comments as minimal as possible only when necessary

DON'T: Use StyleSheet.create(), fetch data inside components, store sensitive keys in code
