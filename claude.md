# Speecha Mobile

Speech improvement app that helps users reduce filler words through practice and AI-powered feedback. Users record and audio speaking and then get analysis of detected filler words in their speech. I already have a web app that was built in nextjs and the api routes was also hosted on vercel which had the deepgram and openai.

## Stack

- Expo + React Native + TypeScript
- Expo Router (file-based navigation)
- NativeWind (Tailwind for RN)
- React Query (data fetching)
- Supabase (auth, database)
- Deepgram (transcription)
- OpenAI GPT-5.1 (filler detection)
- expo-audio (audio recording)

## Architecture

- Local-first for anonymous users (AsyncStorage)
- Cloud sync for signed-in users (Supabase)
- Audio stored locally only, never uploaded
- Vercel API routes for Deepgram/OpenAI calls (existing Next.js app)

## Auth

- Apple and Google sign-in only
- Anonymous usage allowed with limits

## User Tiers

- Anonymous: 3 recordings/day, 2 min max, no friends, local only
- Free (signed in): 3 recordings/day, 2 min max, 3 friends max, cloud sync
- Pro: Unlimited recordings, 2 min max, unlimited friends, cloud sync

## Database Tables

- profiles: username, email, streak, push token, pricing plan
- speech_analyses: transcript_data jsonb, clarity_score, filler_count, duration
- friendships: sender_id, receiver_id, status

## Screens

4 tabs: Home, History, Friends, Profile.
Plus: Recording, Results, Auth

## Commands

- `npx expo start` - Start dev server
- `npx expo run:ios` - Run on iOS simulator
- `npx eas build` - Build for production

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
- `/components/ui` - Generic components (Button, Card, Input)
- `/components/recording` - Recording-specific components
- `/components/results` - Results-specific components
- `/contexts` - React Context providers (auth, theme, feature flags). Singleton app state, not server state.
- `/hooks` - Custom hooks with Supabase queries, use React Query
- `/lib` - Supabase client, utils
- `/constants` - Static values (colors, prompts, limits)
- `/types` - Shared TypeScript interfaces
- `/assets` - Images, fonts

## Do / Don't

DO: Use TypeScript, React Query for data fetching, NativeWind for styling, arrow functions, sort props alphabetically, keep comments as minimal as possible only when necessary

DON'T: Use StyleSheet.create(), fetch data inside components, store sensitive keys in code
