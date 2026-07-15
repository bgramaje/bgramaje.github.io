# 021 — Fade BlogPost load → content (match JobPost)

- **Status**: DONE
- **Commit**: `eb16c01`
- **Severity**: MEDIUM
- **Category**: Missed opportunities (preventing a jarring change)
- **Estimated scope**: 1 file (`src/components/blog/BlogPost.tsx`), small

## Problem

When a blog post finishes loading, the spinner unmounts and the MDX header/body appear with no bridge. That is a hard cut on the primary reading surface.

`src/components/blog/BlogPost.tsx:120–178` — current (loading and content are plain `div`s; no enter motion):

```tsx
  if (loading) {
    return (
      <div className={wrapperClass} lang={lang}>
        <div role="status" className="flex items-center gap-2 py-6 text-muted-foreground text-sm">
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary"
            aria-hidden="true"
          />
          Loading…
        </div>
      </div>
    );
  }

  if (error || !MDXContent) {
    return (
      <div className={wrapperClass} lang={lang}>
        <p className="text-destructive" role="alert">
          {error ?? "Failed to load post"}: <span className="text-foreground">{id}</span>
        </p>
      </div>
    );
  }

  const Content = MDXContent;
  return (
    <div className={wrapperClass} lang={lang}>
      {/* header + MDX … */}
    </div>
  );
```

Job write-ups already solve the same async seam. The blog path should match that feel, not invent a second motion language.

Frequency: occasional (once per post / locale open). Purpose: preventing a jarring change. Duration stays under the UI 300ms budget.

## Target

Mirror `JobPost`’s opacity-only enter for loading, error, and content:

| Phase | Properties | Duration | Easing |
| --- | --- | --- | --- |
| Loading shell enter | `opacity: 0 → 1` | `0.2` s (200ms) | default Motion ease is fine (JobPost uses bare `duration: 0.2`) |
| Content / error enter | `opacity: 0 → 1` | `0.28` s (280ms) | `[0.16, 1, 0.3, 1]` (repo ease-out; same as JobPost / dialog tokens) |

- **Opacity only** — do not add `y`, `scale`, or `filter: blur` on `BlogPost`. `BlogPage` already animates the surrounding `<motion.article>` with `y` + blur (`src/app/pages/BlogPage.tsx:74–80`). Stacking a second translate/blur here would double-move the same content.
- **No `AnimatePresence` / true overlapping crossfade** — JobPost swaps branches with keyed `motion.div`s; content fades in after loading unmounts. Match that (fade-in of the settled state), not a custom dual-layer crossfade.
- **Keys** must remount when post or locale changes so the enter runs again: `loading-${id}-${effectiveLocale ?? "default"}`, `error-${id}-${effectiveLocale ?? "default"}`, `content-${id}-${effectiveLocale ?? "default"}`.
- **Reduced motion**: repo global rule in `src/index.css` already forces `animation-duration` / `transition-duration` to `0.01ms` under `prefers-reduced-motion: reduce`. Do **not** add `useReducedMotion` unless you find Motion ignoring that for this case in the feel check; if Motion still runs a full 280ms opacity tween under reduced-motion, shorten content/error `transition.duration` to `0.15` when `window.matchMedia("(prefers-reduced-motion: reduce)").matches` is true **or** use `useReducedMotion()` from `motion/react` and set duration to `0.15`. Keep opacity feedback; do not set duration to `0` (AUDIT: gentler, not zero).

Target shape (illustrative — put the shared config next to the component like JobPost):

```tsx
import { motion } from "motion/react";

const contentMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
};

// loading:
<motion.div
  key={`loading-${id}-${effectiveLocale ?? "default"}`}
  className={wrapperClass}
  lang={lang}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
>
  {/* existing spinner markup unchanged */}
</motion.div>

// error:
<motion.div
  key={`error-${id}-${effectiveLocale ?? "default"}`}
  className={wrapperClass}
  lang={lang}
  {...contentMotion}
>
  {/* existing error markup unchanged */}
</motion.div>

// content:
<motion.div
  key={`content-${id}-${effectiveLocale ?? "default"}`}
  className={wrapperClass}
  lang={lang}
  {...contentMotion}
>
  {/* existing header + MDX unchanged */}
</motion.div>
```

## Repo conventions to follow

- Motion library: `motion/react` (not `framer-motion`). Project already standardized on this (see plan 004).
- Shared MDX async enter exemplar — copy values from here, do not invent new curves:

```tsx
/* src/components/jobs/JobPost.tsx:11–15, 48–88 — exemplar */
const contentMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
};
```

- Same cubic-bezier appears in CSS dialog/drawer tokens (`src/index.css`: `--animate-dialog-in` uses `cubic-bezier(0.16, 1, 0.3, 1)`). Prefer this repo curve over AUDIT.md’s alternate `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` so blog and jobs stay cohesive.
- Keep `wrapperClass`, `lang={lang}`, spinner/`role="status"`, error `role="alert"`, header, and MDX tree exactly as they are — only wrap roots in `motion.div` and add the motion props/keys.
- Do not define components inside `BlogPost`. Module-level `contentMotion` const is fine (JobPost pattern).

## Steps

1. Open `src/components/blog/BlogPost.tsx`. Confirm the loading / error / content early returns still match the Problem excerpt (lines ~120–178 at commit `eb16c01`). If the structure has drifted materially (no loading branch, different state machine), **STOP** and report.

2. Add the import next to the existing React imports:

```tsx
import { motion } from "motion/react";
```

3. Above `export function BlogPost`, add the module-level config exactly:

```tsx
const contentMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
};
```

4. Replace the **loading** root `<div className={wrapperClass} lang={lang}>` with a `motion.div` that keeps the same `className` and `lang`, adds `key={\`loading-${id}-${effectiveLocale ?? "default"}\`}`, and uses `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `transition={{ duration: 0.2 }}`. Leave the inner spinner markup untouched.

5. Replace the **error** root `<div>` the same way: `motion.div`, same `className`/`lang`, `key={\`error-${id}-${effectiveLocale ?? "default"}\`}`, spread `{...contentMotion}`. Leave the alert paragraph untouched.

6. Replace the **content** root `<div>` the same way: `motion.div`, same `className`/`lang`, `key={\`content-${id}-${effectiveLocale ?? "default"}\`}`, spread `{...contentMotion}`. Leave header, `BlogLocaleBanner`, `MDXProvider`, and body untouched.

7. Do not change `BlogPage.tsx`, loaders, or loading UI copy/spinner.

8. Run verification (below). Update `plans/README.md` row for 021 to DONE when complete.

## Boundaries

- Do **NOT** edit `src/app/pages/BlogPage.tsx` (outer article `y`/`blur` entrance stays as-is).
- Do **NOT** edit `JobPost.tsx`, terminal outputs, or dialog/drawer CSS tokens.
- Do **NOT** add `AnimatePresence`, layout animations, stagger, blur, translate, or scale on `BlogPost`.
- Do **NOT** add dependencies.
- Do **NOT** change load logic (`loadBlogContent`, effects, SEO/`useDocumentHead`).
- Do **NOT** remove `role="status"` / `role="alert"` or alter accessible loading/error text.
- If `BlogPost.tsx` no longer has a distinct loading early-return (e.g. already uses Suspense differently), **STOP** and report instead of inventing a new pattern.

## Verification

- **Mechanical**:
  - `npm run lint` — no new errors in `BlogPost.tsx`.
  - `npm run build` — `tsc -b` + Vite succeed.
- **Feel check**:
  1. `npm run dev` → open `/blog`, click a post (or hard-refresh a `/blog/:id/:locale` URL with DevTools Network throttling so the MDX chunk is slow enough to see the spinner).
  2. Confirm: spinner appears (may briefly fade in), then when content arrives the post **fades in over ~280ms** — no pop, no vertical jump from this change, no blur pulse from `BlogPost` itself (BlogPage’s own article entrance may still blur once on first mount; that is out of scope).
  3. Switch locale via the locale banner (if the post has `en`/`es`). Confirm the enter runs again for the new content (key includes locale).
  4. DevTools → Animations panel → set playback to 10%: opacity should ease out (fast start), not ease-in (slow start). Duration for content ≈ 280ms.
  5. Rendering panel → emulate `prefers-reduced-motion: reduce`: opacity feedback should still exist but feel near-instant / ≤150ms; no new translate/blur from `BlogPost`.
  6. Force an error path if practical (invalid id already handled by `BlogPage`; optional: temporarily break `loadBlogContent` in a local-only edit then revert) — error text should fade in with the same `contentMotion`, not pop.
- **Done when**: load → content no longer hard-cuts; values match JobPost (`0.28` + `[0.16, 1, 0.3, 1]`); lint/build green; `BlogPage` untouched.
