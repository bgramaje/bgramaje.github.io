# Plan 009: Reduce npm audit advisories (dev/build-time only)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5fffbdf..HEAD -- package.json package-lock.json`
> If either changed since this plan was written, compare the "Current state"
> against the live state before proceeding; on a mismatch, treat it as a STOP
> condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: preferably after plans/003-remove-dead-dependencies.md and
  plans/004-migrate-to-motion-package.md (so the dep tree is already cleaned
  and the audit reflects the final manifest)
- **Category**: security
- **Planned at**: commit `5fffbdf`, 2026-07-11

## Why this matters

`npm audit` reports 26 advisories (1 critical, 9 high, 14 moderate, 2 low) at
the audited commit. For this repo the runtime exposure is minimal: it is a
static SPA with no backend, no API routes, no SSR, and the advisories are all
in dev/build-time tooling (Vite dev server path-traversal, `ws`,
`launch-editor`, `yaml`, `uuid`). They do not ship in the production
`dist/` bundle. Still, a clean audit is a healthier baseline and removes
noise that hides real issues. The fix is a routine `npm audit fix` plus a
Vite bump, with verification that the build and dev server still work.

## Current state

`npm audit` (at commit `5fffbdf`) top advisories:

- `vite` — path traversal in optimized deps `.map` handling; arbitrary file
  read via dev-server WebSocket; `server.fs.deny` bypass on Windows.
  Affects the **dev server** only. `package.json` has `"vite": "^6.0.5"`.
- `ws` (8.0.0 - 8.20.1) — uninitialized memory disclosure; memory exhaustion
  DoS. Transitive (Vite dev server).
- `launch-editor` — NTLMv2 hash disclosure via UNC path on Windows.
  Transitive (Vite dev server).
- `yaml` (2.0.0 - 2.8.2) — stack overflow via deeply nested YAML. Transitive.
- `uuid` — (critical) transitive.

`npm audit` reports "fix available via `npm audit fix`" for each.

Production bundle: `vite build` outputs static JS/CSS/HTML to `dist/` and
deploys via GitHub Pages (`bgramaje.github.io`). No server runtime. So the
advisories do not affect deployed users.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Audit     | `npm audit`         | reduced count; ideally 0 |
| Build     | `npm run build`     | exit 0              |
| Dev smoke | `npm run dev` (briefly) | server starts, `/` loads |
| Lint      | `npm run lint`      | no new errors |

## Scope

**In scope** (the only files you should modify):
- `package.json` — version bumps resulting from `npm audit fix`
- `package-lock.json` — regenerated

**Out of scope** (do NOT touch):
- Any `src/` file.
- `vite.config.ts` — no config change needed.
- Do NOT run `npm audit fix --force` — it can bump across major versions and
  break the build. Plain `npm audit fix` only.

## Git workflow

- Branch: `advisor/009-npm-audit-fix`
- Commit: `chore: npm audit fix + bump vite`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Run npm audit fix (no --force)

```bash
npm audit fix
```

**Verify**: command completes; `package.json` / `package-lock.json` updated.
Re-run:

```bash
npm audit
```

Record the new advisory count. Expect a significant drop. Some advisories may
remain if they have no non-breaking fix — that is acceptable; report the
remaining count.

### Step 2: If Vite is still flagged, bump it manually

If `npm audit` still lists `vite` after Step 1, bump Vite to the latest 6.x
patch within the `^6.0.5` range (do not cross to 7.x — that is a major bump
and out of scope):

```bash
npm install vite@latest
```

(If `npm install vite@latest` resolves to Vite 7.x, STOP — do not cross
majors. Instead pin to the latest 6.x: `npm install vite@^6` and re-audit.)

**Verify**: `node -e "console.log(require('./node_modules/vite/package.json').version)"`
prints a version at or above the advisory ceiling. `npm audit` no longer
lists the Vite dev-server advisories (or reports them as fixed).

### Step 3: Verify build still works

```bash
npm run build
```

**Verify**: exit 0, `dist/` produced. `npm audit fix` sometimes bumps
`@vitejs/plugin-react` or related transitively; confirm the build is intact.

### Step 4: Verify dev server still starts

```bash
npm run dev
```

**Verify**: dev server starts without error and serves `/` (open the printed
URL, confirm the terminal home page loads). Stop the server once confirmed.

### Step 5: Lint

```bash
npm run lint
```

**Verify**: no new errors vs. the pre-plan baseline.

## Test plan

No automated tests. Verification is Steps 3-4 (build + dev server smoke).
The deployed static bundle is unaffected by dev-server advisories, so the
GitHub Pages deploy need not be re-tested.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `npm audit` advisory count is lower than 26 (record before/after
      counts in the plan README or PR description)
- [ ] `npm run build` exits 0
- [ ] `npm run dev` starts and serves `/` without error
- [ ] `npm run lint` introduces no new errors
- [ ] No `src/` files modified (`git status`)
- [ ] Vite was NOT bumped across a major version (still 6.x)
- [ ] `plans/README.md` status row updated with before/after audit counts

## STOP conditions

Stop and report back (do not improvise) if:

- `npm audit fix` attempts to bump a dependency across a major version that
  breaks `npm run build` — do not `--force`; report which package broke it.
- `npm install vite@latest` resolves to Vite 7.x — do not install; pin to
  `vite@^6` and report that the audit fix for Vite requires a major bump
  (defer to a separate Vite-7 migration plan).
- The dev server fails to start after the audit fix — report the error;
  reverting `package.json` / `package-lock.json` is the safe recovery.
- A critical advisory remains with no non-breaking fix — report which one so
  the maintainer can decide whether to accept it or schedule a major bump.

## Maintenance notes

- For a static SPA, dev-server advisories are low priority in practice; this
  plan exists to clear the noise, not to mitigate a live runtime risk. Do
  not over-invest — if a fix requires a major Vite bump, defer it.
- A future Vite 7 migration is its own plan (Rolldown bundler, new plugin
  API per the `vite` skill's `references/rolldown-migration.md`); do not
  bundle that into this audit fix.
- Reviewer: confirm no major-version bumps slipped in (`git diff package.json`
  should show patch/minor changes only, except for explicitly-removed deps
  from Plans 003/004).
