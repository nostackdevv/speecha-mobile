# Component Library Code Review — Deferred Items

## Animations (Premium Polish)

### Button/IconButton — Reanimated press feedback
CSS `active:` states have a JS thread round-trip. For 60fps press feedback, use `GestureDetector` with `Gesture.Tap()` and Reanimated shared values. Scale down to 0.97 on press, spring back on release — runs entirely on UI thread.

```tsx
const pressed = useSharedValue(0);
const tap = Gesture.Tap()
  .onBegin(() => { pressed.set(withTiming(1, { duration: 100 })); })
  .onFinalize(() => { pressed.set(withTiming(0)); })
  .onEnd(() => { runOnJS(onPress)(); });

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.97]) }],
}));
```

**Files:** `components/ui/Button.tsx`, `components/ui/IconButton.tsx`

### ProgressCircle — Animate value changes
Currently jumps instantly to new values. Wrap the stroke calculation in a Reanimated shared value with `withTiming` so the circle fills smoothly when `value` changes.

**File:** `components/ui/ProgressCircle.tsx`

### ProgressBar — Animate value changes
Same as ProgressCircle — animate the width transition with `withTiming` or `withSpring` instead of instant jumps.

**File:** `components/ui/ProgressBar.tsx`

### TabToggle — Sliding active indicator
The active tab background snaps instantly. Add a translating background pill using `useAnimatedStyle` + `withTiming` on translateX so it slides between tabs.

**File:** `components/ui/TabToggle.tsx`

### Modal — Native presentationStyle
Current implementation uses a JS overlay (`transparent` + `fade`). Consider switching to `presentationStyle="formSheet"` for native swipe-to-dismiss, keyboard avoidance, and accessibility out of the box. Alternatively, add Reanimated entrance/exit animations (scale + opacity) to the current centered card approach.

**File:** `components/ui/Modal.tsx`

## Haptic feedback
Add light haptic feedback on button presses using `expo-haptics` for tactile response:
```tsx
import * as Haptics from 'expo-haptics';
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

**Files:** `components/ui/Button.tsx`, `components/ui/IconButton.tsx`, `components/ui/TabToggle.tsx`
