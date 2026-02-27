# Speecha Mobile - Product Requirements Document

Speecha is an iOS app that helps users eliminate filler words through daily recording practice. Users record themselves speaking, get AI-powered analysis of filler words, and track improvement over time.

Reference the Figma design for all UI: `https://www.figma.com/design/HhdvmYhAeC40bTBDsPZkMP/SPEECHA?node-id=56-345`

## Key Implementation Rules

- **No auth gating**: All screens accessible without logging in. Auth wired up after full UI is built.
- **Dummy data**: Where backend hooks aren't ready or data isn't available, use hardcoded mock data.
- **NativeWind only**: No StyleSheet.create(). All styling via Tailwind classes.
- **Composition patterns**: Explicit variants over boolean props, children-based composition, compound components.
- **RN best practices**: FlashList for lists, memoize list items, stable callbacks, expo-image for images, Pressable over TouchableOpacity.
- **Conventions**: Named exports, arrow functions in .tsx, alphabetically sorted props, camelCase hooks, PascalCase components.
- **Font**: SF Pro Rounded (system font on iOS, no custom font install needed).

## Design Tokens

All colors extracted from Figma (already configured in `tailwind.config.js` and `constants/Colors.ts`):

| Token | Value |
|-------|-------|
| `brand-blue` | `#00a7ef` (primary actions, active states) |
| `brand-blue-500` | `#0096d7` (pressed states) |
| `brand-blue-300` | `#33baf2` (light accents) |
| `brand-blue-50` | `#cdeffc` (backgrounds) |
| `brand-blue-0` | `#e6f7fd` (subtle backgrounds) |
| `brand-orange` | `#ff5e07` (secondary actions, prompt cards) |
| `brand-orange-300` | `#ff864d` (light orange) |
| `grey-50` to `grey-800` | Full grey scale for text, borders, surfaces |
| `success` | `#12b76a` (positive states) |
| `error` | `#f04438` (error states) |

Typography: heading-2 (40px) through body-xs (12px) configured in Tailwind.

## Existing Code (reuse, don't rebuild)

| File | What It Does |
|------|-------------|
| `hooks/useRecording.ts` | Complete audio recording lifecycle (permissions, start/pause/resume/stop, auto-stop at max duration) |
| `hooks/useAnalyzeRecording.ts` | Orchestrates transcription → analysis → save pipeline via API |
| `hooks/useTier.ts` | Determines user tier (anonymous/free/pro) and returns limits |
| `hooks/useProfile.ts` | React Query CRUD for user profile from Supabase |
| `hooks/useSpeechAnalyses.ts` | Full CRUD for speech analysis records |
| `hooks/useFriends.ts` | Full friends management (list, requests, search, stats, send/respond/remove) |
| `hooks/useAuth.ts` | Re-exports from AuthContext (Google sign-in, sign-out) |
| `contexts/AuthContext.tsx` | Google Sign-In with Supabase integration |
| `lib/supabase.ts` | Supabase client with AsyncStorage persistence |
| `lib/api.ts` | HTTP client for /api/transcribe and /api/analyze |
| `lib/audioRecordingStorage.ts` | Local file storage for recordings |
| `constants/limits.ts` | Tier limits (anonymous: 3/day 60s, free: 3/day 60s, pro: unlimited 120s) |
| `constants/prompts.ts` | Prompt categories and prompts data |
| `constants/badges.ts` | Badge definitions with unlock criteria |
| `constants/onboarding.ts` | Onboarding slides and goal options |
| `constants/paywall.ts` | Pro benefits and plan pricing |
| `types/` | Full type definitions for API, database, prompts, badges, onboarding |

---

## Phase 1: Component Library

**Goal:** Build all reusable UI primitives in `components/ui/`. Every subsequent phase assembles screens from these components.

**Figma reference nodes for component design:**
- Home: `175:874` - Card, StatCard, Button, Avatar, WeekProgress
- Results: `415:2249` - ProgressCircle, ProgressBar, StatCard
- Friends: `283:2399` - TabToggle, Avatar, SearchInput
- Profile: `399:1220` - Avatar, Card, StatCard

### Components to build in `components/ui/`:

**Button.tsx**
- Props: `children, disabled, loading, onPress, size ("sm" | "md" | "lg"), variant ("primary" | "secondary" | "destructive" | "ghost")`
- Primary = brand-blue background, white text
- Secondary = outlined with brand-blue border
- Ghost = transparent background
- Uses Pressable, shows ActivityIndicator when loading

**Card.tsx**
- Props: `children, className`
- Rounded corners (rounded-2xl), bg-white, subtle shadow
- NativeWind className passthrough for composition

**Avatar.tsx**
- Props: `fallback, size ("sm" | "md" | "lg" | "xl"), source`
- Uses expo-image, circular with fallback initials
- sm=32, md=48, lg=64, xl=96

**StatCard.tsx**
- Props: `label, value`
- Large value text on top, small label below
- Used across Home, Progress, Results, Profile

**ProgressCircle.tsx**
- Props: `color, label, size, strokeWidth, value (0-100)`
- SVG circular arc via react-native-svg
- Shows percentage text in center

**ProgressBar.tsx**
- Props: `color, maxValue, value`
- Horizontal fill bar for filler word frequency

**IconButton.tsx**
- Props: `icon, onPress, size, variant`
- Circular Pressable with centered icon

**TabToggle.tsx**
- Props: `onValueChange, options (tuple of 2 labels), value`
- Two-option pill toggle (like Friends/Requests)

**SearchInput.tsx**
- Props: `onChangeText, placeholder, value`
- TextInput with search icon and clear button

**EmptyState.tsx**
- Props: `icon, onAction, subtitle, title`
- Centered layout with optional action button

**Modal.tsx**
- Props: `children, onClose, visible`
- Overlay wrapper using RN Modal

**Divider.tsx**
- Simple horizontal line with grey-200 color

**WeekProgress.tsx**
- Props: `completedDays (boolean[7])`
- Mon-Sun row with day labels and checkmark circles

---

## Phase 2: Navigation Restructure + Onboarding

**Goal:** Set up correct 3-tab navigation, add all stack screen routes, build onboarding flow. No auth gating.

### Navigation changes:

**`app/(tabs)/_layout.tsx`** - Change to 3 tabs:
1. Home (house icon) - `index.tsx`
2. Progress (chart/trending icon) - `progress.tsx` (rename from history.tsx)
3. Friends (people icon) - `friends.tsx`

Delete `app/(tabs)/profile.tsx` (profile becomes a stack screen).

**`app/_layout.tsx`** - Add Stack screens:
- `(tabs)` - main tabs
- `recording` - full screen modal
- `results` - push screen
- `profile` - push screen
- `settings` - push screen
- `paywall` - modal
- `onboarding` - full screen
- `goals` - push screen
- `auth` - modal
- `badges` - push screen
- `prompt-select` - push screen
- `add-friend` - modal
- `friend-detail` - push screen

Remove template code: delete `modal.tsx`, `EditScreenInfo.tsx`, `ExternalLink.tsx`, `StyledText.tsx`, `Themed.tsx`, `+html.tsx`.

### Onboarding:

**`hooks/useOnboarding.ts`**
- Reads AsyncStorage key `hasCompletedOnboarding`
- Returns `{ completeOnboarding, hasCompleted, isLoading }`

**`app/onboarding.tsx`** (Figma: `49:21`)
- Horizontal FlatList of 3 slides from `constants/onboarding.ts`
- Pagination dots
- "Next" button advances, last slide shows "Get Started"
- "Already have an account? Log in" link
- On complete: set AsyncStorage flag, navigate to goals or home

**`app/goals.tsx`** (Figma: `56:215`)
- "What are you improving your speech for?"
- 4 goal cards from `constants/onboarding.ts` GOAL_OPTIONS
- Multi-select with checkmark
- "Continue" saves to AsyncStorage, navigates to Home

**`app/auth.tsx`** (Figma: `56:332`)
- Google sign-in button (using existing `useAuth`)
- "Continue without account" option
- NOT a gate - just available from Profile/Settings

### Conditional routing in root layout:
- Check `useOnboarding().hasCompleted` on mount
- If false: redirect to `/onboarding`
- If true: show tabs

---

## Phase 3: Home Screen

**Goal:** Full home screen matching Figma design. **Figma reference:** `175:874` (HOME)

### New hooks (use dummy data):

**`hooks/useStreak.ts`**
```typescript
// Returns hardcoded data for now
export const useStreak = () => ({
  currentStreak: 5,
  longestStreak: 15,
  weekProgress: [true, true, true, true, true, false, false],
});
```

**`hooks/useLastSession.ts`**
```typescript
// Returns mock session or null
export const useLastSession = () => ({
  clarityScore: 88,
  createdAt: "2m ago",
  id: "mock-1",
  title: "Interview Preparation",
});
```

**`hooks/useDailyRecordingCount.ts`**
```typescript
export const useDailyRecordingCount = () => ({
  canRecord: true,
  count: 1,
  limit: 3,
  remaining: 2,
});
```

### Components in `components/home/`:

**HomeHeader.tsx** - Greeting ("Welcome back, [name]") + date + Avatar (taps to `/profile`)
**StreakBanner.tsx** - Fire icon + streak number + "day streak" label + WeekProgress
**SessionCards.tsx** - Two cards side-by-side: "Speak Freely" (blue bg, mic icon) and "Pick a Prompt" (orange bg, prompt icon). Navigate to `/recording` or `/prompt-select`.
**LastSessionPreview.tsx** - "Last session" header + session title + clarity % + timestamp. Taps to `/results`.

### Screen `app/(tabs)/index.tsx`:
- ScrollView layout, headerShown: false
- Compose: HomeHeader → StreakBanner → "Start a new session" title → SessionCards → LastSessionPreview

---

## Phase 4: Recording Flow

**Goal:** Full recording experience. **Figma references:** `56:280` (DEFAULT), `383:4474` (PAUSE), `378:4425` (PLAY), `383:4520` (ERROR), `438:10220` (LOADING)

### Reuse: `hooks/useRecording.ts`, `hooks/useAnalyzeRecording.ts`

### New hook:

**`hooks/useAudioPlayback.ts`**
- Wraps expo-audio player: play(uri), pause(), seek(seconds)
- Returns: `{ currentTime, duration, isPlaying, pause, play, seek }`

### Components in `components/recording/`:

**RecordingTimer.tsx** - Displays `HH:MM:SS` formatted from `durationSeconds` prop
**MicButton.tsx** - Large circular button (brand-blue), mic icon. Reanimated pulse animation when recording. Props: `onPress, status ("idle" | "recording" | "paused")`
**RecordingControls.tsx** - Compound component:
  - Recording state: pause + stop buttons
  - Paused state: resume + stop buttons
**PromptDisplay.tsx** - Shows prompt text in a rounded card at top (if prompt was selected)
**RecordingErrorModal.tsx** - Error overlay with retry/dismiss
**AnalysisLoadingScreen.tsx** - Full-screen loading with status text ("Transcribing..." → "Analyzing...")

### Screen `app/recording.tsx`:
- Full-screen modal with `presentation: "fullScreenModal"`
- Blue gradient background (expo-linear-gradient)
- Close X button top-right
- Flow: idle → tap mic → recording with timer → stop → loading → navigate to `/results`
- Route params: `{ prompt?: string }`
- For dev: can skip actual analysis and navigate to results with mock data

---

## Phase 5: Results Screen

**Goal:** Rich results display. **Figma reference:** `415:2249` (RESULT)

### New utilities:

**`lib/clarityArchetype.ts`**
- `getClarityArchetype(score: number)` → `{ name: string }`
- 90-100: "The Eloquent Communicator"
- 80-89: "The Confident Speaker"
- 70-79: "The Mindful Communicator"
- 60-69: "The Growing Speaker"
- Below 60: "The Emerging Voice"

**`lib/proTip.ts`**
- `getProTip(topFiller: string)` → tip string
- Returns context-aware advice based on most common filler word

### Components in `components/results/`:

**ClarityScoreCircle.tsx** - ProgressCircle (large) + percentage + archetype name + comparison text
**StatsRow.tsx** - 3 StatCards: Filler Count, Filler Per Min, Total Words
**FillerBreakdown.tsx** - "Your filler words" ranked list. Each item: rank number + filler text + ProgressBar + count
**HighlightedTranscript.tsx** - Full transcript text with filler words wrapped in highlighted spans (brand-blue-50 bg)
**ProTip.tsx** - Card with lightbulb icon + tip text
**AudioPlaybackBar.tsx** - Playback bar with play/pause, rewind 15s, forward 15s, time display. Uses `useAudioPlayback`
**ResultActions.tsx** - "Try again" (secondary button) + "Share" (primary button). Share uses RN Share API.

### Screen `app/results.tsx`:
- ScrollView composing all above
- Route params or mock data for: clarity score, filler count, fillers per minute, total words, filler breakdown, transcript words, audio URI
- Back button + checkmark (save) in header

---

## Phase 6: Progress Tab

**Goal:** Progress tracking screen. **Figma reference:** `265:414` (PROGRESS)

### New hooks (dummy data):

**`hooks/useWeeklySummary.ts`**
```typescript
export const useWeeklySummary = () => ({
  avgClarity: 85,
  avgFillersPerMin: 2.4,
  sessionsThisWeek: 12,
});
```

**`hooks/useFillerBreakdown.ts`**
```typescript
export const useFillerBreakdown = () => ({
  fillers: [
    { count: 10, text: "Actually" },
    { count: 9, text: "So" },
    { count: 6, text: "Um" },
    { count: 2, text: "Like" },
  ],
  period: "This month",
});
```

### Components in `components/progress/`:

**StreakCards.tsx** - Two side-by-side cards: "Current streak" (brand-blue bg, white text) + "Longest streak" (white bg). Uses `useStreak`.
**WeeklySummary.tsx** - "This week summary" card with 3 stats (sessions, filler/min, avg clarity)
**FillerGrid.tsx** - 2-column grid of filler cards showing word + count
**SessionHistoryList.tsx** - FlashList of past sessions (title, date, duration). Memoized items with stable callbacks. Tapping navigates to `/results`.

### Screen `app/(tabs)/progress.tsx`:
- ScrollView with "Progress" title
- Calendar icon in header (navigates to calendar view, or placeholder for now)
- Compose: StreakCards → WeeklySummary → FillerGrid → "Session history" + SessionHistoryList

---

## Phase 7: Friends Tab

**Goal:** Friends list and social features. **Figma references:** `283:2399` (FRIENDS), `286:557` (REQUESTS), `294:1017` (ADD), `438:10132` (DETAIL)

### Reuse: `hooks/useFriends.ts` or dummy data

### Components in `components/friends/`:

**FriendListItem.tsx** - Avatar + name + session count + streak (fire icon + number). Memoized for FlashList. Pressable → navigates to `/friend-detail`.
**FriendRequestItem.tsx** - Avatar + name + accept (checkmark) + reject (X) buttons
**SearchProfileItem.tsx** - Avatar + name + "Add" button

### Screens:

**`app/(tabs)/friends.tsx`** - TabToggle (Friends / Requests with count badge) + FlashList. Add friend button (person+) in header.
**`app/add-friend.tsx`** - Modal. SearchInput + results list of SearchProfileItem. Debounced search.
**`app/friend-detail.tsx`** - Friend avatar, name, stats (total sessions, current streak, avg clarity). "Remove friend" button. Route params: `{ friendId }`.

---

## Phase 8: Profile & Settings

**Goal:** Profile, badges, and settings screens. **Figma references:** `399:1220` (PROFILE), `415:2331` (BADGES), `415:2401` (SETTINGS)

### New hooks (dummy data):

**`hooks/useBadges.ts`**
- Computes which badges are unlocked using `constants/badges.ts` definitions
- Returns: `{ badges: UserBadge[], unlockedCount: number }`

**`hooks/useSettings.ts`**
- AsyncStorage read/write for preferences: `selectedFillerWords`, `dailyGoalMinutes`, `notificationsEnabled`
- Returns: `{ getSetting, setSetting, settings }`

### Components in `components/profile/`:

**ProfileHeader.tsx** - Large Avatar (xl) with blue ring + name + edit button
**ProBanner.tsx** - "Get Speecha Pro" gradient banner. Taps to `/paywall`. Only for non-pro users.
**ProfileStats.tsx** - Two StatCards (Total Words, Avg Clarity) + common filler display
**BadgesPreview.tsx** - Horizontal row of 3-4 badge icons + "See all" link → `/badges`

### Screens:

**`app/profile.tsx`** - Back arrow + settings gear in header. ScrollView: ProfileHeader → ProBanner → ProfileStats → BadgesPreview
**`app/badges.tsx`** - "Badges" title + back arrow. 3-column grid of all badges. Unlocked = full color, locked = dimmed/greyed.
**`app/settings.tsx`** - "Settings" title. Sections:
  - Speech: "Choose filler words" (chevron) + "Daily practice goals" (chevron)
  - Notifications: Daily reminder toggle, Streak at risk toggle, Filler analysis alert toggle, Friend request toggle
  - About: Privacy policy, Terms & conditions
  - App: Rate Speecha, Send feedback
  - Account: Sign out, Delete account (red, with confirmation)

---

## Phase 9: Paywall

**Goal:** Pro upgrade screen. **Figma reference:** `412:1786` (GET PRO)

### Components in `components/paywall/`:

**BenefitsList.tsx** - List of benefits from `constants/paywall.ts` with checkmark icons
**PlanCard.tsx** - Plan option (Annual/Monthly) with price, radio selection, optional "Best value" badge. Props: `badge, interval, onSelect, price, selected`
**PaywallSuccess.tsx** - Confirmation screen with checkmark animation

### Screen `app/paywall.tsx`:
- Modal presentation, blue gradient top
- Close X button
- "Unlock your Full Potential with Speecha Pro" heading
- BenefitsList
- Two PlanCards (Annual selected by default)
- "Upgrade to Pro" button
- For now: dummy purchase flow (update local state or Supabase profile)

---

## Phase 10: Prompt Selection

**Goal:** Category and prompt browsing. **Figma references:** `200:1414` (CATEGORY), `207:262` (LIST)

### Components in `components/prompts/`:

**CategoryCard.tsx** - Card with colored background + illustration + category name + prompt count. Props: `category, onPress`
**PromptListItem.tsx** - Prompt text + start/play icon. Pressable. Props: `onSelect, prompt`

### Screen `app/prompt-select.tsx`:
- "Choose category" title + back arrow
- 2-column grid of CategoryCards from `constants/prompts.ts`
- Tapping category: navigate or show prompt list inline
- Tapping prompt: navigate to `/recording?prompt=encodedText`

---

## Phase 11: Polish & Cleanup

**Goal:** Remove template code, add animations, audit dark mode.

### Cleanup:
- Delete remaining Expo template files not removed in Phase 2
- Move `components/useColorScheme.ts` to `hooks/` or replace with NativeWind dark mode
- Delete `app/test.tsx`

### Animations (Reanimated):
- MicButton pulse when recording (Phase 4 may already handle)
- Results clarity score count-up animation
- Streak celebration on home screen

### Dark mode:
- Audit every screen and component for dark: variants
- Ensure proper contrast and readability

### Error handling:
- Error boundary component wrapping each tab
- Graceful fallback for network failures
