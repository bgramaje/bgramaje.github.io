# Plan 010: Add a `projects` terminal command

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5fffbdf..HEAD -- src/components/commands/commands.tsx src/data/portfolio.ts`
> If either changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as
> a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-fix-broken-build-mdx-types.md (need a green build to verify)
- **Category**: direction
- **Planned at**: commit `5fffbdf`, 2026-07-11

## Why this matters

The `projects` array in `src/data/portfolio.ts` defines three side projects
but no terminal command surfaces them. The terminal is the home page and the
primary navigation surface of the portfolio, so this data is effectively
invisible to visitors. Adding a `projects` command (with `project` as an
alias) makes the data reachable, auto-appears in `help` (which reads the
`commands` map), and is picked up by Tab autocomplete (which reads
`Object.keys(availableCommands)`). This is a small, grounded feature: it
exposes data that already exists using patterns the repo already uses
(`SkillsOutput`, `JobsOutput`).

## Current state

`src/data/portfolio.ts:83-102` defines `projects`:

```ts
export const projects: Project[] = [
  {
    name: "Portfolio Terminal",
    description: "Interactive terminal-style portfolio website built with React and TypeScript",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/bgramaje/bgramaje-portfolio-v2",
  },
  // ... two more
];
```

The `Project` interface (`portfolio.ts:11-17`):

```ts
export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}
```

The `commands` map (`portfolio.ts:185-195`) has no `projects` entry:

```ts
export const commands = {
  help: "Show available commands",
  jobs: "List jobs",
  publications: "Show publications",
  skills: "Show technical skills",
  contact: "Display contact information",
  studies: "Show academic studies",
  blog: "Navigate to blog",
  home: "Navigate to home page",
  clear: "Clear the terminal",
};
```

`src/components/commands/commands.tsx` `processCommand` switch (lines 27-82)
has no `projects` case.

Existing output-component patterns to mirror:
- `src/components/commands/commands-output/SkillsOutput.tsx` — reads a
  `portfolio.ts` array, maps it into terminal-styled markup with
  `text-terminal-*` classes. This is the closest exemplar.
- `src/components/commands/commands-output/JobsOutput.tsx` — shows a list
  with a `▸` marker and clickable rows. The `projects` output is read-only
  (no click handler needed) but can borrow the visual style.

`HelpOutput.tsx` reads `Object.entries(commands)` and renders all entries
sorted — so adding `projects` to the map auto-lists it in `help`.
`HomePage.tsx:138-142` Tab autocomplete reads `Object.keys(availableCommands)`
— so `projects` auto-gets Tab completion.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Build     | `npm run build`     | exit 0              |
| Lint      | `npm run lint`      | no new errors |

## Scope

**In scope** (the only files you should modify):
- `src/data/portfolio.ts` — add `projects` and `project` to the `commands` map
- `src/components/commands/commands.tsx` — add a `projects` / `project` case
- `src/components/commands/commands-output/ProjectsOutput.tsx` — CREATE

**Out of scope** (do NOT touch):
- `HelpOutput.tsx` — it auto-picks up new commands from the map; no change.
- `HomePage.tsx` — Tab autocomplete already reads the map keys; no change.
- Do not add a modal or navigation for projects (unlike `jobs <slug>` which
  opens a modal, `projects` is a flat list output). If a per-project detail
  view is wanted later, that is a separate plan.

## Git workflow

- Branch: `advisor/010-projects-command`
- Commit: `feat: add projects terminal command`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add the command description to the commands map

In `src/data/portfolio.ts`, add two entries to the `commands` object (line
~186, keeping alphabetical-ish order with the existing entries):

```ts
export const commands = {
  help: "Show available commands",
  jobs: "List jobs",
  projects: "Show side projects",
  publications: "Show publications",
  skills: "Show technical skills",
  contact: "Display contact information",
  studies: "Show academic studies",
  blog: "Navigate to blog",
  home: "Navigate to home page",
  clear: "Clear the terminal",
};
```

(The `project` alias is handled in the switch, not the map — the map lists
canonical names for `help`/autocomplete. Add only `projects` to the map.)

**Verify**: `rg -n "projects:" src/data/portfolio.ts` matches the new line.

### Step 2: Create the ProjectsOutput component

Create `src/components/commands/commands-output/ProjectsOutput.tsx`, modeled
after `SkillsOutput.tsx`. It reads `projects` from `@/data/portfolio` and
renders each project with name, description, technologies (as terminal-success
chips), and a GitHub link when present.

Target shape (adapt styling to match `SkillsOutput` / `JobsOutput`; use
`text-terminal-*` tokens per AGENTS.md):

```tsx
import { projects } from "@/data/portfolio";

export function ProjectsOutput() {
  return (
    <div className="space-y-3 mx-2">
      <p className="text-terminal-accent font-semibold">Side projects:</p>
      {projects.map((project) => (
        <div key={project.name} className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-terminal-success shrink-0">▸</span>
            <h3 className="text-terminal-text text-sm font-medium">{project.name}</h3>
          </div>
          <p className="text-terminal-muted text-xs leading-relaxed pl-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pl-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs bg-terminal-border/50 text-terminal-success rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pl-4 text-xs text-terminal-cyan hover:underline"
            >
              {project.github}
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pl-4 ml-2 text-xs text-terminal-cyan hover:underline"
            >
              {project.url}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
```

Notes:
- Use `@/` alias (AGENTS.md convention).
- Use terminal tokens (`text-terminal-accent`, `text-terminal-success`,
  `text-terminal-muted`, `text-terminal-text`, `text-terminal-cyan`,
  `bg-terminal-border/50`) — do not use raw hex.
- `export function` (named export), matching `SkillsOutput` / `JobsOutput`.

**Verify**: `npx tsc -b` exits 0 (the new file compiles; `projects` and
`Project` are already exported from `portfolio.ts`).

### Step 3: Wire the command in processCommand

In `src/components/commands/commands.tsx`:

1. Add the import with the other output imports (near line 6):

```tsx
import { ProjectsOutput } from "@/components/commands/commands-output/ProjectsOutput";
```

2. Add a case in the `switch` (after the `jobs`/`work`/`experience` block,
   before `publications`, to keep rough grouping):

```tsx
    case "projects":
    case "project":
      return <ProjectsOutput />;
```

**Verify**: `rg -n "ProjectsOutput" src/components/commands/commands.tsx`
matches both the import and the case.

### Step 4: Build and lint

```bash
npm run build
npm run lint
```

**Verify**: build exits 0; lint introduces no new errors.

## Test plan

No automated tests. Manual test plan (the real verification):

- In the terminal, type `projects` + Enter — the three projects render with
  name, description, technology chips, and GitHub link.
- Type `project` (singular alias) — same output.
- Type `help` — `projects` appears in the command list with the description
  "Show side projects".
- Type `pro` + Tab — autocompletes to `projects`.
- Type `projects xyz` — currently this still renders the full list (the case
  ignores args). That is acceptable for this plan (no per-project detail
  view); if the user expects arg handling, that is a follow-up.
- Click the GitHub link — opens in a new tab.

A reviewer should run these flows.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `src/components/commands/commands-output/ProjectsOutput.tsx` exists and imports `projects` from `@/data/portfolio`
- [ ] `rg -n "case \"projects\"" src/components/commands/commands.tsx` matches
- [ ] `rg -n "case \"project\"" src/components/commands/commands.tsx` matches (alias)
- [ ] `rg -n "projects:" src/data/portfolio.ts` matches the commands-map entry
- [ ] `npm run build` exits 0
- [ ] `npm run lint` introduces no new errors
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] Manual test plan (above) passes
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The `projects` array or `Project` interface in `portfolio.ts` no longer
  exists at the cited lines (data was removed or restructured) — report the
  current shape so the output component can be adjusted.
- `processCommand` is no longer a single `switch` (e.g. refactored to a
  registry/map) — wire the new command into whatever dispatch structure
  exists, and report the structure change.
- Adding the command reveals that `projects` data is intentionally private
  (e.g. a comment or ADR says not to surface it) — report and do not ship.

## Maintenance notes

- To add a new project later, append to the `projects` array in
  `portfolio.ts` — the command auto-renders it. No registry edit needed.
- If a per-project detail view (like `jobs <slug>`) is added later, follow
  the `jobs` pattern: accept `args[0]`, validate against a slug, open a modal
  via `options.onOpenModal`. That is a separate plan.
- The `Framer Motion` mention in the first project's `technologies` will
  become stale after Plan 004 migrates to `motion`; consider updating that
  string to "Motion" — but that is a content edit, not this plan's scope.
- Reviewer: run the manual test plan; the build only proves it compiles.
