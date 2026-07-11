# Plan 002: Delete unused components and dead exports

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5fffbdf..HEAD -- src/components/kokonutui/toolbar.tsx src/components/MermaidDiagram.tsx src/components/ui/code-block.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-fix-broken-build-mdx-types.md (need a green build to verify)
- **Category**: tech-debt
- **Planned at**: commit `5fffbdf`, 2026-07-11

## Why this matters

~620 lines of code are never imported. They inflate the surface area, carry
lint errors, and — in `CodeCompare` — hide a latent bug (it splits on `""`
instead of `"\n"`, computing a meaningless char-level "diff"). Deleting dead
code shrinks the bundle, removes 8 of the 18 lint errors for free (the whole
`toolbar.tsx`), and makes the remaining `code-block.tsx` easier to reason
about. This is deletion work; behavior is unchanged because nothing references
these symbols.

## Current state

Three dead units, all confirmed with zero importers via ripgrep across `src/`:

**1. `src/components/kokonutui/toolbar.tsx`** — 237 lines. A Kokonut UI
registry component (`Toolbar`, default export). Not imported anywhere. It
also accounts for 8 of the repo's 18 lint errors:

```
89:16  error  '_activeColor' is assigned a value but never used
90:13  error  '_onSearch' is defined but never used
139:49 error  Unexpected any. Specify a different type
153:43 error  Unexpected any. Specify a different type
174:41 error  Unexpected any. Specify a different type
175:43 error  Unexpected any. Specify a different type
188:47 error  Unexpected any. Specify a different type
189:47 error  Unexpected any. Specify a different type
```

**2. `src/components/MermaidDiagram.tsx`** — 84 lines. Exports `MermaidDiagram`.
Not imported anywhere. The MDX pipeline renders mermaid via
`mdx-mermaid/lib/Mermaid` directly — see `src/mdx-components.tsx:2-3`:

```ts
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import type { MermaidProps } from "mdx-mermaid/lib/Mermaid";
```

…used at line 149-155 via the `mermaid:` key. `MermaidDiagram.tsx` is a
parallel, unused implementation.

**3. `src/components/ui/code-block.tsx`** — 986 lines total. Only `CodeBlock`
is imported externally (by `src/mdx-components.tsx:5` and
`src/mdx-work-components.tsx:4`). The following exports have zero external
importers (confirmed by searching the whole `src/` tree):

- `InlineCode` — defined at lines 719-750, exported at line 972
- `CodeCompare` — defined at lines 764-821, exported at line 970. Its diff
  logic at lines 779-780 is broken:
  ```ts
  const beforeLines = before.trim().split("");   // splits into CHARACTERS, not lines
  const afterLines = after.trim().split("");
  ```
  Should be `.split("\n")`. Moot once deleted.
- `CodeTabs` — defined at lines 838-898, exported at line 971
- `TerminalBlock` — defined at lines 913-964, exported at line 974

Also exported but unused externally: `supportedLanguages` (lines 77-117,
exported at line 973) and `themeMap` (line 975). **Keep `themeMap`** — it is
used internally at line 432 (`themeMap[theme]`). `supportedLanguages` is not
used internally either, but leave it in place to keep this plan's scope tight
(it is a harmless constant list); removing it is optional and not required by
the done criteria.

The corresponding type exports at lines 977-986 (`CodeCompareProps`,
`CodeTabsProps`, `InlineCodeProps`, `TerminalBlockProps`) must also go, along
with the `CodeBlockVariant`/`AnimationType`/`ThemeType` type exports — **keep
those three** (`CodeBlockVariant`, `AnimationType`, `ThemeType`); they
describe `CodeBlock` itself and are referenced by `CodeBlockProps`.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Build     | `npm run build`     | exit 0              |
| Lint      | `npm run lint`      | error count drops by 8 (toolbar gone); remaining errors handled by Plan 005 |
| Search    | `rg -n "<symbol>" src/` | no matches outside the file being deleted |

## Scope

**In scope** (the only files you should modify):
- DELETE `src/components/kokonutui/toolbar.tsx`
- DELETE `src/components/MermaidDiagram.tsx`
- EDIT `src/components/ui/code-block.tsx` — remove `InlineCode`, `CodeCompare`,
  `CodeTabs`, `TerminalBlock` (components + their `interface` blocks + their
  `displayName` lines) and remove them from the `export { ... }` and
  `export type { ... }` blocks at the bottom.

**Out of scope** (do NOT touch):
- `src/mdx-components.tsx`, `src/mdx-work-components.tsx` — they import only
  `CodeBlock` and `Highlighter`; no change needed.
- `themeMap`, `terminalTheme`, `supportedLanguages`, `CopyButton`,
  `DownloadButton`, `TypewriterCode`, `getFileExtension`,
  `getLanguageDisplayName` — all used by `CodeBlock` or its helpers; keep.
- The other kokonutui file `src/components/kokonutui/morphic-navbar.tsx` — it
  IS used (rendered by `Layout.tsx`); do not touch.

## Git workflow

- Branch: `advisor/002-delete-dead-code`
- Commit per logical unit (one for the two file deletions, one for the
  code-block edits) or a single commit — repo log style is terse; a single
  `chore: remove unused toolbar, MermaidDiagram, and code-block exports` is
  fine.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Confirm the symbols are still dead

Before deleting, re-confirm zero importers (the codebase may have drifted):

```bash
rg -n "kokonutui/toolbar|MermaidDiagram|CodeCompare|CodeTabs|TerminalBlock|InlineCode" src/
```

**Verify**: the only matches are inside the files themselves (definitions and
the export list in `code-block.tsx`). If any OTHER file imports one of them,
STOP — it is not dead; report back.

### Step 2: Delete the two unused files

```bash
rm src/components/kokonutui/toolbar.tsx src/components/MermaidDiagram.tsx
```

**Verify**: `ls src/components/kokonutui/toolbar.tsx src/components/MermaidDiagram.tsx` → "No such file or directory" for both.

### Step 3: Remove dead exports from code-block.tsx

In `src/components/ui/code-block.tsx`, delete:

- The `InlineCodeProps` interface (lines ~719-723) and the `InlineCode`
  component + `InlineCode.displayName` (lines ~725-750).
- The `CodeCompareProps` interface (lines ~753-762) and the `CodeCompare`
  component + `CodeCompare.displayName` (lines ~764-823).
- The `CodeTabsProps` interface (lines ~826-836) and the `CodeTabs` component
  + `CodeTabs.displayName` (lines ~838-900).
- The `TerminalBlockProps` interface (lines ~903-911) and the `TerminalBlock`
  component + `TerminalBlock.displayName` (lines ~913-966).

Then update the export blocks at the bottom (lines ~968-986) so they read:

```ts
export {
  CodeBlock,
  supportedLanguages,
  themeMap,
};
export type {
  AnimationType,
  CodeBlockProps,
  CodeBlockVariant,
  ThemeType,
};
```

(Keep `CodeBlockProps`, `CodeBlockVariant`, `AnimationType`, `ThemeType` —
`CodeBlockProps` references the variants/animation/theme types and is the
public type for the live `CodeBlock`.)

**Verify**: `rg -n "CodeCompare|CodeTabs|TerminalBlock|InlineCode" src/` → no matches anywhere.

### Step 4: Build and lint

```bash
npm run build
npm run lint
```

**Verify**: `npm run build` exits 0. `npm run lint` error count drops by 8
(the toolbar errors are gone) and the two `react-refresh` warnings on
`code-block.tsx` lines 973/975 disappear (those exports no longer exist).
Remaining lint errors (dot-pattern, ticker) belong to Plan 005 — do not fix
them here.

## Test plan

No new tests — this is deletion of unreferenced code. The behavioral guarantee
is that `CodeBlock` still renders in MDX. Manual sanity check (optional):

- Open a blog post that uses a ` ```tsx ` fence or a `<CodeBlock>` component
  (e.g. `src/mdx/blogs/ejemplo-codigo.mdx`) — code renders with syntax
  highlighting and the copy button.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `src/components/kokonutui/toolbar.tsx` does not exist
- [ ] `src/components/MermaidDiagram.tsx` does not exist
- [ ] `rg -n "CodeCompare|CodeTabs|TerminalBlock|InlineCode" src/` returns no matches
- [ ] `npm run build` exits 0
- [ ] `npm run lint` error count is ≤ 10 (was 18; 8 removed by deleting toolbar)
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Step 1 finds an importer outside the files being deleted — the symbol is
  live; do not delete it.
- After edits, `npm run build` fails with an error tracing to `code-block.tsx`
  (likely removed something `CodeBlock` still uses — e.g. a shared helper).
  Restore the helper and report.
- `CodeBlockProps` no longer type-checks after removing the type exports
  (means it referenced a removed type — keep that type instead of removing it).

## Maintenance notes

- `code-block.tsx` should now be ~680 lines (was 986). If a future change
  re-introduces a code-comparison or tabs feature, prefer a new, correct
  implementation over reviving the deleted `CodeCompare` (its diff was broken).
- The kokonutui toolbar can be re-added via `npx shadcn@latest add @kokonutui/toolbar`
  per `components.json` registries if it is ever actually needed.
- Reviewer: confirm `rg` showed no external importers before the delete landed.
