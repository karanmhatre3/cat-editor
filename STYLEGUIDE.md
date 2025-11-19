# CAT Editor - Style Guide

This style guide documents the design tokens extracted from the Figma design for consistent styling across the application.

## 🎨 Color Palette

### Background Colors
- **Primary Background**: `#171923` (`--color-background-primary`)
- **Secondary Background**: `#212330` (`--color-background-secondary`)
- **Tertiary Background**: `#121521` (`--color-background-tertiary`)

### Gray Scale
- **Gray 900**: `#121521` - Darkest gray
- **Gray 800**: `#212330` - Dark gray
- **Gray 700**: `#4d5059` - Medium gray (borders)
- **Gray 600**: `#6e747e` - Light gray (secondary text)
- **Gray 500**: `#73757c` - Lighter gray
- **White**: `#ffffff` - Pure white

### Brand Colors (Purple)
- **Purple 200**: `#c2bfec` - Light purple (Ask Assist)
- **Purple 300**: `#9e9de6` - Medium purple (Active state)
- **Purple 400**: `#535adc` - Dark purple (Highlights)

### Status Colors
- **Green 600**: `#099e7c` - Success (AI confidence, TB match)
- **Yellow 500**: `#ffbb14` - Warning (Edit in progress)
- **Yellow 700**: `#b07d00` - Dark yellow
- **Orange 600**: `#c84f09` - Caution (TM match)
- **Orange 700**: `#983c06` - Dark orange (Suggestions)
- **Red 400**: `#e45959` - Error light
- **Red 500**: `#d12626` - Error medium
- **Red 600**: `#c32424` - Error dark

### Text Colors
- **Primary**: `#ffffff` - Main text
- **Secondary**: `#6e747e` - Secondary text
- **Tertiary**: `#73757c` - Tertiary text

## 📝 Typography

### Font Families
- **Default**: `Noto Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **CAT Specific**: `Noto Sans, sans-serif`

### Font Sizes
- **Extra Small (xs)**: `12px` - Labels, chips
- **Small (s)**: `14px` - Body text, buttons
- **Medium (m)**: `16px` - Headers, emphasis

### Line Heights
- **Small**: `20px` - For 12px-14px text
- **Medium**: `24px` - For 16px text

### Font Weights
- **Normal**: `400` - Regular text
- **Medium**: `500` - Interactive elements
- **Bold**: `700` - Headers, emphasis

## 📏 Spacing Scale

### Spacing Values
- **XXS**: `2px` - Minimal spacing (chip padding)
- **XS**: `4px` - Small gaps
- **S**: `8px` - Standard padding
- **M**: `16px` - Medium spacing
- **L**: `24px` - Large gaps

### Border Radius
- **Small**: `6px` - Keyboard shortcuts
- **Medium**: `8px` - Cards, inputs
- **Large**: `16px` - Panels, major sections
- **Full**: `9999px` - Pills, rounded buttons

## 🎯 Component Patterns

### Buttons
- **Menu Items**: Gray text, hover to white
- **Active Tab**: Purple 300 text, tertiary background
- **Ask Assist**: Purple 200 text/icon, primary background, rounded pill

### Cards
- Secondary background (`#212330`)
- Medium border radius (`8px`)
- Border color: `#4d5059`

### Inputs
- Secondary background
- Medium padding (`16px`)
- Placeholder: Gray 600 (`#6e747e`)

### Status Indicators
- **Approved**: Green circle
- **In Progress**: Yellow text/highlight
- **Error**: Red circle/text
- **Draft**: Gray

## 🔧 Usage Examples

### CSS Variables
```css
/* Background */
background-color: var(--color-background-secondary);

/* Text */
color: var(--color-text-primary);
font-size: var(--font-size-s);
line-height: var(--line-height-s);

/* Spacing */
padding: var(--spacing-m);
gap: var(--spacing-l);

/* Border */
border-radius: var(--radius-m);
border: 1px solid var(--color-border-default);
```

### Utility Classes
```css
.text-xs { /* 12px font */ }
.text-sm { /* 14px font */ }
.text-base { /* 16px font */ }

.font-normal { /* 400 weight */ }
.font-medium { /* 500 weight */ }
.font-bold { /* 700 weight */ }
```

## 📦 File Structure

```
src/styles/
├── colors.css       # Color tokens
├── typography.css   # Font definitions
├── spacing.css      # Spacing & radius
└── globals.css      # Global styles (imports all)
```

Import in your components:
```tsx
import '../../styles/globals.css';
```

Or import in index.css (already configured):
```css
@import './styles/globals.css';
```
