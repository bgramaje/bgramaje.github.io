# Plan 011: Set per-post document head (title + meta description + OG) from MDX frontmatter

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat dc0b0ad..HEAD -- src/components/BlogPost.tsx src/pages/BlogPage.tsx index.html src/lib/blogLoader.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: seo | dx
- **Planned at**: commit `dc0b0ad`, 2026-07-11

## Why this matters

Every blog post currently renders with the static `<title>bgramaje | Borja</title>`
and a single global `<meta name="description">` from `index.html`. The MDX
frontmatter (`title`, `description`, `date`, `tags`) is already loaded by
`BlogPost` into its `meta` state but never reaches `document.head`. Result:
search engines and link previews see the site title for every post, so posts
are not indexable under their own titles and have no per-post description or
Open Graph card. This is the highest-leverage blog finding — the content exists
and is structured, it just isn't published to the head.

## Current state

- `index.html:7-8` — the only `<title>` and `<meta name="description">` on the
  site (static, global):
  ```html
  <meta name="description" content="Borja Gramaje - Software Engineer Portfolio" />
  <title>bgramaje | Borja</title>
  ```
- `src/components/BlogPost.tsx:64` — `const [meta, setMeta] = useState<BlogMetadata | null>(null);`
  populated from `module.frontmatter` at line 78 inside the load effect
  (`useEffect` keyed on `[id, effectiveLocale]`, lines 69-91). `BlogMetadata` is
  `{ title, description, date, tags? }` (see `src/lib/blogLoader.ts:3-8`).
- `src/pages/BlogPage.tsx` — the route component; renders `<BlogPost id={id} />`
  inside a `motion.article` (line 50). It does not touch the head.
- No head-management library is installed (no `react-helmet`, no `next/head`).
  The grep `document.title|Helmet|meta name="description"` over `src/**` returns
  zero matches in app code.
- Repo conventions: React 18 (use `useEffect`; do not assume React 19 `use`).
  Use `@/` alias for `src/` imports. No new deps for one-liners. Strict TS
  (`noUnusedLocals`/`noUnusedParameters`). An exemplar of a small standalone
  hook in this repo is `src/lib/useFocusTrap.ts` (one default-ish export, no
  framework, side-effectful, restores prior state on cleanup) — mirror its
  shape.

## Commands you will need

| Purpose   | Command          | Expected on success |
|-----------|------------------|---------------------|
| Typecheck + build | `npm run build` | exit 0, `tsc -b` then `vite build` succeed |
| Lint      | `npm run lint`   | exit 0, 0 errors (warnings OK) |

## Scope

**In scope** (the only files you should modify):
- `src/lib/useDocumentHead.ts` (create)
- `src/components/BlogPost.tsx` (call the hook)
- `src/pages/BlogListPage.tsx` (set a list-page title only — one line)

**Out of scope** (do NOT touch):
- `index.html` — leave the static fallback title/description intact; the hook
  restores to it on unmount.
- `src/lib/blogLoader.ts` — loader behavior is unchanged here (Plan 012 owns
  the loader).
- `src/mdx/blogs/**` content — no frontmatter edits.
- OG image / `og:image` — out of scope; no per-post image asset exists. Add
  `og:image` only if a post image already exists (it doesn't).

## Git workflow

- Branch: `advisor/011-blog-post-head-seo`
- Commit per logical unit; message style matches repo's loose conventional
  commits, e.g. `feat(blog): set per-post document title and meta description`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create `src/lib/useDocumentHead.ts`

Create a tiny hook that imperatively updates `document.title` and the
`<meta name="description">` / `<meta property="og:title">` /
`<meta property="og:description">` tags, and restores the prior values on
cleanup. Target shape:

```ts
import { useEffect } from "react";

interface DocumentHead {
  title?: string;
  description?: string;
}

function upsertMeta(selector: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, attr, name] = selector.match(/\[(.+?)="(.+?)"\]/) ?? [];
    if (!attr || !name) return el;
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
}

export function useDocumentHead({ title, description }: DocumentHead) {
  useEffect(() => {
    const prevTitle = document.title;
    const descEl = document.head.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    const prevDesc = descEl?.getAttribute("content") ?? null;

    if (title) document.title = title;
    if (description) {
      upsertMeta('meta[name="description"]', description);
    }

    return () => {
      document.title = prevTitle;
      if (descEl) {
        if (prevDesc == null) descEl.remove();
        else descEl.setAttribute("content", prevDesc);
      }
    };
  }, [title, description]);
}
```

Keep it to title + description only (ponytail: no OG image asset exists, so
`og:image` would be a dead tag). If you also add `og:title`/`og:description`,
reuse `upsertMeta` and restore them the same way — optional, only if it stays
under ~15 extra lines.

**Verify**: `npx tsc -b --noEmit` (or `npm run build`) → exit 0, no errors about
`useDocumentHead.ts`.

### Step 2: Call the hook from `BlogPost`

In `src/components/BlogPost.tsx`, call `useDocumentHead` with the loaded
frontmatter. Place the call after `meta` is declared (around line 67, near the
other hooks) so it runs on every render with the current `meta`:

```ts
import { useDocumentHead } from "@/lib/useDocumentHead";
// ...
useDocumentHead({
  title: meta ? `${meta.title} | bgramaje` : "bgramaje | Borja",
  description: meta?.description,
});
```

While `meta` is null (loading), the head stays at the site default; once
frontmatter resolves, the title/description update. On unmount or locale
switch, the hook restores the prior title and description.

**Verify**: `npm run build` → exit 0. Then `npm run dev`, open
`/blog/parcar-iot`, and confirm the browser tab reads
`PARCAR-IoT: LoRaWAN node for public parking with remote management | bgramaje`
(or the post's frontmatter `title`). Navigate back to `/` and confirm the tab
returns to `bgramaje | Borja`.

### Step 3: Set the blog-list page title

In `src/pages/BlogListPage.tsx`, inside the component body (e.g. right after
the `useMemo` for `sortedPosts`, around line 41), add:

```ts
import { useDocumentHead } from "@/lib/useDocumentHead";
// ...
useDocumentHead({ title: "Blog | bgramaje", description: "Blog posts by Borja Gramaje" });
```

**Verify**: `npm run build` → exit 0. In `npm run dev`, open `/blog` and confirm
the tab reads `Blog | bgramaje`.

## Test plan

No test framework exists in this repo (deferred per `plans/README.md` rejected
findings). Verification is manual + build/lint gates. Add a single runnable
self-check only if it stays trivial; otherwise rely on the manual smoke check
above. Do not introduce a test framework in this plan.

## Done criteria

ALL must hold:

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0 (warnings OK)
- [ ] `grep -rn "useDocumentHead" src/` returns matches in `BlogPost.tsx`,
      `BlogListPage.tsx`, and `src/lib/useDocumentHead.ts` only
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] Manual: `/blog/<id>` sets the tab title to `<post title> | bgramaje`;
      navigating away restores `bgramaje | Borja`
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `BlogPost.tsx` no longer has a `meta` state populated from
  `module.frontmatter` (the hook depends on it; if the loader/frontmatter shape
  changed, STOP).
- `index.html` no longer has a `<title>` element (the restore-on-unmount logic
  assumes a prior title exists).
- The `upsertMeta` regex in step 1 does not match Vite's DOM for the selector
  format used (test in a real browser; if `document.head.querySelector` behaves
  differently, STOP rather than hand-rolling a parser).
- `npm run build` fails twice after a reasonable fix attempt.

## Maintenance notes

- **Future posts**: any new `src/mdx/blogs/**.mdx` with `title`/`description`
  frontmatter is picked up automatically — no per-post wiring.
- **OG image**: if a post image asset is added later, extend `useDocumentHead`
  to upsert `og:image` and `twitter:image` at that point; do not add empty tags
  now.
- **Home / other routes**: this plan only covers blog routes. If the maintainer
  wants the home terminal and `/blog` list to have distinct descriptions, call
  `useDocumentHead` from those page components too (one line each).
- **Reviewer focus**: confirm the cleanup branch restores (not just sets) the
  prior title/description, or SPA navigation will leave a post title stuck on
  the home page.
