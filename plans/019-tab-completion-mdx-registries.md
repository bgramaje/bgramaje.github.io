# Plan 019: Fix tab completion aliases and deduplicate MDX registries

> **Executor instructions**: Follow step by step. Verify after each.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug / tech-debt
- **Planned at**: commit `9af401a`, 2026-07-12

## Why this matters

Tab completion in the terminal only matches canonical command names
(`help`, `jobs`, `projects`, etc.) but not their aliases (`work`,
`experience`, `papers`, `posts`, etc.). Users who type `wo<Tab>` expecting
`work` get no completion.

The two MDX component registries (`mdx-components.tsx` and
`mdx-work-components.tsx`) both register `Callout`, `Highlighter`,
`CodeBlock`, and `PublishedBlock` with near-identical wrappers. A
shared component registration prevents drift.

## Current state

- `src/pages/HomePage.tsx:146` — tab completion uses
  `Object.keys(availableCommands)` which only has 9 canonical names
- `src/data/portfolio.ts:199-210` — `commands` object lacks aliases
- `src/mdx-components.tsx` and `src/mdx-work-components.tsx` — both
  register Callout, Highlighter, CodeBlock, PublishedBlock independently
- `scripts/generate-sitemap.mjs:21` — hardcoded `en.mdx` (covered in
  plan 017; this plan's sitemap fix is about multiple locale entries)

## Steps

### Step 1: Add command aliases to portfolio.ts

In `src/data/portfolio.ts`, add alias entries to the `commands` object
(lines 199-210) so tab completion can find them:

```typescript
export const commands = {
  help: "Show available commands",
  jobs: "List jobs",
  work: "Alias for jobs",
  experience: "Alias for jobs",
  projects: "Show side projects",
  project: "Alias for projects",
  publications: "Show publications",
  papers: "Alias for publications",
  research: "Alias for publications",
  skills: "Show technical skills",
  contact: "Display contact information",
  social: "Alias for contact",
  studies: "Show academic studies",
  education: "Alias for studies",
  blog: "Navigate to blog",
  posts: "Alias for blog",
  articles: "Alias for blog",
  home: "Navigate to home page",
  clear: "Clear the terminal",
};
```

**Verify**: `grep 'work:' src/data/portfolio.ts` → `work: "Alias for jobs"`

### Step 2: Deduplicate MDX component registries

Create a shared MDX components module at `src/mdx-shared-components.tsx`:

```typescript
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/ui/callout";
import { Highlighter } from "@/components/ui/highlighter";
import { CodeBlock } from "@/components/ui/code-block";
import { PublishedBlock } from "@/components/mdx/PublishedBlock";

export function sharedMDXComponents(): MDXComponents {
  return {
    Callout,
    Highlighter,
    CodeBlock,
    PublishedBlock,
  };
}
```

Then in `src/mdx-components.tsx`, replace the inline registrations with:
```typescript
import { sharedMDXComponents } from "@/mdx-shared-components";

export function useMDXComponents(): MDXComponents {
  return {
    ...sharedMDXComponents(),
    // Blog-specific overrides go here
  };
}
```

And in `src/mdx-work-components.tsx`:
```typescript
import { sharedMDXComponents } from "@/mdx-shared-components";

export function useMDXWorkComponents(): MDXComponents {
  return {
    ...sharedMDXComponents(),
    // Work-specific components go here
  };
}
```

**Important**: Read both MDX files first to capture any existing unique
components (like `WorkHeader`, `WorkTitleBlock`, etc. in work-components)
and keep them in the override section.

**Verify**: `npm run build` → exit 0. `npm run lint` → exit 0.

## Done criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `grep 'work:' src/data/portfolio.ts` shows the alias entry
- [ ] `src/mdx-shared-components.tsx` exists and exports `sharedMDXComponents`
- [ ] Both `mdx-components.tsx` and `mdx-work-components.tsx` import from `@/mdx-shared-components`
- [ ] No duplicate component registrations between the two files
