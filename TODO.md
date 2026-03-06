- IconButton
- <IconButton icon="close" onPress={router.back} variant="ghost" />
- <IconButton icon="question" onPress={() => router.push('/how-speecha-works')} size={36} variant="ghost" />
- should we create a generic screen Headers
- generic layout with 24px
- is Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); actually
- review all pressable opacity
- review all accessibility
- add `border-curve-continuous` Tailwind utility to replace inline `style={{ borderCurve: 'continuous' }}`
- SegmentedControls should not be using fixed height h-12. It should determine it's height based on it's children
- create a ui component for statcard to be generic

Optimization
-- IMPORTANT
-> Removing if (user?.id) checks, user must always be auth
RECORDING SCREEN

- Recording fetches profiles on mount (that seems unnecessary). Just to get recording tiers

RESULTS SCREEN

- There should be no need for isLoading or error views
- Results screen makes an extra get https://kulqrquoytougvtuheso.supabase.co/rest/v1/speech_analyses?select=*&id=eq.c7eb4266-0c06-4f5e-8551-57754b4c59fd to supabase to fetch results after recording
- - Eliminate redundant Supabase fetch on Results screen after recording. In `useCreateSpeechAnalysis` `onSuccess`, seed the detail cache: `queryClient.setQueryData(['speech-analysis-detail', data.id], data)`. Results screen will use cached data for fresh recordings, still fetch normally for past sessions from Progress.

Code Review

- Ignore dummy data
- remove any unnecessary view extra wrapper
- Document queueMicrotask pattern in useRecording.ts (used to defer setState and avoid cascading renders)

Marketing

- Feedback shows immediately after first result in onboarding

Backend

- Recording page loads
