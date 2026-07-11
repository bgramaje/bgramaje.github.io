# Plan 007: Remove the artificial loading delay in BlogPage

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5fffbdf..HEAD -- src/pages/BlogPage.tsx`
> If the file changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as
> a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (independent)
- **Category**: perf/ux
- **Planned at**: commit `5fffbdf`, 2026-07-11

## Why this matters

`BlogPage` waits a fixed 250ms before rendering `<BlogPost>`, even though
`BlogPost` already manages its own loading state (a spinner while the MDX
chunk loads). The delay makes every blog navigation feel sluggish for no
benefit — it does not improve perceived performance, it just adds latency.
Removing it lets the real loading state show immediately and the post appear
as soon as the MDX is ready.

## Current state

`src/pages/BlogPage.tsx`:

```ts
const LOAD_DELAY_MS = 250;                       // line 10

export function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const [ready, setReady] = useState(false);     // line 14

  useEffect(() => {                              // lines 16-21
    if (!id) return;
    setReady(false);
    const t = setTimeout(() => setReady(true), LOAD_DELAY_MS);
    return () => clearTimeout(t);
  }, [id]);
```

The `ready` flag gates two early returns:

- lines 35-50: a "Cargando…" skeleton shown while `!ready`.
- the real `<BlogPost id={id} />` at line 78 only renders once `ready` is true.

`BlogPost` (`src/components/BlogPost.tsx:10-35`) already shows its own spinner
while the MDX module loads, so the outer delay is redundant.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Build     | `npm run build`     | exit 0              |
| Lint      | `npm run lint`      | no new errors |

## Scope

**In scope** (the only file you should modify):
- `src/pages/BlogPage.tsx`

**Out of scope** (do NOT touch):
- `src/components/BlogPost.tsx` — its loading state stays.
- The motion/animation props on the surrounding `<motion.article>` — keep the
  entrance animation; only the artificial delay gate is removed.

## Git workflow

- Branch: `advisor/007-remove-blogpage-delay`
- Commit: `perf: remove artificial 250ms delay in BlogPage`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Remove the delay state and gate

In `src/pages/BlogPage.tsx`:

1. Delete the `const LOAD_DELAY_MS = 250;` line (line 10).
2. Remove the `useState`/`useEffect` imports if they become unused after the
   edit — `useEffect` will be unused, `useState` will be unused. Check: the
   component currently uses `useState` only for `ready` and `useEffect` only
   for the delay timer. After removal, neither is used. Update the import on
   line 1:
   ```ts
   // before
   import { useState, useEffect } from "react";
   // after
   import { useParams, Link } from "react-router-dom";
   ```
   Wait — line 1 is `import { useParams, Link } from "react-router-dom";`
   already? No: line 1 is `import { useState, useEffect } from "react";` and
   line 2 is `import { useParams, Link } from "react-router-dom";`. After the
   edit, line 1's react import is fully unused — remove it.
3. Delete the `const [ready, setReady] = useState(false);` line.
4. Delete the `useEffect` block (lines 16-21).
5. Delete the `if (!ready) { ... }` skeleton block (lines 35-50).
6. The `if (!id) { ... }` block (lines 23-33) stays — that is the real
   "post not found" guard.

After the edit, the component returns the `not-found` block when `!id`, and
otherwise renders the `<motion.article>` with `<BlogPost id={id} />` directly.

**Verify**: `npx tsc -b` exits 0 with no `noUnusedLocals` errors (if
`useState`/`useEffect` are left imported but unused, `tsc` will fail under
`noUnusedLocals` — that is the guard).

### Step 2: Build and lint

```bash
npm run build
npm run lint
```

**Verify**: both exit 0; no new errors.

## Test plan

No new tests. Manual sanity check:

- Navigate to `/blog/<valid-slug>`. The page should render without the
  250ms blank/skeleton delay; `BlogPost`'s own spinner shows briefly (while
  the MDX chunk loads) and is replaced by the post content.
- Navigate to `/blog/nonexistent-id`. The `BlogPost` error state ("Failed to
  load post: nonexistent-id") shows — no artificial delay before it.
- Navigate to a route with no `:id`. The "Post no encontrado." block with the
  "Volver al blog" link shows.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `rg -n "LOAD_DELAY_MS|setReady|\bready\b" src/pages/BlogPage.tsx` returns no matches
- [ ] `rg -n "useState|useEffect" src/pages/BlogPage.tsx` returns no matches (unless re-added for another reason — it should not be)
- [ ] `npm run build` exits 0
- [ ] `npm run lint` introduces no new errors
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `npm run build` reports `noUnusedLocals` errors in `BlogPage.tsx` after the
  edit — means a stray import or variable remains; remove it and re-run. If
  an error persists that is not an unused-local, report.
- Removing the skeleton removes a layout element that other code depends on
  (none expected — the skeleton is local JSX), report any cross-file breakage.

## Maintenance notes

- The entrance animation on `<motion.article>` (initial opacity/y, animate)
  remains; only the timer-based gate is gone. If a future change wants a
  deliberate reveal, use the animation's `delay`, not a state gate that
  blocks rendering.
- Reviewer: click through to a blog post and confirm it appears faster than
  before with no blank gap.
