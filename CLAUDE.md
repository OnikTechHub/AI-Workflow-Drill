# Apex Studio AI Workflow & Development Guide (`CLAUDE.md`)

This guide codifies the core engineering principles, architecture guidelines, and operational standards derived from our AI workflow drill iterations. Any AI agent or developer contributing to this repository must adhere to the following rules.

---

## 📌 Core Rules Learned from Prompting Iterations

### 1. Prompt Specificity vs. Visual Review
> **Never blindly trust a long or precise prompt; always visually verify and review the generated UI and components against design consistency.**
- **The Pitfall:** While a long, highly constrained prompt ensures functional completeness (schemas, ARIA tags, edge cases), models often optimize for structural compliance at the expense of aesthetic balance, resulting in cramped layouts and visual noise. Conversely, vague prompts may produce clean aesthetics while omitting critical validation and state management.
- **Protocol:**
  - Treat AI-generated components as a two-stage process: **Stage 1 (Architecture & Rigor)** followed by **Stage 2 (Visual Audit & Decluttering)**.
  - Inspect generated components in the browser or via automated previews. Check negative space, padding, typography scale, and information density.
  - Eliminate redundant visual clutter (e.g., unnecessary borders, stacked helper texts, or over-prominent test toggles) while preserving underlying functional correctness.

---

### 2. Strict Component Modularity
> **Keep form components modular, separating validation schemas (like Zod) and state management from the main view components.**
- **Architecture Standard:**
  - **Schemas (`src/components/settings/schemas/`):** Maintain all Zod schemas, inferred TypeScript types, and default values in dedicated files (`userSettingsSchema.ts`). Never inline schemas inside React components.
  - **UI Primitives (`src/components/settings/ui/`):** Encapsulate reusable input controls (`FormField`, `TextInput`, `Textarea`, `SelectInput`, `SwitchToggle`) with built-in accessibility wiring.
  - **View Components (`src/components/settings/`):** Form view components should focus purely on composition, layout, and user interactions without leaking validation logic into JSX tags.
  - **Toasts & Feedback (`src/components/settings/ui/Toast.tsx`):** Maintain toast notification contexts and containers decoupled from individual form lifecycles.

---

### 3. Edge Case Resilience & Controlled Accessibility
> **Explicitly enforce controlled inputs, proper aria-labels for accessibility, and robust error/loading states for all user-interactive forms.**
- **Controlled Inputs:**
  - Never allow inputs to toggle between uncontrolled and controlled. Every input must have defined initial values and be registered via React Hook Form `Controller` or controlled `register`.
- **Accessibility Requirements (WCAG 2.1 AA/AAA):**
  - All form controls must be associated with `<label htmlFor={id}>`.
  - Required fields must specify `aria-required="true"`.
  - Error states must apply `aria-invalid="true"` and link to error containers via `aria-describedby={`${id}-error`}`.
  - Error messages must use `role="alert"` or `aria-live="polite"`.
  - Switch toggles must provide `role="switch"` and `aria-checked` with keyboard support (`Space`/`Enter`).
  - Auto-focus the first invalid field upon rejected submissions (`shouldFocusError: true`).
- **Loading & Error Edge Cases:**
  - Disable submit buttons during active network requests, display animated spinners (`Loader2`), and set `aria-busy="true"`.
  - Gracefully handle server rejections (500 errors, network drops, rate limits) without wiping user-entered input.
  - Provide accessible top-level alert banners with actionable retry options and field-specific server error mapping (`setError`).
  - Track dirty state (`isDirty`) to warn users of unsaved changes and provide a clean *"Discard Changes"* reset action.

---

## 🛠️ Repository Commands

```bash
# Start local development server
npm run dev

# Run Vite production bundle build
npm run build

# Run fast code linter (Oxlint)
npm run lint

# Run automated Zod validation test suite
npx tsx src/components/settings/__tests__/userSettingsSchema.test.ts
```

---

## 🏗️ Technology Stack & Standards

- **Core**: React 19, Next.js App Router compatible (`'use client'`).
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), CSS custom properties for theming.
- **Form Architecture**: React Hook Form (`useForm`, `Controller`), `@hookform/resolvers/zod`.
- **Schema Validation**: Zod v4 with strict RFC 5322 regex checks, cross-field `.refine()`, and character limits.
- **Icons**: `lucide-react` with custom SVG fallbacks for brand assets.
