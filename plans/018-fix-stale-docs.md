# Plan 018: Fix stale documentation (AGENTS.md, README.md)

> **Executor instructions**: Follow step by step. Verify after each step.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `9af401a`, 2026-07-12

## Why this matters

`AGENTS.md` is the primary reference for AI agents working on this repo. It
currently says `cssVariables: false` (reality: `true`) and refers to
"Tailwind v3 stack" (reality: Tailwind v4). Agents rely on these facts to
generate correct component code. `README.md` mentions "Framer Motion" but
the project uses the `motion` v12 package (the rename of Framer Motion).

## Current state

- `AGENTS.md:17` — `cssVariables: false` (should be `true`)
- `AGENTS.md:259` — "Tailwind v3 stack" (should be "Tailwind v4")
- `README.md:70` — "Framer Motion" (should be "Motion (motion v12)")

## Steps

### Step 1: Fix AGENTS.md

Change line 17 from `cssVariables: false` to `cssVariables: true`.

Change line 259 from "Tailwind v3 stack" to "Tailwind v4 stack."

Also check for any other references to v3 in the file; the heading on line
16 says "Tailwind CSS **v3** + custom `terminal.*` tokens" — should be
"Tailwind CSS **v4** + shadcn semantic tokens" (but this may already have
been fixed in the uncommitted diff — verify before changing).

**Verify**: `grep -n 'cssVariables\|Tailwind v3\|Tailwind v4\|v3 stack\|v4 stack' AGENTS.md` and confirm correct values.

### Step 2: Fix README.md

In `README.md`, find "Framer Motion" and replace with "Motion (motion v12)".

**Verify**: `grep -n 'Framer Motion\|framer-motion' README.md` → no matches. Should find `Motion (motion v12)` instead.

## Done criteria

- [ ] `grep 'cssVariables' AGENTS.md` shows `cssVariables: true`
- [ ] `grep 'Tailwind v3' AGENTS.md` returns no matches
- [ ] `grep 'Tailwind v4' AGENTS.md` finds at least one match
- [ ] `grep 'Framer Motion\|framer-motion' README.md` returns no matches
