# Plan 014: Remove the stray `pnpm-lock.yaml` (project is npm-only)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat dc0b0ad..HEAD -- pnpm-lock.yaml .gitignore .github/workflows/deploy.yml package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: NONE
- **Depends on**: none
- **Category**: dx | tech-debt
- **Planned at**: commit `dc0b0ad`, 2026-07-11

## Why this matters

The repo carries **two** lockfiles: `package-lock.json` (436 KB) and
`pnpm-lock.yaml` (258 KB). CI and all documented tooling are npm-based:
`.github/workflows/deploy.yml:29` sets `cache: 'npm'`, line 33 runs
`npm ci || (npm install && npm cache clean --force)`, and line 36 runs
`npm run build`. `AGENTS.md` documents `npm install` / `npm run build`. The
`pnpm-lock.yaml` was added by a remote commit and is never consulted by the
npm toolchain, so it is 258 KB of dead weight that can silently diverge from
`package-lock.json` and mislead anyone who runs `pnpm install` into a
dependency set CI does not actually use. Remove it and gitignore it so it
cannot drift back.

## Current state

- `pnpm-lock.yaml` exists at repo root (258 KB), tracked by git.
- `package-lock.json` exists at repo root (436 KB), tracked by git — the
  source of truth for CI.
- `.github/workflows/deploy.yml`:
  - line 29: `cache: 'npm'`
  - line 33: `npm ci || (npm install && npm cache clean --force)`
  - line 36: `run: npm run build`
- `package.json` has no `packageManager` field (neither npm nor pnpm is
  declared as the manager).
- `.gitignore` — check whether `pnpm-lock.yaml` is already ignored; it is not
  (it is tracked). Read it before editing.

## Commands you will need

| Purpose   | Command          | Expected on success |
|-----------|------------------|---------------------|
| Build     | `npm run build`  | exit 0 |
| Lint      | `npm run lint`   | exit 0, 0 errors |
| Verify ignore | `git check-ignore pnpm-lock.yaml` | prints `pnpm-lock.yaml`, exit 0 |

## Scope

**In scope** (the only files you should modify):
- `pnpm-lock.yaml` (delete)
- `.gitignore` (add one line)

**Out of scope** (do NOT touch):
- `package-lock.json` — the active lockfile; leave it.
- `package.json` — do not add a `packageManager` field (that is a separate
  decision; this plan only removes the stray lockfile).
- `.github/workflows/deploy.yml` — CI already uses npm; no change needed.
- Any `src/` file.

## Git workflow

- Branch: `advisor/014-remove-pnpm-lockfile`
- Commit message: `chore: remove stray pnpm-lock.yaml (project is npm-only)`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Read `.gitignore` and append the lockfile entry

Read `.gitignore`. If `pnpm-lock.yaml` is not already listed, append:

```
# pnpm is not used; CI is npm-based (see .github/workflows/deploy.yml)
pnpm-lock.yaml
```

Place it near other dependency/build ignores if a section exists, or at the
end otherwise. Do not reorder existing entries.

**Verify**: `cat .gitignore` shows the new line; `git check-ignore pnpm-lock.yaml` → prints `pnpm-lock.yaml`, exit 0.

### Step 2: Remove the tracked lockfile

```bash
git rm --cached pnpm-lock.yaml
rm -f pnpm-lock.yaml
```

`git rm --cached` stops tracking it; the filesystem `rm` removes the local
copy. The `.gitignore` entry from Step 1 prevents it from being re-added.

**Verify**: `git status` shows `pnpm-lock.yaml` as deleted (staged). `ls pnpm-lock.yaml` → "No such file or directory".

### Step 3: Confirm npm toolchain is unaffected

```bash
npm ci
```

**Verify**: `npm ci` exits 0 (it uses `package-lock.json`; the pnpm lock is
not consulted). Then `npm run build` → exit 0. `npm run lint` → exit 0.

## Test plan

No tests apply. Verification is the `npm ci` + build + lint gate and the
`git check-ignore` result.

## Done criteria

ALL must hold:

- [ ] `ls pnpm-lock.yaml` → no such file
- [ ] `git check-ignore pnpm-lock.yaml` → exit 0, prints the path
- [ ] `git ls-files pnpm-lock.yaml` → empty (no longer tracked)
- [ ] `npm ci` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0 (warnings OK)
- [ ] No files outside `.gitignore` are modified (`git status` shows only the
      `pnpm-lock.yaml` deletion and the `.gitignore` edit)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `.github/workflows/deploy.yml` no longer uses npm (e.g. CI was switched to
  `pnpm install`/`pnpm run build`) — then `pnpm-lock.yaml` is NOT stray and
  this plan should be abandoned; report it.
- A `package.json` `packageManager` field specifying pnpm has been added since
  `dc0b0ad` — same: pnpm is intentional, STOP.
- `npm ci` fails after the removal (would indicate `package-lock.json` is out
  of sync — that is a separate problem; report it, do not run `npm install`
  to regenerate the lockfile in this plan).

## Maintenance notes

- **If the project ever switches to pnpm**: remove the `.gitignore` entry,
  regenerate `pnpm-lock.yaml` with `pnpm import` (from `package-lock.json`),
  update CI to `pnpm install`/`pnpm run build`, and add a `packageManager`
  field to `package.json`. This plan does not preclude that.
- **Reviewer focus**: the only safety check is that CI is npm-based
  (`deploy.yml` lines 29/33/36) — confirmed in "Current state"; re-confirm at
  review time in case CI drifted.
