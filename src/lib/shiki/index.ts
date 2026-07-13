import type { Highlighter, ShikiTransformer } from "shiki";
import { SHIKI_LANGS, type CodeBlockTheme } from "@/lib/shiki/config";
import { portfolioShikiThemes, PORTFOLIO_DARK, PORTFOLIO_LIGHT } from "@/lib/shiki/themes";

export type { CodeBlockTheme };

const LANG_ALIASES: Record<string, string> = {
  shell: "bash",
  makefile: "make",
};

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then(({ createHighlighter }) =>
      createHighlighter({
        themes: [...portfolioShikiThemes],
        langs: [...SHIKI_LANGS],
      }),
    );
  }
  return highlighterPromise;
}

function normalizeLang(language: string): string {
  return LANG_ALIASES[language] ?? language;
}

function transformerLineNumbers(
  startLine: number,
  enabled: boolean,
): ShikiTransformer {
  if (!enabled) return { name: "line-numbers-off" };
  return {
    name: "line-numbers",
    line(node, line) {
      node.children.unshift({
        type: "element",
        tagName: "span",
        properties: { className: ["code-line-number"], ariaHidden: "true" },
        children: [{ type: "text", value: String(startLine + line - 1) }],
      });
    },
  };
}

async function lineClassTransformers(options: {
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
}): Promise<ShikiTransformer[]> {
  const lineOptions = [
    ...(options.highlightLines ?? []).map((line) => ({
      line,
      classes: ["line-highlight"],
    })),
    ...(options.addedLines ?? []).map((line) => ({
      line,
      classes: ["line-add"],
    })),
    ...(options.removedLines ?? []).map((line) => ({
      line,
      classes: ["line-remove"],
    })),
  ];
  if (lineOptions.length === 0) return [];
  const { transformerCompactLineOptions } = await import("@shikijs/transformers");
  return [transformerCompactLineOptions(lineOptions)];
}

export interface HighlightCodeOptions {
  code: string;
  language: string;
  theme?: CodeBlockTheme;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
}

export async function highlightCode(options: HighlightCodeOptions): Promise<string> {
  const {
    code,
    language,
    theme,
    showLineNumbers = false,
    startingLineNumber = 1,
    highlightLines = [],
    addedLines = [],
    removedLines = [],
  } = options;

  const hl = await getHighlighter();
  const lang = normalizeLang(language);
  const { transformerRemoveLineBreak } = await import("@shikijs/transformers");
  const transformers: ShikiTransformer[] = [
    transformerLineNumbers(startingLineNumber, showLineNumbers),
    ...(await lineClassTransformers({ highlightLines, addedLines, removedLines })),
    transformerRemoveLineBreak(),
  ];

  if (theme) {
    return hl.codeToHtml(code, {
      lang,
      theme: theme === "light" ? PORTFOLIO_LIGHT : PORTFOLIO_DARK,
      transformers,
    });
  }

  return hl.codeToHtml(code, {
    lang,
    themes: {
      light: PORTFOLIO_LIGHT,
      dark: PORTFOLIO_DARK,
    },
    defaultColor: false,
    transformers,
  });
}
