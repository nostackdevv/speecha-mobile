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
- Use expo-sqlite for persistent storage

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

- File naming: camelCase for hooks (`useAuth.ts`), PascalCase for components and contexts (`Button.tsx`, `AuthContext.tsx`), lowercase for route files (`profile.tsx`). Use `.tsx` only when file contains JSX, otherwise `.ts`
- Screen directories: PascalCase matching screen name (e.g., `Home/`, `PromptCategories/`). Main file is always `index.tsx`.
- Route files: Thin wrappers only — import screen component and return it. All logic lives in `/components/screens/[ScreenName]/`.
- Exports: Named exports with arrow functions (`export const Button = () => {}`)
- Styling: NativeWind only, no StyleSheet.create(). Use standard Tailwind classes that maps to the design (px-3, gap-2, h-14) — only use arbitrary values like px-[29px] when no standard utility exists.
- Styling helpers: Use `cn()` from `lib/cn.ts` (clsx + tailwind-merge) for conditional/merged classNames — never raw template strings
- Functions: Arrow functions everywhere (components, hooks, utils, callbacks)
- Event handlers: One-liner callbacks can be inline (`onPress={() => setVisible(true)}`), but multi-line callbacks should be extracted to named functions (`handleSubmit`, `handleRemove`)
- iOS cards: Use `style={{ borderCurve: 'continuous' }}` on rounded containers for smooth iOS corners
- testID naming: `{screen}.{element}` format (e.g., `home.record-random`, `recording.submit-btn`, `friends.screen`). All interactive UI primitives (Button, IconButton, Avatar, SegmentedControl, BottomSheet) accept an optional `testID` prop. Always add `testID` to new interactive elements and screen root views for Expo MCP automation.

## Folder Structure

- `/app` - Route files only (Expo Router). Thin wrappers (5-10 lines) that import and return a single screen component. No logic, no JSX beyond the component.
- `/components/screens/[ScreenName]` - Screen implementations. Each screen has its own PascalCase directory (e.g., `Home/`, `Friends/`, `PromptCategories/`) containing the main component (`index.tsx`) and related sub-components.
- `/components/ui` - Generic reusable components. Always check here before creating new UI primitives.
- `/components/recording` - Recording UI (timer, controls, prompt display)
- `/components/results` - Results display (ClarityScoreCircle, FillerBreakdown, HighlightedTranscript, AudioPlayer)
- `/components/onboarding` - Onboarding flow (slides, pagination, auth buttons)
- `/components/paywall` - Paywall UI (feature list, pricing toggle)
- `/contexts` - React Context providers (auth). Singleton app state, not server state.
- `/hooks` - Custom hooks with Supabase queries, use React Query
- `/lib` - Supabase client (`supabase.ts`), API layer (`api.ts`), audio storage (`audioRecordingStorage.ts`), className utility (`cn.ts`)
- `/constants` - Static values (colors, prompts, limits, badges, archetypes)
- `/types` - Shared TypeScript interfaces
- `/assets` - Images, fonts, icons (SVG)

## Non-obvious Patterns

- Thin routes pattern: Route files (e.g., `app/(tabs)/index.tsx`) should be 5-10 lines max. Just import and return a screen component from `/components/screens/`. Example: `export default function HomeScreen() { return <Home />; }`
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
- React Query for data fetching,
- keep comments as minimal as possible only when necessary

DON'T:

- fetch data inside components,
- store sensitive keys in code
- introduce any code with eslint disable
- remove TODO comments unless the action described was actually completed
- delete mock files (e.g., `mockFriends.ts`, `mockData.ts`) without explicit user approval

## AI Execution Expectations

- Always read files before editing them (never propose changes to code you haven't read)
- Prefer minimal, localized changes over large refactors
- Preserve existing component patterns and abstractions
- Never add features, refactor, or make "improvements" beyond what was requested
- Only make changes that are directly requested or clearly necessary
