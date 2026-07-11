# Plan 005: Clear the lint baseline to zero errors

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5fffbdf..HEAD -- src/components/ui/dot-pattern.tsx src/components/ui/ticker.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S-M
- **Risk**: LOW
- **Depends on**: plans/002-delete-dead-code.md (deleting `toolbar.tsx` removes
  8 of 18 errors) and plans/004-migrate-to-motion-package.md (so `dot-pattern.tsx`
  imports from `motion/react` and the only remaining change here is the unused-var fix)
- **Category**: dx
- **Planned at**: commit `5fffbdf`, 2026-07-11

## Why this matters

`npm run lint` currently exits with 18 errors (after Plan 002 removes
`toolbar.tsx`, 10 remain). AGENTS.md lists `npm run lint` as a verification
gate ("no errors"), so a red lint baseline blocks the "done" claim for every
future change. The remaining errors are all in two vendored UI primitives
(`dot-pattern.tsx`, `ticker.tsx`) and fall into two trivial classes: unused
destructured props and unnecessary `as any` casts. Fixing them makes the gate
green without changing behavior.

## Current state

After Plans 002 and 004 land, `npm run lint` reports these errors (line
numbers from the audited commit; confirm live before editing):

**`src/components/ui/dot-pattern.tsx`** — 2 unused-var errors:

```
65:3  error  'x' is assigned a value but never used  @typescript-eslint/no-unused-vars
66:3  error  'y' is assigned a value but never used  @typescript-eslint/no-unused-vars
```

The destructure (lines 62-73):

```tsx
export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
```

`x` and `y` are part of the `DotPatternProps` interface (lines 22-23) but are
never read in the body — dot positions use `cx`/`cy`/`col*width`/`row*height`.
They are public API, so the interface keeps them; the fix is to stop
destructuring them so they pass through `...props` to the `<svg>` (which
accepts `x`/`y` attributes) instead of being captured and ignored.

**`src/components/ui/ticker.tsx`** — 5 `no-explicit-any` errors:

```
62:25   error  Unexpected any. Specify a different type   @typescript-eslint/no-explicit-any
83:44   error  Unexpected any. Specify a different type   @typescript-eslint/no-explicit-any
97:64   error  Unexpected any. Specify a different type   @typescript-eslint/no-explicit-any
113:87  error  Unexpected any. Specify a different type   @typescript-eslint/no-explicit-any
146:23  error  Unexpected any. Specify a different type   @typescript-eslint/no-explicit-any
```

All five are the same pattern — a rest-props spread with a redundant cast:

```tsx
{...(props as any)}
```

at lines 62 (`Ticker`), 83 (`TickerIcon`), 97 (`TickerSymbol`), 113
(`TickerPrice`), 146 (`TickerPriceChange`). In each case `props` is already
typed via the component's props type (`HTMLAttributes<HTMLButtonElement>`,
`HTMLAttributes<HTMLImageElement>`, `HTMLAttributes<HTMLSpanElement>`) with
the component-specific fields destructured out, so the cast is unnecessary.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Lint      | `npm run lint`      | exit 0, 0 errors (warnings allowed) |
| Build     | `npm run build`     | exit 0 |

`npm run lint` runs `eslint .`. ESLint exits non-zero on errors but exits 0 on
warnings, so the target is **0 errors** (the existing `react-refresh` warnings
in `badge.tsx`, `button.tsx`, `rainbow-button.tsx`, `scroll-progress.tsx`,
`ticker.tsx` are allowed and out of scope).

## Scope

**In scope** (the only files you should modify):
- `src/components/ui/dot-pattern.tsx` — remove `x` and `y` from the destructure
- `src/components/ui/ticker.tsx` — remove the five `as any` casts

**Out of scope** (do NOT touch):
- The `react-refresh/only-export-components` **warnings** — they are not
  errors and do not fail the gate. Leave them.
- `eslint.config.js` — do not loosen rules to suppress errors.
- The `DotPatternProps` interface — keep `x?: number` and `y?: number` as
  public API.
- Any other file. If `npm run lint` reports errors in files not listed here
  after Plans 002/004 land, STOP and report (the baseline shifted).

## Git workflow

- Branch: `advisor/005-clear-lint-baseline`
- Commit: `fix: clear lint baseline (unused vars, redundant any casts)`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Re-baseline the lint errors

```bash
npm run lint
```

Record the exact errors and files. Confirm the only error sites are
`dot-pattern.tsx` (x, y) and `ticker.tsx` (5× `as any`). If Plan 002 or 004
has not landed yet, `toolbar.tsx` errors will still appear — this plan assumes
those two plans are DONE. If they are not done, STOP and run them first.

### Step 2: Fix dot-pattern.tsx unused x/y

Remove `x = 0,` and `y = 0,` from the destructure in `DotPattern` so they are
no longer captured locals (they remain on the interface and flow through
`...props` to the `<svg>`):

```tsx
export function DotPattern({
  width = 16,
  height = 16,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
```

**Verify**: `npm run lint -- src/components/ui/dot-pattern.tsx` reports 0
errors for this file.

### Step 3: Remove the as-any casts in ticker.tsx

In `src/components/ui/ticker.tsx`, replace each `{...(props as any)}` with
`{...props}` at lines 62, 83, 97, 113, 146. For example, the `Ticker`
component (lines 54-67) becomes:

```tsx
return (
  <TickerContext.Provider value={{ formatter }}>
    <button
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap align-middle",
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  </TickerContext.Provider>
)
```

Apply the same `{...(props as any)}` → `{...props}` change to `TickerIcon`
(line 83), `TickerSymbol` (line 97), `TickerPrice` (line 113), and
`TickerPriceChange` (line 146).

**Verify**: `npm run lint -- src/components/ui/ticker.tsx` reports 0 errors
for this file (warnings about `react-refresh/only-export-components` may
remain — that is fine).

### Step 4: Full lint and build

```bash
npm run lint
npm run build
```

**Verify**: `npm run lint` → "0 errors" (warnings may remain; the command
exits 0). `npm run build` → exit 0.

## Test plan

No new tests. Behavioral surface: `DotPattern` background rendering and the
`Ticker`/`BitcoinTicker` display. Manual sanity check (optional):

- `DotPattern` is used as a decorative background somewhere in the app
  (terminal surface) — confirm it still renders dots. If no visible consumer,
  skip.
- The navbar `BitcoinTicker` still renders the BTC price (it uses `Ticker`).
  `TickerIcon`/`TickerSymbol`/`TickerPrice`/`TickerPriceChange` are unused
  exports but keep compiling — confirm the build (Step 4) already covers this.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `npm run lint` exits 0 with **0 errors** (warnings permitted)
- [ ] `npm run build` exits 0
- [ ] `rg -n "as any" src/components/ui/ticker.tsx` returns no matches
- [ ] `dot-pattern.tsx` no longer destructures `x` or `y` (they remain on the interface)
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- After removing `as any` from a ticker component, `npm run build` reports a
  TypeScript error because the remaining `...props` type is not assignable to
  the target element (e.g. an extra prop that is not a valid DOM attribute).
  In that case cast to the specific `HTMLAttributes<...>` type instead of
  `any` — but report which component and the exact TS error first.
- `npm run lint` reports errors in files other than `dot-pattern.tsx` and
  `ticker.tsx` after Plans 002/004 are done — the baseline shifted; report
  rather than expanding scope.
- Removing `x`/`y` from the destructure changes `DotPattern` rendering in a
  visible way (would mean a caller was relying on the captured default of 0
  rather than passing `x`/`y` through `...props`) — report.

## Maintenance notes

- The `react-refresh/only-export-components` warnings are intentionally left;
  they are a dev fast-refresh optimization hint, not correctness, and the
  affected files are vendored registry components that mix context/constants
  with components by design.
- If `npm run lint` is later configured with `--max-warnings 0`, the warnings
  become failures — at that point split the context exports
  (`scroll-progress.tsx`, `ticker.tsx`) and constant exports
  (`badge.tsx`, `button.tsx`, `rainbow-button.tsx`) into separate files. That
  is a separate plan, not this one.
- Reviewer: confirm the lint gate is genuinely green (`eslint .` exit 0), not
  just "fewer errors".
