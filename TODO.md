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

Code Review

- Ignore dummy data
- remove any unnecessary view extra wrapper
- Document queueMicrotask pattern in useRecording.ts (used to defer setState and avoid cascading renders)

Marketing

- Feedback shows immediately after first result in onboarding
