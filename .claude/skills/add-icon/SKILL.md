---
name: add-icon
description: 'Add SVG icons to the Speecha icon system. Use when the user wants to add a new icon, provides SVG code, or asks to integrate an icon from Iconify.'
---

# Add Icon to Speecha

## Steps to Add an Icon

1. **Get the SVG** — User provides SVG code or an Iconify icon name
2. **Convert colors** — Replace hardcoded colors with `currentColor`:
   - `fill="white"` or `fill="#xxx"` → `fill="currentColor"`
   - `stroke="black"` or `stroke="#xxx"` → `stroke="currentColor"`
   - For stroke-only icons, add `fill="none"`
3. **Save the file** — Create `assets/icons/{name}.svg` (kebab-case)
4. **Register the icon** — Update `constants/icons.ts`:
   - Add import: `import {PascalName} from '@/assets/icons/{name}.svg';`
   - Add to ICONS object: `{camelName}: {PascalName},`
   - Keep imports and ICONS entries alphabetically sorted
5. **Verify** — Run `npm run verify`

## File Locations

- SVG files: `/assets/icons/`
- Icon registry: `/constants/icons.ts`
- Icon component: `/components/ui/Icon.tsx`

## Usage After Adding

```tsx
import { Icon } from '@/components/ui/Icon';

<Icon name="newIconName" size={24} color="#000" />
```

## SVG Format Requirements

- Use `viewBox` (remove fixed width/height)
- Use `currentColor` for dynamic coloring
- Include `xmlns="http://www.w3.org/2000/svg"`
- No inline styles or CSS classes

## Example

User provides:
```svg
<svg width="24" height="24" fill="white"><path d="..."/></svg>
```

Convert to:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="..."/></svg>
```
