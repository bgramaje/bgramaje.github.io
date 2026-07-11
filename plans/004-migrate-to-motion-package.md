# Plan 004: Standardize on the `motion` package (remove `framer-motion`)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5fffbdf..HEAD -- package.json src/components/JobModal.tsx src/pages/HomePage.tsx src/components/terminal/CommandToolbar.tsx src/pages/BlogListPage.tsx src/pages/BlogPage.tsx src/components/terminal/TerminalModal.tsx src/components/terminal/TerminalOutput.tsx src/components/ui/dot-pattern.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW-MED
- **Depends on**: plans/001-fix-broken-build-mdx-types.md (need a green build to verify)
- **Category**: migration
- **Planned at**: commit `5fffbdf`, 2026-07-11

## Why this matters

The project installs both `framer-motion` (^11.15.0) and `motion` (^12.29.2)
and imports from both interchangeably. `motion` is the renamed successor to
`framer-motion`; `motion/react` re-exports the same API (`motion`,
`AnimatePresence`, `useScroll`, `MotionProps`, etc.) that `framer-motion`
exposed. Carrying both is redundant, and the mixed imports are an
inconsistency that makes the codebase look undecided. Standardizing on
`motion/react` everywhere lets us drop `framer-motion` entirely — one
animation library, smaller `node_modules`, consistent imports.

## Current state

`package.json`:

```json
"framer-motion": "^11.15.0",   // line 22
"motion": "^12.29.2",          // line 29
```

Files importing from `"framer-motion"` (8 files):

- `src/components/JobModal.tsx:2` — `import { motion, AnimatePresence } from "framer-motion";`
- `src/pages/HomePage.tsx:3` — `import { motion, AnimatePresence } from "framer-motion";`
- `src/components/terminal/CommandToolbar.tsx:12` — `import { motion } from "framer-motion";`
- `src/pages/BlogListPage.tsx:3` — `import { motion } from "framer-motion";`
- `src/pages/BlogPage.tsx:3` — `import { motion } from "framer-motion";`
- `src/components/terminal/TerminalModal.tsx:2` — `import { motion, AnimatePresence } from "framer-motion";`
- `src/components/terminal/TerminalOutput.tsx:2` — `import { motion } from "framer-motion";`
- `src/components/ui/dot-pattern.tsx:2` — `import { motion } from "framer-motion"`

Files already importing from `"motion/react"` (keep as-is):

- `src/components/ui/code-block.tsx:13`
- `src/components/ui/logo-carousel.tsx:8`
- `src/components/ui/highlighter.tsx:5`
- `src/components/ui/scroll-progress.tsx:2`
- (Plan 002 deletes `src/components/kokonutui/toolbar.tsx`, which also used
  `motion/react` — so it is not a concern here.)

API compatibility: `motion/react` exposes `motion`, `AnimatePresence`,
`useScroll`, `MotionProps`, `useInView`, etc. — identical to `framer-motion`'s
named exports. The migration is a specifier swap, not an API rewrite.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Install   | `npm install`       | exit 0              |
| Build     | `npm run build`     | exit 0              |
| Lint      | `npm run lint`      | no new errors |
| Search    | `rg -n "framer-motion" src/ package.json` | no matches |

## Scope

**In scope** (the only files you should modify):
- `src/components/JobModal.tsx`
- `src/pages/HomePage.tsx`
- `src/components/terminal/CommandToolbar.tsx`
- `src/pages/BlogListPage.tsx`
- `src/pages/BlogPage.tsx`
- `src/components/terminal/TerminalModal.tsx`
- `src/components/terminal/TerminalOutput.tsx`
- `src/components/ui/dot-pattern.tsx`
- `package.json` (remove `framer-motion`)
- `package-lock.json` (regenerated)

**Out of scope** (do NOT touch):
- The 4 files already using `motion/react` (code-block, logo-carousel,
  highlighter, scroll-progress) — they are already correct.
- Any component bodies — only the import specifiers change. Do not rewrite
  motion props, variants, or animations.

## Git workflow

- Branch: `advisor/004-motion-migration`
- Commit: `refactor: standardize on motion/react, drop framer-motion`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Swap the import specifier in all 8 files

In each of the 8 in-scope files, replace `"framer-motion"` with `"motion/react"`
on the import line. The named imports stay identical.

For example, in `src/components/JobModal.tsx:2`:

```ts
// before
import { motion, AnimatePresence } from "framer-motion";
// after
import { motion, AnimatePresence } from "motion/react";
```

Repeat for all 8 files listed in "Current state". Use a precise edit per file
(do not blanket-replace across the repo — `package.json` and these 8 files are
the only places `framer-motion` should appear).

**Verify**: `rg -n "framer-motion" src/` returns no matches.

### Step 2: Remove framer-motion from package.json

Delete this line from `package.json` dependencies:

```json
"framer-motion": "^11.15.0",
```

Leave `"motion": "^12.29.2",` in place.

### Step 3: Reinstall

```bash
npm install
```

**Verify**: exit 0; `node_modules/framer-motion` is removed (it is no longer a
direct or transitive dep — `motion` does not depend on `framer-motion`).
Confirm:

```bash
ls node_modules/framer-motion 2>&1 | head -1
```

Expected: "No such file or directory" (or equivalent). If it still exists,
some other dep pulls it in transitively — report it (STOP) so the plan can be
adjusted rather than leaving a hidden dep.

### Step 4: Build and lint

```bash
npm run build
npm run lint
```

**Verify**: `npm run build` exits 0 (TypeScript confirms the `motion/react`
types resolve and the named exports exist). `npm run lint` introduces no new
errors.

## Test plan

No new tests. Behavioral surface: every animated component. Manual sanity
check (recommended — animation regressions are visual, not caught by build):

- `/` — terminal entrance animation (`HomePage` motion.div), toolbar button
  hover (`CommandToolbar`), output row entrance (`TerminalOutput`).
- Open the generic terminal modal (any command that opens it) and a job modal
  (`jobs <slug>`) — scale/opacity enter+exit animations play.
- `/blog` and `/blog/<slug>` — list item stagger and page entrance animations.
- A page using `DotPattern` with `glow` — dot pulsing animation plays.

If any animation visually breaks or throws at runtime, STOP and report
(likely a v11→v12 API nuance in that specific usage).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `rg -n "framer-motion" src/ package.json package-lock.json` returns no matches
- [ ] `node_modules/framer-motion` does not exist
- [ ] All 8 in-scope files import from `"motion/react"`
- [ ] `npm run build` exits 0
- [ ] `npm run lint` error count is unchanged or lower vs. pre-plan
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `npm run build` reports a type error tracing to a `motion/react` import
  (would mean a named export differs between v11 framer-motion and v12 motion
  — report the exact symbol so the plan can decide whether to keep that
  import from `framer-motion` or adjust the call site).
- A runtime animation breaks (see Test plan) — do not paper over it; report
  the component and the symptom.
- `node_modules/framer-motion` persists after removal, indicating a transitive
  dependency you did not expect.

## Maintenance notes

- `motion` v12 is the active package; `framer-motion` is the legacy name.
  Future animation work should import from `motion/react`.
- If `motion` is ever bumped across a major version, re-check the changelog
  for renamed exports — the API has been stable from framer-motion v11 →
  motion v12, but v13+ could change.
- Reviewer: run `npm run dev` and click through the routes in the Test plan;
  animation regressions are the one thing the build cannot catch.
