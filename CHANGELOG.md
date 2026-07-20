# Changelog

All notable changes to this portfolio are documented here.

## [Unreleased]

## [0.0.3] - 2026-07-20

### Changed

- Job achievement sections (`scrollable`) use a max-height scroll area so the Stack stays visible without scrolling the whole dialog
- Job Stack layout uses a 2-column grid on mobile (label stacked above chips)

### Fixed

- Desktop dialogs keep a column layout (`flex-direction` inherited) so title and body stack correctly

## [0.0.2] - 2026-07-20

### Added

- `/changelog` page rendering this file, linked from the navbar
- macOS-style command dock at the bottom of the terminal and on blog posts
- React Aria as the shadcn/ui component base (replacing Radix for core primitives)

### Fixed

- Terminal Tab no longer traps keyboard focus; autocomplete only steals Tab when a single command matches
- Skip link now moves focus into main content
- Mobile menu exposes `aria-expanded` / `aria-controls`
- Bitcoin ticker avoids double screen-reader announcements
- CV download errors are visible (not screen-reader-only)
- Command dock buttons use clearer accessible names

## [0.0.1] - 2026-07-20

### Added

- Interactive terminal home with command history, Tab completion, and job modals
- Blog list and MDX posts with locale support and SEO meta
- CV PDF download from the navbar
- Theme toggle, snowfall, and Bitcoin ticker
- Job write-ups as MDX (`jobs` / `work` / `experience` commands)
- Terminal command toolbar for quick actions

### Changed

- Blog list reads metadata from MDX frontmatter at build time
- Terminal typography tightened to `text-sm`

### Fixed

- Build/lint gate cleanup; dead code and unused deps removed
- Modal focus trap for terminal dialogs
