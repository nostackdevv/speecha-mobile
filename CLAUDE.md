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
- react-native-reanimated (animations)
- expo-haptics (tactile feedback)

## Database Tables

- profiles: username, email, streak, push token, pricing plan
- speech_analyses: transcript_data jsonb, clarity_score, filler_count, duration
- friendships: sender_id, receiver_id, status

## Screens

3 tabs: Home, Progress, Friends
Other: Recording, Results, Profile, Onboarding, Paywall, How It Works (formSheet)

## Verification

After making changes, run verification to catch errors:

- `npm run verify` - Run all checks (typecheck, lint, format, test)
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - ESLint
- `npm run format:check` - Prettier formatting
- `npm run test` - Jest unit tests

Always run `npm run verify` after making changes.

## Conventions

- File naming: camelCase for hooks (`useAuth.ts`), PascalCase for components and contexts (`Button.tsx`, `AuthContext.tsx`), lowercase for screens (`profile.tsx`). Use `.tsx` only when file contains JSX, otherwise `.ts`
- Exports: Named exports with arrow functions (`export const Button = () => {}`)
- Styling: NativeWind only, no StyleSheet.create(). Use standard Tailwind classes that maps to the design (px-3, gap-2, h-14) — only use arbitrary values like px-[29px] when no standard utility exists.
- Styling helpers: Use `cn()` from `lib/cn.ts` (clsx + tailwind-merge) for conditional/merged classNames — never raw template strings
- Functions: Arrow functions everywhere (components, hooks, utils, callbacks)
- iOS cards: Use `style={{ borderCurve: 'continuous' }}` on rounded containers for smooth iOS corners

## Folder Structure

- `/app` - Screens and routes (Expo Router). Orchestrate components and hooks, no heavy logic.
- `/components/ui` - Generic reusable components. Always check here before creating new UI primitives.
- `/components/home` - Home tab components (HomeHeader, StreakCard, RecordingModeCard, WeekProgressDots)
- `/components/recording` - Recording UI (timer, controls, prompt display)
- `/components/results` - Results display (ClarityScoreCircle, FillerBreakdown, HighlightedTranscript, AudioPlayer)
- `/components/progress` - Progress tab components (StreakCards, WeekSummary, SessionHistoryItem, CalendarGrid)
- `/components/friends` - Friends tab components (FriendListItem, FriendRequestItem, SearchFriendInput)
- `/components/profile` - Profile components (ProfileHeader, BadgesPreview, ProUpgradeCard)
- `/components/onboarding` - Onboarding flow (slides, pagination, auth buttons)
- `/components/paywall` - Paywall UI (feature list, pricing toggle)
- `/contexts` - React Context providers (auth). Singleton app state, not server state.
- `/hooks` - Custom hooks with Supabase queries, use React Query
- `/lib` - Supabase client (`supabase.ts`), API layer (`api.ts`), audio storage (`audioRecordingStorage.ts`), className utility (`cn.ts`)
- `/constants` - Static values (colors, prompts, limits, badges, archetypes)
- `/types` - Shared TypeScript interfaces
- `/assets` - Images, fonts, icons (SVG)

## Non-obvious Patterns

- Path alias: `@/*` maps to project root (configured in tsconfig.json)
- Environment: Copy `.env.example` → `.env` and fill in values. Required: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_API_URL`
- Husky + lint-staged: pre-commit hook auto-runs ESLint on staged `.ts`/`.tsx` files
- API calls go to an external Next.js app on Vercel (`EXPO_PUBLIC_API_URL`), not local — Deepgram and OpenAI keys live there
- Supabase client uses AsyncStorage for session persistence (`lib/supabase.ts`)
- SF Pro Rounded is bundled in `assets/fonts/` and loaded via `useFonts` in `app/_layout.tsx`. Font family names (e.g. `SFProRounded-Medium`) must match the keys registered in `useFonts`. Splash screen stays visible until fonts load.
- Icons use SVGs from Iconify via react-native-svg. SVG files in `/assets/icons/`, registry in `constants/icons.ts`. Use `<Icon name="..." />` from `components/ui/Icon.tsx`
- `constants/icons.ts` exports `ICONS` registry and `IconName` type — add new icons by downloading SVG from Iconify API, placing in `/assets/icons/`, and registering in the `ICONS` map
- `constants/colors.ts` exports `COLORS` const mirroring Tailwind tokens for programmatic use (icon tints, chart colors)
- `how-speecha-works` route uses `presentation: 'formSheet'` for native iOS sheet behavior

## Do / Don't

DO:

- Use TypeScript,
- IMPORTANT: use `/building-native-ui` skills for code development with claude
- Use `/claude-md-management:revise-claude-md` skill to suggest improvement in every plan mode and updates
- React Query for data fetching,
- keep comments as minimal as possible only when necessary

DON'T:

- fetch data inside components,
- store sensitive keys in code
- use falsy `&&` for conditional rendering (`{count && <View/>}` crashes when count is 0) — always use ternary (`count ? <View/> : null`) or boolean coercion (`{!!count && <View/>}`)

## AI Execution Expectations

- Always read files before editing them (never propose changes to code you haven't read)
- Prefer minimal, localized changes over large refactors
- Preserve existing component patterns and abstractions
- Never add features, refactor, or make "improvements" beyond what was requested
- Only make changes that are directly requested or clearly necessary
