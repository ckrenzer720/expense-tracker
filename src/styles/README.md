# Modular CSS Architecture

This directory contains the modular CSS architecture for the Expense Tracker application. The CSS is organized into logical modules for better maintainability, scalability, and team collaboration.

## Directory Structure

```
src/styles/
├── base/                 # Base styles and design tokens
│   ├── variables.css     # CSS custom properties and design system
│   └── reset.css         # CSS reset and base element styles
├── layout/               # Layout-specific styles
│   ├── app.css          # Main app layout
│   ├── header.css       # Header component styles
│   └── sidebar.css      # Sidebar component styles
├── components/           # Reusable component styles
│   ├── button.css       # Button component and variants
│   ├── card.css         # Card component and variants
│   ├── form.css         # Form elements and validation
│   ├── modal.css        # Modal overlay and content
│   └── loading.css      # Loading states and animations
├── pages/               # Page-specific styles
│   ├── dashboard.css    # Dashboard page styles
│   └── expenses.css     # Expenses page styles
├── utilities/           # Utility classes
│   └── utilities.css    # Helper classes for common patterns
├── responsive/          # Responsive design
│   └── responsive.css   # Media queries and breakpoints
├── main.css            # Main entry point that imports all modules
└── README.md           # This documentation
```

## Design System

### CSS Custom Properties

The design system is built using CSS custom properties defined in `base/variables.css`:

- **Colors**: Primary, secondary, warning, danger, and neutral colors
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, 2xl)
- **Border Radius**: Standardized border radius values
- **Shadows**: Consistent shadow system
- **Transitions**: Standardized transition durations
- **Z-index**: Organized z-index scale

### Usage

```css
/* Using design tokens */
.button {
  background-color: var(--primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}
```

## Component Architecture

### Button Component

The button component supports multiple variants and sizes:

```css
/* Base button */
.button

/* Variants */
.button--primary
.button--secondary
.button--danger
.button--warning

/* Sizes */
.button--small
.button--medium
.button--large

/* States */
.button:disabled
.button--loading
```

### Card Component

The card component provides consistent styling with variants:

```css
/* Base card */
.card

/* Padding variants */
/* Padding variants */
/* Padding variants */
/* Padding variants */
.card--padding-small
.card--padding-medium
.card--padding-large

/* Accent borders */
.card--accent
.card--accent-success
.card--accent-warning
.card--accent-danger

/* Interactive */
.card--interactive;
```

## Utility Classes

The utility system provides helper classes for common patterns:

### Spacing

```css
.m-0, .m-1, .m-2, .m-4, .m-6, .m-8  /* margin */
.p-0, .p-1, .p-2, .p-4, .p-6, .p-8; /* padding */
```

### Flexbox

```css
.flex,
.flex-col .items-center,
.justify-center,
.justify-between .gap-1,
.gap-2,
.gap-4,
.gap-6,
.gap-8;
```

### Text

```css
.text-left,
.text-center,
.text-right .text-xs,
.text-sm,
.text-base,
.text-lg,
.text-xl .font-normal,
.font-medium,
.font-semibold,
.font-bold;
```

### Colors

```css
.text-primary,
.text-secondary,
.text-blue,
.text-green .bg-white,
.bg-surface,
.bg-primary,
.bg-secondary;
```

## Responsive Design

The responsive system uses a mobile-first approach:

- **Mobile**: `max-width: 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `1024px+`
- **Large Desktop**: `1200px+`

### Breakpoints

```css
/* Mobile first */
@media (min-width: 576px) {
  /* Small devices */
}
@media (min-width: 768px) {
  /* Medium devices */
}
@media (min-width: 992px) {
  /* Large devices */
}
@media (min-width: 1200px) {
  /* Extra large devices */
}
```

## Accessibility Features

The CSS includes several accessibility features:

- **High contrast mode** support
- **Reduced motion** support for users with vestibular disorders
- **Focus indicators** for keyboard navigation
- **Print styles** for better printing experience

## Best Practices

### 1. Use Design Tokens

Always use CSS custom properties instead of hardcoded values:

```css
/* ✅ Good */
.button {
  background-color: var(--primary);
  padding: var(--spacing-md);
}

/* ❌ Bad */
.button {
  background-color: #3b82f6;
  padding: 1rem;
}
```

### 2. Follow BEM Naming Convention

Use BEM (Block, Element, Modifier) for component classes:

```css
/* Block */
.card

/* Element */
/* Element */
/* Element */
/* Element */
.card__title
.card__content

/* Modifier */
.card--accent
.card--padding-small;
```

### 3. Mobile-First Approach

Write styles for mobile first, then enhance for larger screens:

```css
/* Mobile styles (default) */
.container {
  padding: var(--spacing-md);
}

/* Desktop styles */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-xl);
  }
}
```

### 4. Use Utility Classes

Leverage utility classes for common patterns:

```css
/* ✅ Good */
<div class="flex items-center gap-4 p-6">

/* ❌ Bad */
<div style="display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem;">
```

## Adding New Styles

### 1. Component Styles

Add new component styles in `components/` directory:

```css
/* components/alert.css */
.alert {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.alert--success {
  background-color: var(--secondary);
  color: white;
}

.alert--error {
  background-color: var(--danger);
  color: white;
}
```

### 2. Page Styles

Add page-specific styles in `pages/` directory:

```css
/* pages/settings.css */
.settings-header {
  margin-bottom: var(--spacing-xl);
}

.settings-form {
  max-width: 600px;
}
```

### 3. Update Main CSS

Import new files in `main.css`:

```css
/* main.css */
@import "./components/alert.css";
@import "./pages/settings.css";
```

## Performance Considerations

- CSS imports are processed at build time
- Only used styles are included in the final bundle
- Utility classes are optimized for tree-shaking
- Critical CSS can be inlined for faster initial render

## Browser Support

The CSS architecture supports:

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- CSS Custom Properties
- CSS animations and transitions

For older browser support, consider using PostCSS with autoprefixer and CSS custom properties polyfill.
