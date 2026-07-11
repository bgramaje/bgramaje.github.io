# Plan 013: Delete dead `BlogListOutput.tsx`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat dc0b0ad..HEAD -- src/components/commands/commands-output/BlogListOutput.tsx src/components/commands/commands.tsx`
> If either file changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: NONE
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `dc0b0ad`, 2026-07-11

## Why this matters

`src/components/commands/commands-output/BlogListOutput.tsx` (54 lines) is
never imported anywhere in the codebase. The terminal `blog` command
(`commands.tsx:66-73`) navigates to `/blog` via `options.onNavigate("/blog")`
and never renders `BlogListOutput`. The component exists as dead code that
misleads future readers into thinking the `blog` terminal command renders an
in-terminal post list (it does not). Deleting it removes the confusion and the
maintenance surface.

## Current state

- `src/components/commands/commands-output/BlogListOutput.tsx` — the file to
  delete. It exports `BlogListOutput`, imports `getAllBlogPosts` from
  `@/lib/blogLoader`, and renders an in-terminal list that is never shown.
- `src/components/commands/commands.tsx:66-73` — the `blog` command branch:
  ```ts
  case "blog":
  case "posts":
  case "articles":
    if (options?.onNavigate) {
      options.onNavigate("/blog");
      return null;
    }
    return <div className="text-terminal-muted text-sm">Open /blog from the app shell to read posts.</div>;
  ```
  It does not import or reference `BlogListOutput`. Confirmed by grep:
  `BlogListOutput` appears only in its own definition file (no other `src/`
  references).
- `src/pages/BlogListPage.tsx` is the real blog list (the routed `/blog` page);
  it is unrelated to this dead component.

## Commands you will need

| Purpose   | Command          | Expected on success |
|-----------|------------------|---------------------|
| Typecheck + build | `npm run build` | exit 0 |
| Lint      | `npm run lint`   | exit 0, 0 errors |

## Scope

**In scope** (the only files you should modify):
- `src/components/commands/commands-output/BlogListOutput.tsx` (delete)

**Out of scope** (do NOT touch):
- `src/components/commands/commands.tsx` — the `blog` command already works;
  leave it.
- `src/pages/BlogListPage.tsx` — the real list page.
- `src/lib/blogLoader.ts` — `getAllBlogPosts` stays (used by `BlogListPage`).

## Git workflow

- Branch: `advisor/013-delete-dead-bloglistoutput`
- Commit message: `chore: delete dead BlogListOutput component`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Confirm the component is still unreferenced

Run the reference check that proves it is safe to delete.

**Verify**: `grep -rn "BlogListOutput" src/` → exactly one match, in
`src/components/commands/commands-output/BlogListOutput.tsx` itself (the
`export function BlogListOutput` line). If any other file imports it, STOP.

### Step 2: Delete the file

Delete `src/components/commands/commands-output/BlogListOutput.tsx`.

**Verify**: `git status` shows the file as deleted; `ls src/components/commands/commands-output/BlogListOutput.tsx` → "No such file or directory".

### Step 3: Build and lint

**Verify**: `npm run build` → exit 0. `npm run lint` → exit 0, 0 errors.

## Test plan

No tests exist for this component (it was never wired in). No new tests
needed for a deletion of unreferenced code.

## Done criteria

ALL must hold:

- [ ] `grep -rn "BlogListOutput" src/` returns no matches
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0 (warnings OK)
- [ ] No files other than the deletion are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Step 1's grep returns matches outside `BlogListOutput.tsx` itself (someone
  wired it in since `dc0b0ad` — do not delete a live component; report and
  let the maintainer decide).
- `npm run build` fails after the deletion with an import-resolution error
  pointing at `BlogListOutput` (would indicate a dynamic reference the grep
  missed — report it).

## Maintenance notes

- **If the maintainer later wants an in-terminal blog list**: re-introduce a
  component under `commands-output/` and actually wire it into the `blog`
  case in `commands.tsx` (replacing or alongside the `onNavigate("/blog")`
  branch). The old file is recoverable from git history.
- **Reviewer focus**: the grep in Step 1 is the entire safety argument; make
  sure it ran against `src/` and returned one match before deleting.
