# Changelog

All notable changes to this portfolio are documented here.

## [Unreleased]

### Added

- `/changelog` page rendering this file, linked from the navbar
- macOS-style command dock (beUI) at the bottom of the terminal
- React Aria as the shadcn/ui component base (replacing Radix for core primitives)

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
