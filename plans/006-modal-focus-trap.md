# Plan 006: Add focus trap and focus restore to the modals

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5fffbdf..HEAD -- src/components/JobModal.tsx src/components/terminal/TerminalModal.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S-M
- **Risk**: LOW
- **Depends on**: none (independent; can run after Plan 001 so the build verifies)
- **Category**: a11y
- **Planned at**: commit `5fffbdf`, 2026-07-11

## Why this matters

Both modals in the app (`JobModal` and `TerminalModal`) render a full-screen
overlay but do not trap keyboard focus or restore focus to the trigger when
closed. A keyboard user can Tab out of the modal into the (hidden) page
behind it, and when the modal closes the focus is lost rather than returned
to the element that opened it. This is a WCAG 2.2 SC 2.4.3 (Focus Order) and
SC 2.4.11 (Focus Not Obscured) concern. The fix is small, dependency-free
(AGENTS.md: no new deps for one-liners; prefer stdlib), and improves keyboard
and screen-reader usability of the terminal's primary navigation paths
(`jobs <slug>` opens `JobModal`; several commands open `TerminalModal`).

## Current state

`src/components/JobModal.tsx` (lines 13-49): renders when `isOpen` is true,
handles Escape (lines 14-22), closes on backdrop click, but:
- does not focus any element on open,
- does not trap Tab within the modal,
- does not restore focus to the trigger on close.

`src/components/terminal/TerminalModal.tsx` (lines 16-190): focuses the input
on open (lines 42-46), handles Escape (lines 136-138), closes on backdrop
click, but:
- does not trap Tab (focus can leave the modal),
- does not restore focus on close.

Both use the same overlay pattern:

```tsx
<div className="fixed inset-0 z-50 ... " onClick={onClose}>
  <motion.div ... onClick={(e) => e.stopPropagation()}>
```

The repo has no focus-trap dependency and AGENTS.md forbids adding deps for
one-liners. The standard, dependency-free pattern: on open, remember
`document.activeElement`; on close, call `.focus()` on it. Trap Tab by
querying focusable elements within the modal container and wrapping focus at
the boundaries.

Conventions to match: hooks live alongside components or in `src/lib/`. The
repo's `src/lib/` already holds `terminal-focus.ts` (a custom focus event
utility). A small `useFocusTrap` hook fits there. The repo uses React 18
(`useContext`, `forwardRef` where established) — do not use React 19 APIs.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Build     | `npm run build`     | exit 0              |
| Lint      | `npm run lint`      | no new errors vs. pre-plan baseline |

## Suggested executor toolkit

- The `accessibility` skill at `.agents/skills/accessibility/SKILL.md` and its
  `references/A11Y-PATTERNS.md` contain copy-paste-ready modal focus-trap
  patterns. Read `A11Y-PATTERNS.md` before writing the hook.
- React 18 only — no `use()`, no ref-as-prop.

## Scope

**In scope** (the only files you should modify):
- `src/lib/useFocusTrap.ts` — CREATE: a small focus-trap + restore hook
- `src/components/JobModal.tsx` — wire the hook
- `src/components/terminal/TerminalModal.tsx` — wire the hook

**Out of scope** (do NOT touch):
- `src/components/terminal/Terminal.tsx`, `TerminalPrompt.tsx` — the input
  itself stays as-is; the hook focuses the modal container or input via a ref.
- `HomePage.tsx` — it owns the modal open/close state; no change needed. The
  hook reads `document.activeElement` at open time, so no prop wiring is
  required from the parent.
- Do not add `focus-trap-react` or any dependency.

## Git workflow

- Branch: `advisor/006-modal-focus-trap`
- Commit: `feat: trap and restore focus in job and terminal modals`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Create the useFocusTrap hook

Create `src/lib/useFocusTrap.ts`. The hook takes an `open` boolean and a ref
to the modal container, and returns nothing. On `open` becoming true it:
1. saves `document.activeElement` as the element to restore later,
2. moves focus into the modal (focus the container, or the first focusable
   element, or an input ref if provided),
3. attaches a `keydown` listener on `document` that, for Tab/Shift+Tab, keeps
   focus within the modal by cycling through the modal's focusable elements.

On `open` becoming false (cleanup), it restores focus to the saved element and
removes the listener.

Target shape (adapt from the accessibility skill's pattern; this is the
contract, not mandatory line-for-line code):

```ts
import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusTarget =
      initialFocusRef?.current ??
      container.querySelector<HTMLElement>(FOCUSABLE) ??
      container;
    focusTarget.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || !container) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusable.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, containerRef, initialFocusRef]);
}
```

Notes:
- The container element must be focusable for the fallback `container.focus()`
  to work — add `tabIndex={-1}` to the modal container `<motion.div>` in each
  modal (see Step 2/3).
- `RefObject<HTMLElement | null>` matches React 18's `useRef<HTMLElement>(null)`
  typing.

**Verify**: `npx tsc -b` exits 0 (the new file compiles).

### Step 2: Wire the hook into JobModal

In `src/components/JobModal.tsx`:

1. Import the hook: `import { useFocusTrap } from "@/lib/useFocusTrap";`
2. Add a ref: `const containerRef = useRef<HTMLDivElement>(null);` (import
   `useRef` from `react`).
3. Attach the ref to the inner `<motion.div>` (line 32) and add
   `tabIndex={-1}` so the container is focusable as a fallback.
4. Call the hook after the early return guard? No — hooks cannot be called
   conditionally. The component already returns `null` at line 24 BEFORE any
   hooks other than `useEffect`. **Restructure**: move the `if (!isOpen)
   return null;` guard to AFTER the hook calls, or pass `isOpen` to the hook
   and let it no-op when false. The hook design above already no-ops when
   `open` is false, so call `useFocusTrap(isOpen, containerRef)` before the
   early return. Remove the existing Escape `useEffect`? No — keep it; the
   trap handles Tab, the existing handler handles Escape. They coexist.

Resulting top of component:

```tsx
export function JobModal({ isOpen, onClose, jobId, title }: JobModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, containerRef);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  // ... attach ref + tabIndex={-1} to the motion.div
}
```

**Verify**: `npm run build` exits 0.

### Step 3: Wire the hook into TerminalModal

In `src/components/terminal/TerminalModal.tsx`:

1. Import `useFocusTrap` and `useRef`.
2. Add `const containerRef = useRef<HTMLDivElement>(null);`.
3. Attach `ref={containerRef}` and `tabIndex={-1}` to the inner `<motion.div>`
   (line 151).
4. Call `useFocusTrap(isOpen, containerRef, inputRef)` — pass `inputRef` as
   the initial focus so the terminal input gets focus (preserving the current
   behavior at lines 42-46). The existing `useEffect` that focuses the input
   on open (lines 42-46) can be removed since the hook now does it, OR left
   in place — removing it avoids double-focus. Prefer removing it to keep one
   source of truth.
5. Note: this component already calls `if (!isOpen) return null;` at line 143,
   AFTER all hooks (the hooks are above line 143). The new `useFocusTrap`
   call must also go above line 143 (before the early return) to obey the
   Rules of Hooks. Place it near the other `useEffect`/`useCallback` calls.

**Verify**: `npm run build` exits 0.

### Step 4: Lint and build

```bash
npm run build
npm run lint
```

**Verify**: build exits 0; lint introduces no new errors.

## Test plan

No automated tests (repo has none; adding a test framework is out of scope).
Manual keyboard test plan — this is the verification that matters for a11y:

- `JobModal`: from the terminal, run `jobs <valid-slug>`. Press Tab repeatedly
  — focus must cycle only within the modal (title bar close button, job
  content links), never reaching the page behind. Press Escape — modal
  closes AND focus returns to the terminal input. Click the backdrop — modal
  closes AND focus returns to the terminal input.
- `TerminalModal`: trigger a command that opens the generic modal. Tab cycles
  within the modal (input, close chip). The terminal input inside the modal
  is focused on open. Escape closes and returns focus to the main terminal
  input. Backdrop click closes and returns focus.
- Confirm focus restore target is correct: before opening the modal, click
  the main terminal input so it is `activeElement`; open the modal; close it;
  the main terminal input should be focused again (so typing goes to the
  terminal, not lost).

A reviewer should perform these three flows.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `src/lib/useFocusTrap.ts` exists and `npx tsc -b` exits 0
- [ ] `rg -n "useFocusTrap" src/` shows calls in both `JobModal.tsx` and `TerminalModal.tsx`
- [ ] Both modal containers have `tabIndex={-1}`
- [ ] `npm run build` exits 0
- [ ] `npm run lint` introduces no new errors vs. pre-plan baseline
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] Manual keyboard test plan (above) passes for both modals
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The existing `if (!isOpen) return null;` early return in `JobModal.tsx`
  sits BEFORE hooks (it does not — `useEffect` is above it — but if a future
  edit moved it, you cannot place `useFocusTrap` after a conditional return).
  If you cannot place the hook call above the early return without
  restructuring, STOP and report.
- The `motion.div` ref type does not accept `RefObject<HTMLDivElement>` (it
  should — `motion.div` forwards to a `HTMLDivElement`), or `tabIndex={-1}`
  is rejected by the prop type. Report the exact TS error.
- Focus restore interferes with the terminal's custom focus event
  (`FOCUS_TERMINAL_INPUT_EVENT` in `src/lib/terminal-focus.ts`) — e.g. the
  restored focus is immediately stolen. If so, report so the interaction can
  be reconciled rather than papered over.

## Maintenance notes

- If a third modal is added later, reuse `useFocusTrap` rather than
  re-implementing. The hook is intentionally generic.
- The trap queries the DOM at Tab-press time, so dynamically inserted
  focusable elements (e.g. content rendered after MDX load inside the modal)
  are picked up automatically.
- Reviewer: the keyboard test plan is the real gate; the build only proves
  the hook compiles. Walk the three flows in the Test plan before approving.
