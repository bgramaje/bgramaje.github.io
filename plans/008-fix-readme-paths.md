# Plan 008: Fix stale path references in README.md

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5fffbdf..HEAD -- README.md`
> If the file changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as
> a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `5fffbdf`, 2026-07-11

## Why this matters

`README.md` points new contributors (and agents) at paths that do not exist.
Blog MDX is said to live in `src/blogs/` but actually lives in `src/mdx/blogs/`;
the "comandos" logic is said to live in `src/lib/` but actually lives in
`src/components/commands/`. `AGENTS.md` already calls this out ("the blog
path may say `src/blogs/`; use `src/mdx/blogs/`"). Stale setup docs are worse
than missing ones — they waste onboarding time. This plan aligns README with
the real layout described in `AGENTS.md`.

## Current state

`README.md:50-56`:

```markdown
## 📁 Estructura del proyecto

- `src/pages/` - Páginas principales (HomePage, BlogPage)
- `src/components/` - Componentes reutilizables
- `src/blogs/` - Archivos MDX de los posts del blog
- `src/data/` - Datos del portfolio (jobs, publications, etc.)
- `src/lib/` - Utilidades y lógica de comandos
```

Actual layout (from `AGENTS.md` "Directory map" and the file tree):

- Blog MDX: `src/mdx/blogs/*.mdx` (not `src/blogs/`)
- Job MDX: `src/mdx/jobs/*.mdx` (not mentioned in README at all)
- Command logic: `src/components/commands/commands.tsx` (not `src/lib/`)
- `src/lib/` holds utilities: `blogLoader.ts`, `jobLoader.ts`,
  `terminal-focus.ts`, `utils.ts` (not "lógica de comandos")

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Search    | `rg -n "src/blogs|src/lib/.*comandos" README.md` | no matches after edit |

No build/lint impact — README is not compiled.

## Scope

**In scope** (the only file you should modify):
- `README.md`

**Out of scope** (do NOT touch):
- `AGENTS.md`, `CLAUDE.md` — these are the authoritative agent guides and
  are already correct. Do not duplicate their content into README; just fix
  the wrong paths.
- Do not translate or rewrite the rest of README. Keep the Spanish tone and
  emoji style; only correct the inaccurate lines.

## Git workflow

- Branch: `advisor/008-fix-readme-paths`
- Commit: `docs: fix stale project paths in README`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Replace the "Estructura del proyecto" section

In `README.md`, replace lines 50-56 with accurate entries:

```markdown
## 📁 Estructura del proyecto

- `src/pages/` - Páginas principales (HomePage, BlogListPage, BlogPage)
- `src/components/` - Componentes reutilizables (terminal, comandos, UI)
- `src/components/commands/` - Lógica de comandos del terminal (`commands.tsx`)
- `src/mdx/blogs/` - Archivos MDX de los posts del blog
- `src/mdx/jobs/` - Archivos MDX de las experiencias laborales
- `src/data/` - Datos del portfolio (`portfolio.ts`: jobs, publications, skills, etc.)
- `src/lib/` - Utilidades (loaders de MDX, `terminal-focus`, `utils`)
```

**Verify**: `rg -n "src/blogs" README.md` → no matches.

### Step 2 (optional): Add a pointer to AGENTS.md

After the "Estructura del proyecto" section, add one line so contributors
find the authoritative guide:

```markdown
> Para detalles completos de arquitectura y convenciones, ver `AGENTS.md`.
```

This is optional but recommended; skip if you want to keep the change minimal.

**Verify**: the line is present (or intentionally omitted).

## Test plan

No tests. Verification is the grep in Done criteria.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `rg -n "src/blogs" README.md` returns no matches
- [ ] `rg -n "src/mdx/blogs" README.md` returns at least one match
- [ ] `rg -n "src/mdx/jobs" README.md` returns at least one match
- [ ] `rg -n "src/components/commands" README.md` returns at least one match
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The "Estructura del proyecto" section no longer exists at the cited lines
  (README was restructured) — report the current structure so the plan can be
  re-targeted.
- `AGENTS.md` disagrees with the paths this plan writes (would mean the
  authoritative guide is itself wrong) — report the contradiction rather than
  picking one.

## Maintenance notes

- `AGENTS.md` remains the source of truth for agents; README is the
  human-facing entry point. If a path changes, update both.
- Reviewer: a quick visual diff of the "Estructura" section is enough.
