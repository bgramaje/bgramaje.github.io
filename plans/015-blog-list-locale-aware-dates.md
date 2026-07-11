# Plan 015: Make blog-list date formatting locale-aware (match each post's default locale)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat dc0b0ad..HEAD -- src/pages/BlogListPage.tsx src/lib/blogLoader.ts`
> If either file changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: NONE
- **Depends on**: none
- **Category**: bug | ux
- **Planned at**: commit `dc0b0ad`, 2026-07-11

## Why this matters

`BlogListPage.formatListDate` hardcodes the `es-ES` locale for every post's
date. Posts can now be English (`src/mdx/blogs/umami-metricas-lectura/en.mdx`)
and the loader's `pickDefaultLocale` prefers `en` as the default for
multi-locale posts — so the list shows an English title with a
Spanish-formatted date ("14 abr 2026"). The date format should follow each
post's default locale so the list is internally consistent. This is a small
i18n consistency fix that becomes visible now that the blog is bilingual.

## Current state

- `src/pages/BlogListPage.tsx:10-25` — the hardcoded formatter:
  ```ts
  function parsePostDate(value: string): number {
    const t = Date.parse(value);
    return Number.isNaN(t) ? 0 : t;
  }

  function formatListDate(value: string): string {
    const t = Date.parse(value);
    if (Number.isNaN(t)) return value;
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(new Date(t))
      .replace(/\./g, "");
  }
  ```
- `src/pages/BlogListPage.tsx:37-41` — `sortedPosts` is built from `posts`
  (type `BlogListItem = BlogMetadata & { id: string }`); `BlogMetadata` is
  `{ title, description, date, tags? }` — it does **not** carry locale info
  today.
- `src/pages/BlogListPage.tsx:94` and `:104` — the two call sites of
  `formatListDate(post.date)`.
- `src/lib/blogLoader.ts:77-87` — `getBlogLocales(postId)` returns `string[]`
  (empty for single-file posts); `getDefaultBlogLocale(postId)` returns the
  preferred locale string (`"en"` if present) or `undefined`.
- `src/pages/BlogListPage.tsx:31-35` — the load effect:
  ```ts
  useEffect(() => {
    getAllBlogPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);
  ```
- Repo conventions: `@/` alias, strict TS, terminal tokens, no new deps.
  `BlogListPage` already imports from `@/lib/blogLoader` (line 4-5).

## Commands you will need

| Purpose   | Command          | Expected on success |
|-----------|------------------|---------------------|
| Typecheck + build | `npm run build` | exit 0 |
| Lint      | `npm run lint`   | exit 0, 0 errors |

## Scope

**In scope** (the only files you should modify):
- `src/pages/BlogListPage.tsx`

**Out of scope** (do NOT touch):
- `src/lib/blogLoader.ts` — do not change `getAllBlogPosts` return shape
  (Plan 012 owns the loader; this plan reads locale via the existing
  `getBlogLocales`/`getDefaultBlogLocale` exports). If Plan 012 has landed and
  changed the loader, the exports named here must still exist — otherwise STOP.
- `src/components/BlogPost.tsx` — its `PublishedBlock` already takes a locale
  via `publishedCopy`; not part of this plan.
- `src/components/commands/commands-output/BlogListOutput.tsx` — dead code
  (Plan 013 deletes it); do not fix it here.

## Git workflow

- Branch: `advisor/015-blog-list-locale-dates`
- Commit message: `fix(blog): format list dates in each post's default locale`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Change `formatListDate` to accept a locale

Update the formatter to take a locale argument with `es-ES` as the fallback
(preserves prior behavior for single-file / Spanish posts):

```ts
function formatListDate(value: string, locale = "es-ES"): string {
  const t = Date.parse(value);
  if (Number.isNaN(t)) return value;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(t))
    .replace(/\./g, "");
}
```

**Verify**: `npm run build` → exit 0.

### Step 2: Resolve each post's locale and pass it to the formatter

Import the locale helpers (already used by `BlogPost.tsx:8-9`) and compute a
per-post locale. Add to the imports from `@/lib/blogLoader`:

```ts
import { getAllBlogPosts, getDefaultBlogLocale } from "@/lib/blogLoader";
```

Then in the `sortedPosts.map` callback (around line 76), derive the locale and
use it at both call sites:

```ts
{sortedPosts.map((post, i) => {
  const tags = post.tags?.filter(Boolean).slice(0, 4) ?? [];
  const locale = getDefaultBlogLocale(post.id) ?? "es-ES";
  return (
    // ...
      <time dateTime={post.date} ...>
        {formatListDate(post.date, locale)}
      </time>
    // ...
      <span className="sm:hidden ...">
        {formatListDate(post.date, locale)}
      </span>
    // ...
```

`getDefaultBlogLocale` returns `undefined` for single-file posts (e.g.
`parcar-iot.mdx`) → falls back to `"es-ES"`, preserving that post's current
date format. For `umami-metricas-lectura` it returns `"en"` → the English
date now renders in `en-GB` style.

Note: `getDefaultBlogLocale` reads from the loader's module-level
`loadersByPost` map, which is populated at module load — no async cost in the
list render path.

**Verify**: `npm run build` → exit 0. `npm run dev`, open `/blog`:
- `parcar-iot` date unchanged (Spanish short-month format, e.g. "24 dic 2025").
- `umami-metricas-lectura` date now renders in English style
  (e.g. "14 Apr 2026"), matching its English default-locale title.

## Test plan

No test framework. Verify manually as above. Optionally add a one-line
`console.assert` in dev that
`formatListDate("2026-04-14", "en").includes("Apr")` and remove it after
confirming — not required for done criteria.

## Done criteria

ALL must hold:

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0 (warnings OK)
- [ ] `grep -n 'Intl.DateTimeFormat("es-ES"' src/pages/BlogListPage.tsx`
      returns no matches (the hardcoded locale is gone; only the default
      parameter remains)
- [ ] `grep -n "getDefaultBlogLocale" src/pages/BlogListPage.tsx` returns at
      least one match (the helper is used)
- [ ] No files outside `src/pages/BlogListPage.tsx` are modified (`git status`)
- [ ] Manual: English-default post shows an English-formatted date in `/blog`;
      single-file posts unchanged
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `getDefaultBlogLocale` or `getBlogLocales` no longer exist as exported
  functions in `src/lib/blogLoader.ts` (e.g. Plan 012 renamed/removed them) —
  STOP; do not re-add exports to the loader from this plan's scope.
- The list item type `BlogListItem` now carries an explicit `locale` field
  (Plan 012 or another change added it) — then prefer reading
  `post.locale` over calling `getDefaultBlogLocale(post.id)`, and report the
  deviation.
- `BlogListPage.tsx` no longer has the two `formatListDate(post.date)` call
  sites at the lines cited (drift) — re-locate them before editing; if the
  structure is substantially different, STOP.

## Maintenance notes

- **`es-ES` fallback**: single-file posts (no locale folder) keep the Spanish
  format, matching the site's historically Spanish-default voice. If the
  maintainer wants a global default locale instead, change the fallback — one
  line.
- **Locale string choices**: `getDefaultBlogLocale` returns the raw folder
  name (`"en"`, `"es"`). `Intl.DateTimeFormat` accepts these as-is; for more
  specific regional formatting (e.g. `en-GB` vs `en-US`) the map from locale
  code to BCP-47 tag would live in `blogLoader.ts` or a small i18n module —
  out of scope here; flag if needed.
- **Reviewer focus**: confirm single-file posts (no `getDefaultBlogLocale`)
  still render the Spanish date (regression check) and only the English
  multi-locale post changed.
