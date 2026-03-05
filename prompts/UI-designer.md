You're a top 1% expo react native software engineer. You are implementing a UI screens for Speecha. Use ultra think to come up with a plan for the implementation.

I have done some initial implementations in @components/screens/Recording.
Ignore anything about the recording logic for now. I do not need it to work. What is important is getting the design working and following best practices in my code. If you find anything that can be improved in @components/screens/Recording while analyzing let me know. Don't forget to ask clarifying questions where unsure and interview me in detail using AskUserQuestion tool on anything from. implementation, ui/ux, concerns and tradeoffs etc

## Your Task

Implement the UI from the provided Figma design, then verify it visually against a simulator screenshot.
Figma design: https://www.figma.com/design/HhdvmYhAeC40bTBDsPZkMP/SPEECHA?node-id=6589-1841&t=r0XYSUg0jWG45D6X-0

## Very Important

use the /implement-design skill to understand how to implement figma designs and follow it's instructions

use /building-native-ui to write the actual expo codes for best practices

---

## Workflow

### 1. Read the Figma Design

Use the Figma MCP to extract:

- Layout structure and component hierarchy
- Exact spacing, padding, margin values
- Colors (use the exact hex values — do not approximate)
- Typography: font size, weight, line height, letter spacing
- Border radius, shadows, opacity values
- Any images or icons used

Do not guess or infer values. Extract them precisely from Figma.

### 2. Implement the Component

Write the React Native component following the rules below.

### 3. Take a Simulator Screenshot

Once the app is running on the iOS simulator, run:

```bash
xcrun simctl io booted screenshot /tmp/simulator_screenshot.png
```

Then read the screenshot.

### 4. Compare Against Figma

Compare the simulator screenshot against the Figma design. Check for:

- Spacing and layout accuracy
- Color correctness
- Font size and weight
- Component alignment (flex issues, off-center elements)
- Missing or incorrectly sized elements
- Border radius or shadow discrepancies

If there are visible differences, fix them and repeat from step 3. Keep iterating until the implementation matches the design closely.

---

## Expo React Native Best Practices

### Layout

- Use Flexbox exclusively — no absolute positioning unless layering requires it (e.g. overlays, FABs)

### Components

- Use Expo SDK components where available: `expo-image` over `<Image>`, `expo-linear-gradient`, etc.
- Use `Pressable` over `TouchableOpacity` for all tap targets
- Add `hitSlop` to any tap target smaller than 44x44pt

### iOS-specific

- Test only against iOS simulator (iPhone 15 Pro or whatever is currently booted)
- Respect the iPhone notch/Dynamic Island — never let content bleed into it without safe area handling

---

## Output

After the final iteration, summarise:

1. What you implemented
2. Any differences found between Figma and simulator, and how you resolved them
3. Any design values that could not be replicated exactly in React Native and why
