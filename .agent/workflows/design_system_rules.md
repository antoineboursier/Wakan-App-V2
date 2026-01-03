---
description: Rules for UI development and Design System usage
---

# Design System & Component Usage Rules

This document establishes the STRICT rules for creating and editing UI elements in the Wakan V2 project.

## 1. Component First Philosophy
**NEVER** create a standard UI element from scratch if a component exists.
- **Buttons**: Always use `<Button variant="..." />`. DO NOT create `<button className="...">` manually for primary/secondary actions.
- **Back Navigation**: Always use `<BackButton />`.
- **Icons**: Use `@iconify/react` with the standard set used in the app (e.g., `mdi:`, `fa:`, `solar:`). Icon colors MUST often inherit from text using `text-current`.

## 2. Immutable Components
**NEVER** modify key UI components (`Button`, `BackButton`, etc.) to fit a specific use case unless EXPLICITLY requested.
- If a component doesn't fit, use its props (e.g., `className`) to override styles locally.
- Do not add new props or change internal logic of shared components for a single feature.

## 3. Typography & Text Styles
**NEVER** use arbitrary `text-[size]px` or `font-[family]` classes if a utility class exists.
- **Titles**: Use `title-big`, `title-med`, `title-lit`.
- **Paragraphs**: Use `para-big`, `para`, `para-lit`.
- **Fonts**: Use `font-display` (Skranji) for headings/accents and `font-sans` (DM Sans) for body text.

## 4. Colors & Variables
**NEVER** hardcode Hex values (e.g., `#F6AE31`) in inline styles or Tailwind classes if a CSS variable exists.
- **Accent**: Use `var(--accent-500)`, `var(--accent-900)`, etc.
- **Text**: Use `var(--text-primary)`, `var(--text-secondary)`.
- **Background**: Use `var(--background-main)`, `var(--background-card)`.

## 5. Implementation Workflow
When tasked to add a UI element:
1.  **Check existing components** in `src/components/ui/`.
2.  **Check `globals.css`** for available utility classes.
3.  **Apply standard classes** before writing custom CSS.
4.  **Ensure consistency** with the "Tirages" and "Quiz" visual patterns (Dark/Gold theme).

## 6. Specific Component Behavior
- **Primary Buttons**: The icon color MUST match the text color (`text-current`).

## 7. Visual Effects & Opacity
**NEVER** apply arbitrary opacity (e.g., `opacity-50`, `text-white/60`) unless :
- It is explicitly requested by the user.
- It is part of a standard disabled state defined in the component.
- Keep elements fully opaque by default for better readability and consistency.
