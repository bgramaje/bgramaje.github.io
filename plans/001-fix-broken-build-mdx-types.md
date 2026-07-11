# Plan 001: Make `npm run build` green again

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5fffbdf..HEAD -- src/mdx-components.tsx src/mdx-work-components.tsx package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `5fffbdf`, 2026-07-11

## Why this matters

`npm run build` currently exits 1. `tsc -b` emits ~30 errors, all stemming from
two files importing `MDXComponents` from `mdx/types` — a types package that is
not installed. Because the contextual type is missing, every destructured MDX
component prop (`{ children, ...props }`) cascades into an "implicit any"
error (TS7031). This breaks the repo's own verification gate (AGENTS.md:
"Before claiming work is done, run `npm run build` and `npm run lint`") and
fails the GitHub Actions deploy job (`npm run build` in
`.github/workflows/deploy.yml`). Installing `@types/mdx` resolves the
`mdx/types` import, which restores the contextual type and eliminates every
TS7031 in one move. This is the prerequisite for every other plan — nothing
can be safely verified until the build is green.

## Current state

`src/mdx-components.tsx:1` and `src/mdx-work-components.tsx:2` both import:

```ts
import type { MDXComponents } from "mdx/types";
```

`mdx/types` is not resolvable — confirmed during audit: no
`node_modules/@types/mdx`, no `node_modules/@mdx-js/mdx`. `package.json`
devDependencies (lines 47-63) have no `@types/mdx` entry.

The cascading errors look like:

```
src/mdx-components.tsx(45,12): error TS7031: Binding element 'children' implicitly has an 'any' type.
src/mdx-work-components.tsx(2,36): error TS2307: Cannot find module 'mdx/types' or its corresponding type declarations.
```

There are ~28 TS7031 errors across these two files plus one TS2307 per file.
All are caused by the missing types package — when `MDXComponents` resolves,
each object-literal property (`h1: ({ children, ...props }) => ...`) is checked
against the element's component type, giving the destructured bindings a real
type instead of implicit any.

The MDX pipeline is configured in `vite.config.ts` with
`providerImportSource: "@mdx-js/react"`, which is the standard setup that
expects `mdx-components.tsx` typed against `mdx/types`.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Install   | `npm install`       | exit 0              |
| Typecheck | `npx tsc -b`        | exit 0, no errors   |
| Build     | `npm run build`     | exit 0, dist/ produced |
| Lint      | `npm run lint`      | (still has pre-existing errors from other files — NOT this plan's scope; see Plan 005) |

## Scope

**In scope** (the only files you should modify):
- `package.json` — add `@types/mdx` to `devDependencies`
- `package-lock.json` — updated by npm

**Out of scope** (do NOT touch):
- `src/mdx-components.tsx` and `src/mdx-work-components.tsx` — no code change
  needed; the type resolution fixes them. Do not "fix" the implicit-any
  errors by hand-annotating props; that is unnecessary once `@types/mdx` is
  installed and would add noise.
- Any other lint errors — those are Plan 005.

## Git workflow

- Branch: `advisor/001-fix-build-mdx-types`
- Commit style: the repo uses terse single-word messages (`git log --oneline`
  shows `push`, `update`, `refactor`). Match a slightly more descriptive
  convention here since it's a targeted fix: e.g. `fix: install @types/mdx so build passes`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Install @types/mdx

Add `@types/mdx` as a dev dependency. Use the latest version resolved by npm:

```bash
npm install -D @types/mdx
```

**Verify**: `package.json` now lists `"@types/mdx"` under `devDependencies`;
`node_modules/@types/mdx` exists. Check with:

```bash
node -e "console.log(require('./node_modules/@types/mdx/package.json').version)"
```

Expected: prints a version string (no error).

### Step 2: Confirm tsc passes

```bash
npx tsc -b
```

**Verify**: exit 0, no output (no TS7031 / TS2307 errors). If any TS7031
remain in `mdx-components.tsx` / `mdx-work-components.tsx`, STOP — the theory
that contextual typing eliminates them is wrong; report back.

### Step 3: Confirm full build passes

```bash
npm run build
```

**Verify**: exit 0; `dist/` produced. The command is `tsc -b && vite build`;
both stages must succeed.

## Test plan

No new tests. This plan is a dependency-types fix; the existing MDX rendering
(blog posts, job write-ups) is the behavioral surface. Manual sanity check
after the build (optional, if `npm run dev` is available):

- `/blog/<slug>` renders an MDX post (headings, inline code, code block).
- `jobs <slug>` modal renders a job write-up.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `node_modules/@types/mdx` exists and `package.json` lists it in devDependencies
- [ ] `npx tsc -b` exits 0 with no errors
- [ ] `npm run build` exits 0 and `dist/` is produced
- [ ] No source files modified (`git diff --stat -- src/` is empty)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `npm install -D @types/mdx` fails to resolve a published package.
- After installing, `npx tsc -b` still reports TS7031 implicit-any errors in
  `mdx-components.tsx` or `mdx-work-components.tsx` (the contextual-typing
  assumption is falsified — do not hand-annotate props without reporting).
- `npm run build` fails at the `vite build` stage with an error unrelated to
  types.

## Maintenance notes

- `@types/mdx` is the canonical types package for MDX + TypeScript projects
  using `@mdx-js/react` as the provider source. It must stay in devDependencies
  for the build to remain green.
- If MDX is ever upgraded (e.g. `@mdx-js/rollup` v4 → v5), re-confirm
  `mdx/types` still resolves from `@types/mdx`; newer MDX versions sometimes
  ship their own types and the external package becomes redundant.
- A reviewer should confirm the build was genuinely broken before this change
  (run `git stash` + `npm run build` on the parent commit to see exit 1) and
  green after.
