import type { ThemeRegistration } from "shiki";
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";

/** Mirrors --code-* tokens in index.css */
const portfolioDarkPalette = {
  bg: "oklch(0.176 0.014 258.357)",
  fg: "oklch(0.857 0.014 247.992)",
  comment: "oklch(0.662 0.018 250.922)",
  keyword: "oklch(0.734 0.163 25.784)",
  function: "oklch(0.801 0.127 305.856)",
  constant: "oklch(0.786 0.115 246.66)",
  string: "oklch(0.856 0.077 244.093)",
  tag: "oklch(0.842 0.164 145.752)",
  variable: "oklch(0.754 0.129 64.822)",
  punctuation: "oklch(0.83 0 0)",
} as const;

/** Readable on card / light surfaces (--code-foreground-light family) */
const portfolioLightPalette = {
  bg: "oklch(1 0 0)",
  fg: "oklch(0.279 0.013 253.036)",
  comment: "oklch(0.4 0 0)",
  keyword: "oklch(0.58 0.163 25.784)",
  function: "oklch(0.52 0.14 305.856)",
  constant: "oklch(0.48 0.12 246.66)",
  string: "oklch(0.42 0.09 244.093)",
  tag: "oklch(0.45 0.15 145.752)",
  variable: "oklch(0.5 0.12 64.822)",
  punctuation: "oklch(0.35 0 0)",
} as const;

type Palette = {
  bg: string;
  fg: string;
  comment: string;
  keyword: string;
  function: string;
  constant: string;
  string: string;
  tag: string;
  variable: string;
  punctuation: string;
};

function colorForScope(scope: string | string[] | undefined, palette: Palette): string | undefined {
  const s = Array.isArray(scope) ? scope.join(" ") : (scope ?? "");
  if (/comment|quote/.test(s)) return palette.comment;
  if (/keyword|storage\.type|storage\.modifier/.test(s)) return palette.keyword;
  if (/function|method|support\.function|entity\.name\.function/.test(s)) return palette.function;
  if (/string|regexp|attr-value/.test(s)) return palette.string;
  if (/tag|selector|entity\.name\.tag/.test(s)) return palette.tag;
  if (/constant|number|boolean|property|variable\.language|entity\.name\.constant/.test(s)) {
    return palette.constant;
  }
  if (/variable|parameter|builtin|support\.type|entity\.name\.type/.test(s)) return palette.variable;
  if (/punctuation|meta|separator|bracket/.test(s)) return palette.punctuation;
  return undefined;
}

function remapTheme(
  base: ThemeRegistration,
  name: string,
  type: "dark" | "light",
  palette: Palette,
): ThemeRegistration {
  return {
    ...base,
    name,
    type,
    colors: {
      ...base.colors,
      "editor.background": palette.bg,
      "editor.foreground": palette.fg,
    },
    tokenColors: (base.tokenColors ?? []).map((rule) => {
      const foreground = colorForScope(rule.scope, palette);
      if (!foreground) return rule;
      return {
        ...rule,
        settings: { ...rule.settings, foreground },
      };
    }),
  };
}

export const PORTFOLIO_DARK = "portfolio-dark";
export const PORTFOLIO_LIGHT = "portfolio-light";

export const portfolioDarkTheme = remapTheme(
  githubDark,
  PORTFOLIO_DARK,
  "dark",
  portfolioDarkPalette,
);

export const portfolioLightTheme = remapTheme(
  githubLight,
  PORTFOLIO_LIGHT,
  "light",
  portfolioLightPalette,
);

export const portfolioShikiThemes = [portfolioDarkTheme, portfolioLightTheme] as const;
