# Plan 012: Read blog-list metadata from raw MDX (stop loading full post bodies for the list)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat dc0b0ad..HEAD -- src/lib/blogLoader.ts`
> If `blogLoader.ts` changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW-MED
- **Depends on**: none (independent of 011; 011 touches `BlogPost.tsx`, this
  touches `blogLoader.ts`)
- **Category**: perf | tech-debt
- **Planned at**: commit `dc0b0ad`, 2026-07-11

## Why this matters

`getAllBlogPosts()` (used by `/blog` list and the terminal) calls
`loadBlogContent(id, defaultLocale)` for **every** post, which awaits the
dynamic import of the full compiled MDX module — body included — just to read
`module.frontmatter` (title/description/date/tags). With
`import.meta.glob({ eager: false })`, each post body is a separate lazy chunk,
so rendering the list requires downloading and executing every post's body
before a single title can show. Today (2 posts) the cost is negligible; as the
blog grows this is a waterfall that delays list paint and wastes bandwidth for
users who never open a post. The fix: read frontmatter from the **raw** MDX
source via a second `import.meta.glob('?raw')` and parse it without importing
the compiled body. The post page (`loadBlogContent`) keeps its lazy body load
unchanged.

## Current state

- `src/lib/blogLoader.ts:15` — the body glob, lazy:
  ```ts
  const blogModules = import.meta.glob<BlogMDXModule>("../mdx/blogs/**/*.mdx", { eager: false });
  ```
- `src/lib/blogLoader.ts:27-37` — `parseBlogPath(path)` returns
  `{ postId, locale: string | null }` for both `blogs/<id>/<locale>.mdx`
  (nested) and `blogs/<id>.mdx` (root). Reuse this for the raw glob too.
- `src/lib/blogLoader.ts:63-66` — `pickDefaultLocale(["en","es"])` prefers
  `"en"`, else sorts and takes first.
- `src/lib/blogLoader.ts:141-158` — the function being changed:
  ```ts
  let allPostsCache: Promise<Array<BlogMetadata & { id: string }>> | null = null;
  export function getAllBlogPosts(): Promise<Array<BlogMetadata & { id: string }>> {
    if (allPostsCache) return allPostsCache;
    const blogIds = getAllBlogIds();
    allPostsCache = Promise.all(
      blogIds.map(async (id) => {
        try {
          const defaultLocale = getDefaultBlogLocale(id);
          const module = await loadBlogContent(id, defaultLocale);
          const frontmatter = module.frontmatter ?? defaultMetadata;
          return { ...frontmatter, id };
        } catch {
          return { ...defaultMetadata, id, title: "Error loading post", description: "Failed to load metadata" };
        }
      })
    );
    return allPostsCache;
  }
  ```
- `BlogMetadata` shape (`blogLoader.ts:3-8`): `{ title, description, date, tags?: string[] }`.
- `defaultMetadata` (`blogLoader.ts:131-136`) provides fallbacks.
- Frontmatter in the wild uses only this shape, e.g.
  `src/mdx/blogs/umami-metricas-lectura/en.mdx:1-10`:
  ```yaml
  ---
  title: "How I track what gets read (and what doesn't) with Umami"
  description: "My workflow for measuring which content works..."
  date: "2026-04-14"
  tags:
    - Analytics
    - Umami
    - Content
    - Blog
  ---
  ```
- Callers of `getAllBlogPosts`: `src/pages/BlogListPage.tsx:32` and
  `src/components/commands/commands-output/BlogListOutput.tsx:11` (note:
  `BlogListOutput` is dead code — Plan 013 deletes it; this plan does not
  depend on that).
- `gray-matter` is listed in `package.json` deps but is **not imported
  anywhere in `src/`** (only in lockfiles). It is available but bundling it
  into the client pulls `js-yaml`/`argparse`. The primary approach below uses a
  ~25-line parser with zero bundle cost; `gray-matter` is the documented
  fallback.
- Repo conventions: React 18, `@/` alias, strict TS, no new deps for
  one-liners. The loader caches promises in a `Map` — preserve that pattern.

## Commands you will need

| Purpose   | Command          | Expected on success |
|-----------|------------------|---------------------|
| Typecheck + build | `npm run build` | exit 0 |
| Lint      | `npm run lint`   | exit 0, 0 errors |

## Suggested executor toolkit

- Vite glob raw import docs: `https://vite.dev/guide/features.html#glob-import`
  — the `{ query: '?raw', import: 'default', eager: true }` form returns the
  file's source as a string at build time, inlined (no separate chunk, no
  runtime fetch).

## Scope

**In scope** (the only files you should modify):
- `src/lib/blogLoader.ts`

**Out of scope** (do NOT touch):
- `src/components/BlogPost.tsx` — keeps using `loadBlogContent` for the body.
- `src/pages/BlogListPage.tsx`, `BlogListOutput.tsx` — callers; their
  `getAllBlogPosts()` call signature and return shape must NOT change.
- `src/mdx/blogs/**` content.
- `package.json` — do not add `gray-matter` (already present) or any parser dep.

## Git workflow

- Branch: `advisor/012-blog-metadata-raw-glob`
- Commit message style: `perf(blog): read list metadata from raw mdx, not compiled bodies`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add a raw, eager glob and a frontmatter parser

At the top of `src/lib/blogLoader.ts`, alongside the existing `blogModules`
glob, add an eager raw glob and a minimal frontmatter parser. The parser
handles exactly the two shapes present in the repo: flat `key: "value"` (or
unquoted) scalars, and a `tags:` block list with `  - item` entries. Keep it
~25 lines; do not generalize into a YAML parser.

```ts
const blogRaw = import.meta.glob("../mdx/blogs/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string): Partial<BlogMetadata> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const lines = match[1].split(/\r?\n/);
  const out: Record<string, string | string[]> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) { i++; continue; }
    const [, key, val] = m;
    if (val === "") {
      // block list: collect following "  - item" lines
      const items: string[] = [];
      while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) {
        items.push(lines[i + 1].replace(/^\s+-\s+/, "").replace(/^"(.*)"$/, "$1"));
        i++;
      }
      out[key] = items;
    } else {
      out[key] = val.replace(/^"(.*)"$/, "$1");
    }
    i++;
  }
  return out as Partial<BlogMetadata>;
}
```

**Verify**: `npm run build` → exit 0 (the raw glob compiles). No type errors.

### Step 2: Build a metadata map grouped by post id + locale

Add a module-level map populated once from `blogRaw`, mirroring the
`loadersByPost` structure but storing parsed metadata instead of loader
functions:

```ts
const metadataByPost = new Map<string, Map<string | typeof ROOT_KEY, BlogMetadata>>();

for (const path of Object.keys(blogRaw)) {
  const parsed = parseBlogPath(path);
  if (!parsed) continue;
  const fm = parseFrontmatter(blogRaw[path]);
  const meta: BlogMetadata = {
    title: fm.title ?? defaultMetadata.title,
    description: fm.description ?? defaultMetadata.description,
    date: fm.date ?? defaultMetadata.date,
    tags: fm.tags ?? defaultMetadata.tags,
  };
  if (!metadataByPost.has(parsed.postId)) {
    metadataByPost.set(parsed.postId, new Map());
  }
  const key = parsed.locale ?? ROOT_KEY;
  metadataByPost.get(parsed.postId)!.set(key, meta);
}
```

Place this after `defaultMetadata` is defined (so `defaultMetadata` is in
scope) — i.e. move `defaultMetadata` above this block if needed, or inline the
fallbacks. Keep `loadersByPost` and `assertValidPostShape` exactly as-is.

**Verify**: `npm run build` → exit 0.

### Step 3: Rewrite `getAllBlogPosts` to read from the metadata map

Replace the body of `getAllBlogPosts` so it no longer awaits `loadBlogContent`.
It becomes synchronous work wrapped in the same cached-Promise shape (callers
expect a `Promise`):

```ts
let allPostsCache: Promise<Array<BlogMetadata & { id: string }>> | null = null;

export function getAllBlogPosts(): Promise<Array<BlogMetadata & { id: string }>> {
  if (allPostsCache) return allPostsCache;
  allPostsCache = Promise.resolve(
    getAllBlogIds().map((id) => {
      const map = metadataByPost.get(id);
      const defaultLocale = getDefaultBlogLocale(id);
      const key = defaultLocale ?? ROOT_KEY;
      const meta = map?.get(key) ?? map?.values().next().value ?? defaultMetadata;
      return { ...meta, id };
    })
  );
  return allPostsCache;
}
```

`getAllBlogIds()` still reads from `loadersByPost` (unchanged), so post ids and
locale structure stay consistent between the list and the loader.

**Verify**: `npm run build` → exit 0. `npm run dev`, open `/blog`, confirm the
list renders with correct titles/dates/tags for both `parcar-iot` and
`umami-metricas-lectura` (showing the `en` default-locale title for the latter,
matching prior behavior). Confirm the list appears without waiting on post
bodies (open DevTools Network → only `*.js` route chunks, no per-post MDX body
chunk fetched on the list page).

### Step 4: Confirm the post page still lazy-loads its body

`loadBlogContent` is unchanged. Open `/blog/parcar-iot` and confirm the post
body renders and its dedicated chunk loads on demand (Network tab shows the
`parcar-iot-*.js` chunk fetched only when navigating to the post).

**Verify**: `npm run build` → exit 0. Manual check above.

## Test plan

No test framework in this repo. Add one trivial self-check only if it stays
under ~10 lines and needs no framework (e.g. a `parseFrontmatter` assertion
module left as a `.test.ts`? — no, there is no runner). Rely on manual
verification + build/lint. Do not introduce a test framework.

If you want a runnable check: temporarily `console.assert` in a dev-only spot
that `parseFrontmatter(blogRaw["../mdx/blogs/parcar-iot.mdx"]).title` starts
with `"PARCAR-IoT"`, run `npm run dev`, confirm no assertion failure in the
console, then remove the assert. (Optional; not required for done criteria.)

## Done criteria

ALL must hold:

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0 (warnings OK)
- [ ] `grep -n "loadBlogContent" src/lib/blogLoader.ts` shows `loadBlogContent`
      is still defined and still used only by `BlogPost.tsx` (not by
      `getAllBlogPosts`)
- [ ] `getAllBlogPosts` contains no `await` and no call to `loadBlogContent`
      (`grep -n "loadBlogContent\|await" src/lib/blogLoader.ts` — the
      `loadBlogContent` definition's own `await` is fine; `getAllBlogPosts`
      must have neither)
- [ ] No files outside `src/lib/blogLoader.ts` are modified (`git status`)
- [ ] Manual: `/blog` list shows the same titles/dates/tags as before this plan
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Any `src/mdx/blogs/**.mdx` frontmatter uses a shape the parser doesn't handle
  (e.g. nested objects, multi-line quoted strings, `tags` as an inline
  `[a, b]` list). If `parseFrontmatter` returns `defaultMetadata` for a real
  post (title becomes `"Untitled"`), STOP and report which file — do not
  extend the parser into a general YAML parser; switch to the `gray-matter`
  fallback (below) and report.
- The `import.meta.glob('?raw')` form fails to compile in this Vite version
  (build error referencing the glob) — STOP and report; the fallback is to
  keep `eager: false` bodies but extract frontmatter at build via a remark
  plugin, which is out of scope here.
- `loadBlogContent` or `loadersByPost` have been renamed/restructured since
  `dc0b0ad` (drift check fails).

**Documented fallback (do not switch preemptively)**: if the manual parser
cannot handle the frontmatter, replace `parseFrontmatter` with
`import matter from "gray-matter"; ... matter(raw).data` — `gray-matter` is
already in `package.json`. Accept the `js-yaml` bundle cost. Report the switch
in the commit message and the status row.

## Maintenance notes

- **New posts**: any new `src/mdx/blogs/**.mdx` is picked up by both globs
  automatically — no registry edit.
- **Frontmatter schema changes**: if a post adds a field the list needs (e.g.
  `cover`), extend `BlogMetadata` and `parseFrontmatter` together. The parser
  is intentionally narrow; do not let it grow into a YAML implementation —
  switch to `gray-matter` at that point.
- **`gray-matter` dep**: this plan keeps it unused. If the maintainer prefers
  correctness over bundle size, swap the parser for `gray-matter` and remove
  the manual parser; then `gray-matter` finally earns its place in
  `package.json` (or Plan 003-style cleanup could drop it if the manual parser
  stays).
- **Reviewer focus**: confirm the list still shows the **default-locale**
  metadata for multi-locale posts (the `en` title for `umami-metricas-lectura`),
  matching pre-plan behavior — the `key = defaultLocale ?? ROOT_KEY` line is
  the load-bearing part.
