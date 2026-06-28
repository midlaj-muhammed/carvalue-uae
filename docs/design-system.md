# Design System — CarValue UAE

## 1. Brand Identity

**Product name:** CarValue UAE
**Tone:** Trustworthy, precise, modern
**Feel:** Like a financial tool — clean, not flashy. Data is the hero.

---

## 2. Color Palette

```css
/* Primary */
--color-primary:        #1B4F8A;   /* UAE-toned blue — main CTAs, headings */
--color-primary-dark:   #143D6B;   /* Hover state */
--color-primary-light:  #2D6CB0;   /* Active state */

/* Accent */
--color-accent:         #D4A017;   /* Gold — UAE flag reference, highlights */

/* Neutral */
--color-bg:             #F8FAFC;   /* Page background */
--color-surface:        #FFFFFF;   /* Cards, form background */
--color-border:         #E2E8F0;   /* Input borders, dividers */
--color-text-primary:   #1A202C;   /* Main text */
--color-text-secondary: #4A5568;   /* Labels, secondary text */
--color-text-muted:     #718096;   /* Placeholder, hints */

/* Semantic */
--color-success:        #38A169;   /* Result card border */
--color-error:          #E53E3E;   /* Validation errors */
--color-warning:        #D69E2E;   /* Disclaimer text */

/* Price Display */
--color-price:          #1B4F8A;   /* Main predicted price */
--color-range:          #4A5568;   /* Min-max range text */
```

**Tailwind config additions:**
```js
// tailwind.config.ts
colors: {
  primary: { DEFAULT: '#1B4F8A', dark: '#143D6B', light: '#2D6CB0' },
  accent: '#D4A017',
}
```

---

## 3. Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display (hero title) | Inter | 700 | 48px / 3rem |
| Heading H1 | Inter | 700 | 36px / 2.25rem |
| Heading H2 | Inter | 600 | 28px / 1.75rem |
| Heading H3 | Inter | 600 | 20px / 1.25rem |
| Body | Inter | 400 | 16px / 1rem |
| Label | Inter | 500 | 14px / 0.875rem |
| Caption / hint | Inter | 400 | 12px / 0.75rem |
| Price display | Inter | 800 | 52px / 3.25rem |

**Load via Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## 4. Spacing System

Use Tailwind's default 4px base scale. Key values:
- `p-4` = 16px — standard card padding
- `gap-4` = 16px — form field gap
- `gap-6` = 24px — section spacing
- `py-16` = 64px — section vertical padding
- `max-w-2xl` = 672px — form max width (centered)

---

## 5. Component Specifications

### Form Card
```
Background: white (#FFFFFF)
Border: 1px solid #E2E8F0
Border radius: 12px (rounded-xl)
Shadow: 0 4px 24px rgba(0,0,0,0.08)
Padding: 32px (p-8)
Max width: 672px, centered
```

### Input / Select Field
```
Height: 44px
Border: 1px solid #E2E8F0
Border radius: 8px (rounded-lg)
Padding: 0 12px
Focus ring: 2px #1B4F8A
Background: white
Font size: 16px (prevents iOS zoom)
Full width within form
```

### Primary Button (Get Estimate)
```
Background: #1B4F8A
Text: white, font-weight 600
Height: 48px
Border radius: 8px (rounded-lg)
Width: full (w-full)
Hover: #143D6B
Loading: gray + spinner icon
```

### Result Card (Success)
```
Background: white
Border-left: 4px solid #38A169
Border radius: 12px
Shadow: same as form card
Price text: #1B4F8A, 52px, bold
```

### Result Card (Error)
```
Border-left: 4px solid #E53E3E
```

### Skeleton Loader
```
Background: linear-gradient(90deg, #f0f4f8, #e2e8f0, #f0f4f8)
Animation: shimmer left-to-right, 1.5s loop
Tailwind: use animate-pulse on bg-gray-200 divs
```

---

## 6. Icon System

Use **Lucide React** (already bundled with shadcn/ui).

| Usage | Icon |
|---|---|
| Car / vehicle | `Car` |
| Location | `MapPin` |
| Success/check | `CheckCircle` |
| Error | `AlertCircle` |
| Warning/info | `Info` |
| Reset/refresh | `RotateCcw` |
| Share | `Share2` |
| Loading spinner | `Loader2` with `animate-spin` |

---

## 7. Responsive Breakpoints

Use Tailwind defaults:
| Breakpoint | Width | Notes |
|---|---|---|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop — show hero image |
| `xl` | 1280px | Wide desktop |

Mobile-first approach: write base styles for mobile, add `md:` / `lg:` overrides.

---

## 8. Dos and Don'ts

**Do:**
- Use AED prefix for every price: `AED 72,500`
- Use comma formatting for numbers: `85,000 KM`, `AED 245,000`
- Keep form labels above inputs, not placeholder-only
- Show required fields with `*`
- Use `font-size: 16px` on inputs (prevents iOS zoom)

**Don't:**
- Use green for the price — green = money in some contexts, but it implies "good deal" which is misleading
- Use animations longer than 300ms — feels slow on mobile
- Show raw model output numbers — always round to nearest 500 AED
- Use dark mode — not required for MVP
- Mix AED and USD anywhere in UI
