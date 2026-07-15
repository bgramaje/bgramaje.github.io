import type { RehypeShikiOptions } from "@shikijs/rehype";
import { transformerRemoveLineBreak } from "@shikijs/transformers";
import {
  portfolioDarkTheme,
  portfolioLightTheme,
} from "@/lib/shiki/themes";

export const SHIKI_DUAL_THEMES = {
  light: portfolioLightTheme,
  dark: portfolioDarkTheme,
} as const;

export const SHIKI_LANGS = [
  "bash",
  "c",
  "clojure",
  "cpp",
  "csharp",
  "css",
  "diff",
  "dockerfile",
  "elixir",
  "go",
  "graphql",
  "haskell",
  "html",
  "ini",
  "java",
  "javascript",
  "json",
  "jsx",
  "kotlin",
  "lua",
  "make",
  "markdown",
  "perl",
  "php",
  "python",
  "r",
  "regex",
  "ruby",
  "rust",
  "scala",
  "scss",
  "shell",
  "sql",
  "swift",
  "toml",
  "tsx",
  "typescript",
  "xml",
  "yaml",
] as const;

/** Force a single Shiki theme; omit to follow site light/dark via dual themes */
export type CodeBlockTheme = "dark" | "light";

export const rehypeShikiOptions: RehypeShikiOptions = {
  themes: SHIKI_DUAL_THEMES,
  defaultColor: false,
  langs: [...SHIKI_LANGS],
  langAlias: {
    shell: "bash",
    makefile: "make",
  },
  transformers: [transformerRemoveLineBreak()],
};
