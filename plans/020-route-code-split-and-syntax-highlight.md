# Plan 020: Code-split routes and fix syntax highlighting

> **Executor instructions**: Follow step by step. Verify after each.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: 016 (unused deps cleaned — affects prism dependency)
- **Category**: perf / tech-debt
- **Planned at**: commit `9af401a`, 2026-07-12

## Why this matters

The main entry chunk (`index-BLlTPcCX.js`) is 1.26 MB and contains
`prism-react-renderer`, `prismjs`, the `motion` animation engine, and the
`mdx-mermaid` wrapper — all only needed on blog routes. Splitting routes
with `React.lazy()` moves ~350 KB out of the critical path.

Separately, the project has three overlapping syntax highlighting
approaches: `prism-react-renderer` (in `CodeBlock` component),
`rehype-highlight` (Vite MDX plugin, generates `hljs` classes), and an
unused `highlight-js` CSS file. MDX fenced code blocks render with NO
syntax coloring because `rehype-highlight` generates classes that no
CSS styles. Pick one highlighter and wire it fully.

## Current state

- `src/App.tsx:3-5` — `HomePage`, `BlogListPage`, `BlogPage` statically
  imported
- `src/pages/BlogPage.tsx:2` — imports `motion/react`
- `src/mdx-components.tsx:2` — imports `Mermaid` from `mdx-mermaid`
- `src/components/ui/code-block.tsx` — imports `prism-react-renderer`
- `vite.config.ts:13` — imports `rehypeHighlight` as global MDX rehype plugin
- `src/styles/highlight-js/github-dark.css` — orphaned CSS file, never imported

## Steps

### Step 1: Code-split routes with React.lazy()

In `src/App.tsx`, replace static imports with lazy imports + Suspense:

```typescript
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";

const HomePage = lazy(() => import("./pages/HomePage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
```

Wrap routes in a Suspense boundary:
```typescript
function App() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full">
      <Suspense fallback={null}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:id" element={<BlogPage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}
```

**Verify**: `npm run build` → exit 0. Check `dist/assets/` for separate
chunks — you should see `index-<hash>.js` (shell) plus per-route chunks.

### Step 2: Consolidate syntax highlighting

Choose `prism-react-renderer` as the single highlighter. Remove
`rehype-highlight` from the MDX pipeline:

In `vite.config.ts`, remove:
- Line 13: `import rehypeHighlight from "rehype-highlight";`
- Lines 52-54: the `rehypePlugins: [rehypeHighlight]` block

Delete the orphaned CSS:
```bash
rm src/styles/highlight-js/github-dark.css
```

Also remove `rehype-highlight` from `package.json` dependencies (list it
for removal — it may be in the unused group from plan 016).

**Verify**: 
- `grep 'rehype-highlight\|rehypeHighlight' vite.config.ts package.json src/` → no matches
- `npm run build` → exit 0
- `npm run lint` → exit 0

## Done criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `src/App.tsx` uses `lazy()` + `Suspense` for all three routes
- [ ] `vite.config.ts` has no `rehypeHighlight` import or plugin reference
- [ ] `src/styles/highlight-js/github-dark.css` no longer exists
- [ ] Build output has separate chunks (shell + per-route)
- [ ] `grep 'rehype-highlight' package.json` → no matches
