# Plan 016: Clean dead code and unused dependencies

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `9af401a`, 2026-07-12

## Why this matters

Six npm dependencies are declared in `package.json` but never imported
anywhere in source code. Three component files are exported but never
imported. Eleven files carry `"use client"` directives that are meaningless
in a Vite SPA (they are a Next.js convention). One dead callback parameter
creates a misleading code path. Cleaning these up reduces install time,
lockfile size, audit surface, and cognitive load for future maintainers.

## Current state

- **Unused deps** in `package.json`: `react-markdown`, `gray-matter`,
  `rough-notation`, `rehype-raw`, `remark-mdx`, `svg-dotted-map`
- **Dead files** (exported, never imported):
  - `src/components/ui/logo-carousel.tsx` (383 lines, 10 inline SVGs)
  - `src/components/ui/dotted-map.tsx` (depends on `svg-dotted-map`)
- **Dead config files** (no longer needed after Tailwind v4 migration):
  - `tailwind.config.js`
  - `postcss.config.js`
- **`"use client"` directives** in 11 files (meaningless in Vite SPA):
  `src/components/theme-toggle.tsx`, `BitcoinTicker.tsx`,
  `ui/collapsible.tsx`, `ui/highlighter.tsx`,
  `terminal/CommandToolbar.tsx`, `ui/ticker.tsx`,
  `CvPdfDownloadButton.tsx`, `ui/drawer.tsx`,
  `kokonutui/morphic-navbar.tsx`, `theme-provider.tsx`,
  `ui/responsive-dialog.tsx`
- **Dead `onCommandClick`** in `ProcessCommandOptions`
  (`src/components/commands/commands.tsx:13`) — declared and passed
  from `HomePage.tsx:85` but never consumed by `processCommand`
- **Dead `case "clear"`** in `commands.tsx:80-81` — `HomePage.tsx:79`
  short-circuits `clear` before calling `processCommand`

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `npm install` | exit 0 |
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope:**
- `package.json` (remove dep lines)
- `src/components/ui/logo-carousel.tsx` (delete)
- `src/components/ui/dotted-map.tsx` (delete)
- `tailwind.config.js` (delete)
- `postcss.config.js` (delete)
- All 11 files with `"use client"` (remove line 1)
- `src/components/commands/commands.tsx` (remove `onCommandClick` from interface, remove `case "clear"`)
- `src/pages/HomePage.tsx` (remove the `onCommandClick` prop from the `processCommand` call)

**Out of scope:**
- `src/components/ui/drawer.tsx` — remove only the `"use client"` line, not the file
- Any component logic changes beyond removing directives
- The `tw-animate-css` dep — verify not redundant in a later plan

## Steps

### Step 1: Remove unused dependencies

Delete these lines from `package.json` (under `dependencies`):
- `"react-markdown": "^10.1.0",`
- `"gray-matter": "^4.0.3",`
- `"rough-notation": "^0.5.1",`
- `"rehype-raw": "^7.0.0",`
- `"remark-mdx": "^3.1.1",`
- `"svg-dotted-map": "^2.0.1",`

Then run: `npm install`

**Verify**: `grep -cE 'react-markdown|gray-matter|rough-notation|rehype-raw|remark-mdx|svg-dotted-map' node_modules/.package-lock.json` → returns 0 (or the dep names are no longer in the lockfile)

### Step 2: Delete dead files

```bash
rm src/components/ui/logo-carousel.tsx
rm src/components/ui/dotted-map.tsx
rm tailwind.config.js
rm postcss.config.js
```

**Verify**: `ls src/components/ui/logo-carousel.tsx src/components/ui/dotted-map.tsx tailwind.config.js postcss.config.js 2>&1` → all should error "No such file"

### Step 3: Remove `"use client"` directives from 11 files

Remove the first line (`"use client";` or `"use client"` — note some files omit the semicolon) from each file listed in Current state. Use bulk sed:

```bash
# Files with semicolon
for f in \
  src/components/theme-toggle.tsx \
  src/components/BitcoinTicker.tsx \
  src/components/ui/collapsible.tsx \
  src/components/ui/highlighter.tsx \
  src/components/terminal/CommandToolbar.tsx \
  src/components/CvPdfDownloadButton.tsx \
  src/components/kokonutui/morphic-navbar.tsx \
  src/components/theme-provider.tsx \
  src/components/ui/responsive-dialog.tsx; do
  sed -i '' '1{/^"use client";$/d}' "$f"
done

# Files without semicolon
for f in \
  src/components/ui/ticker.tsx \
  src/components/ui/drawer.tsx; do
  sed -i '' '1{/^"use client"$/d}' "$f"
done
```

**Verify**: `grep -rn '"use client"' src/` → returns no matches

### Step 4: Remove dead `onCommandClick` callback

In `src/components/commands/commands.tsx`, remove `onCommandClick` from the `ProcessCommandOptions` interface (line 13). Delete the line:
```
  onCommandClick?: (command: string) => void;
```

In `src/pages/HomePage.tsx`, remove `onCommandClick: handleCommand,` from the `processCommand` call (line 85).

**Verify**: `grep -rn 'onCommandClick' src/` → returns no matches

### Step 5: Remove dead `case "clear"` from commands.tsx

In `src/components/commands/commands.tsx`, remove lines 80-81:
```
    case "clear":
      return null;
```

**Verify**: `npm run lint` → 0 errors

## Test plan

No new tests — this is pure deletion. The build and lint are the verification gates. If any deletion was incorrect (removing a dep that's actually used), `tsc -b` or Vite bundling will error.

## Done criteria

- [ ] `npm install` exits 0 (lockfile regenerated without removed deps)
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0, same 10 warnings as before (react-refresh/only-export-components)
- [ ] `grep -rn 'react-markdown\|gray-matter\|rough-notation\|rehype-raw\|remark-mdx\|svg-dotted-map' package.json` → no matches
- [ ] `ls src/components/ui/logo-carousel.tsx src/components/ui/dotted-map.tsx tailwind.config.js postcss.config.js 2>&1 | grep -c "No such file"` → 4
- [ ] `grep -rn '"use client"' src/` → no matches
- [ ] `grep -rn 'onCommandClick' src/` → no matches
- [ ] `grep -rn 'case "clear"' src/components/commands/commands.tsx` → no matches

## STOP conditions

Stop and report if:
- A dep you attempt to remove is actually imported somewhere (grep it first to confirm)
- Build or lint fails with an error that isn't trivially fixable
- The sed pattern for `"use client"` doesn't match a file (the file may have different first line content — read and handle manually)
