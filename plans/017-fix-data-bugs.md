# Plan 017: Fix data bugs (email, CV, sitemap, ticker)

> **Executor instructions**: Follow step by step. Verify after each step.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `9af401a`, 2026-07-12

## Why this matters

Four data bugs affect real users:
1. **Email mismatch**: `personalInfo.email` is `boralbgra@gmail.com` but
   `socialLinks` email URL is `mailto:bgramaje@gmail.com` — users see two
   different addresses.
2. **CV locale mapping**: Both `es` and `en` locales download the same
   English YAML file, so Spanish CV downloads produce English content.
3. **CV filename collision**: Both locales use the same filename
   `"Borja-Gramaje-CV.pdf"`, so downloading both overwrites in the
   browser's download folder.
4. **Sitemap hardcodes `en.mdx`**: The sitemap generator only reads
   `en.mdx` for directory-based blog posts, missing Spanish variants.
5. **BitcoinTicker cleanup leak**: `requestIdleCallback` handle is never
   cancelled, causing a potential React 18 dev warning on unmount.

## Current state

See audit findings CORRECTNESS-01, CORRECTNESS-04, CORRECTNESS-05,
CORRECTNESS-08, CORRECTNESS-09.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope:**
- `src/data/portfolio.ts` — fix email
- `src/lib/cv/downloadResumePdf.tsx` — fix locale mapping + filename
- `scripts/generate-sitemap.mjs` — fix `en.mdx` hardcode
- `src/components/BitcoinTicker.tsx` — cancel idle callback

## Steps

### Step 1: Fix email mismatch

In `src/data/portfolio.ts`, line 163, change:
```
    url: "mailto:bgramaje@gmail.com",
```
to:
```
    url: "mailto:boralbgra@gmail.com",
```

**Verify**: `grep 'mailto:' src/data/portfolio.ts` → `mailto:boralbgra@gmail.com`

### Step 2: Fix CV locale mapping and filenames

In `src/lib/cv/downloadResumePdf.tsx`:

Line 10, change `es: "/borja-gramaje.en.yml"` to `es: "/borja-gramaje.es.yml"`:
```typescript
const YAML_URL_BY_LOCALE: Record<ResumeLocale, string> = {
  es: "/borja-gramaje.es.yml",
  en: "/borja-gramaje.en.yml",
};
```

Lines 14-17, change filenames to be locale-specific:
```typescript
const DEFAULT_FILENAME: Record<ResumeLocale, string> = {
  es: "Borja-Gramaje-CV-es.pdf",
  en: "Borja-Gramaje-CV-en.pdf",
};
```

**Verify**: `grep 'es:' src/lib/cv/downloadResumePdf.tsx` → `es: "/borja-gramaje.es.yml"` and `es: "Borja-Gramaje-CV-es.pdf"`

### Step 3: Fix sitemap generator to handle locale directories

In `scripts/generate-sitemap.mjs`, line 20-22, replace the hardcoded `en.mdx` with logic that reads the directory contents to find available locale files:

Change lines 20-22 from:
```javascript
  const file = entry.isDirectory()
    ? path.join(blogDir, entry.name, "en.mdx")
    : path.join(blogDir, entry.name);
```

To:
```javascript
  let file;
  if (entry.isDirectory()) {
    const dirFiles = await readdir(path.join(blogDir, entry.name));
    const mdxFile = dirFiles.find(f => f.endsWith(".mdx"));
    if (!mdxFile) return null; // skip directories with no MDX files
    file = path.join(blogDir, entry.name, mdxFile);
  } else {
    file = path.join(blogDir, entry.name);
  }
```

**Verify**: `node scripts/generate-sitemap.mjs` → exits 0. Check `public/sitemap.xml` still has blog entries.

### Step 4: Fix BitcoinTicker idle callback leak

In `src/components/BitcoinTicker.tsx`:

Replace line 83:
```typescript
    if (!getCached()) {
      scheduleIdle(fetchPrice);
    }
```

With:
```typescript
    let idleHandle: number | undefined;
    if (!getCached()) {
      idleHandle = requestIdleCallback(fetchPrice, { timeout: 3000 });
    }
```

Update the cleanup function (line 88) to also cancel the idle callback:
```typescript
    const intervalId = setInterval(fetchPrice, CACHE_MS);
    return () => {
      clearInterval(intervalId);
      if (idleHandle !== undefined) cancelIdleCallback(idleHandle);
    };
```

Note: `scheduleIdle` was a wrapper that fell back to `setTimeout` when `requestIdleCallback` is unavailable. Since we now call `requestIdleCallback` directly in the fix, we should handle the fallback for the idle handle too. Add a helper:

```typescript
function scheduleIdleWithCancel(cb: () => void): () => void {
  if (typeof requestIdleCallback !== "undefined") {
    const handle = requestIdleCallback(cb, { timeout: 3000 });
    return () => cancelIdleCallback(handle);
  }
  const handle = setTimeout(cb, 1);
  return () => clearTimeout(handle);
}
```

And use it:
```typescript
    let cancelIdle: (() => void) | undefined;
    if (!getCached()) {
      cancelIdle = scheduleIdleWithCancel(fetchPrice);
    }

    const intervalId = setInterval(fetchPrice, CACHE_MS);
    return () => {
      clearInterval(intervalId);
      cancelIdle?.();
    };
```

**Verify**: `npm run build` → exit 0. `npm run lint` → exit 0.

## Test plan

No new tests. Build + lint are the verification gates.

## Done criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `grep 'mailto:' src/data/portfolio.ts` shows only `mailto:boralbgra@gmail.com`
- [ ] `grep 'es:' src/lib/cv/downloadResumePdf.tsx` shows locale-correct paths
- [ ] `grep 'Borja-Gramaje-CV-es.pdf' src/lib/cv/downloadResumePdf.tsx` exists
- [ ] `scripts/generate-sitemap.mjs` no longer contains `"en.mdx"`
- [ ] `src/components/BitcoinTicker.tsx` has `cancelIdleCallback` (or `cancelIdle`)
