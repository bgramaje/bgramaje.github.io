import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  FileCode,
  Maximize2,
  Minimize2,
  Terminal,
  WrapText,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Highlight, type Language, themes } from "prism-react-renderer";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/app/theme-provider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

type CodeBlockVariant =
  | "default"
  | "terminal"
  | "minimal"
  | "gradient"
  | "glass";
type AnimationType = "none" | "fadeIn" | "slideIn" | "typewriter" | "highlight";
type ThemeType =
  | "terminal"
  | "oneDark"
  | "dracula"
  | "github"
  | "githubDark"
  | "nightOwl"
  | "oceanicNext"
  | "palenight"
  | "shadesOfPurple"
  | "synthwave84"
  | "vsDark"
  | "vsLight";

// ponytail: mirrors --code-* tokens in index.css — Prism needs literal color strings
const terminalTheme = {
  plain: {
    color: "oklch(1 0 0)",
    backgroundColor: "oklch(0.218 0 0)",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "oklch(0.627 0 0)" } },
    { types: ["punctuation"], style: { color: "oklch(0.83 0 0)" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol"], style: { color: "oklch(0.708 0 0)" } },
    { types: ["selector", "attr-name", "string", "char", "builtin", "inserted"], style: { color: "oklch(0.771 0 0)" } },
    { types: ["operator", "entity", "url", "variable"], style: { color: "oklch(0.83 0 0)" } },
    { types: ["atrule", "attr-value", "keyword", "function", "class-name"], style: { color: "oklch(1 0 0)" } },
    { types: ["regex", "important"], style: { color: "oklch(0.83 0 0)" } },
    { types: ["deleted"], style: { color: "oklch(0.627 0 0)" } },
  ],
};

const githubDarkTheme = {
  plain: {
    color: "oklch(0.857 0.014 247.992)",
    backgroundColor: "oklch(0.176 0.014 258.357)",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "oklch(0.662 0.018 250.922)" } },
    { types: ["keyword", "atrule"], style: { color: "oklch(0.734 0.163 25.784)" } },
    { types: ["function", "class-name"], style: { color: "oklch(0.801 0.127 305.856)" } },
    { types: ["number", "boolean", "constant", "symbol", "attr-name"], style: { color: "oklch(0.786 0.115 246.66)" } },
    { types: ["string", "char", "attr-value", "regex"], style: { color: "oklch(0.856 0.077 244.093)" } },
    { types: ["builtin", "inserted"], style: { color: "oklch(0.842 0.164 145.752)" } },
    { types: ["tag", "selector"], style: { color: "oklch(0.842 0.164 145.752)" } },
    { types: ["deleted"], style: { color: "oklch(0.801 0.113 25.812)" } },
  ],
};

// Theme mapping
const themeMap: Record<ThemeType, typeof themes.oneDark> = {
  terminal: terminalTheme as typeof themes.oneDark,
  oneDark: themes.oneDark,
  dracula: themes.dracula,
  github: themes.github,
  githubDark: githubDarkTheme as typeof themes.oneDark,
  nightOwl: themes.nightOwl,
  oceanicNext: themes.oceanicNext,
  palenight: themes.palenight,
  shadesOfPurple: themes.shadesOfPurple,
  synthwave84: themes.synthwave84,
  vsDark: themes.vsDark,
  vsLight: themes.vsLight,
};

// Supported languages list
const supportedLanguages = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "bash",
  "shell",
  "css",
  "scss",
  "html",
  "json",
  "yaml",
  "markdown",
  "sql",
  "graphql",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "scala",
  "r",
  "lua",
  "perl",
  "haskell",
  "elixir",
  "clojure",
  "dockerfile",
  "toml",
  "ini",
  "xml",
  "diff",
  "makefile",
  "regex",
] as const;

interface CodeBlockProps {
  code: string;
  language?: Language | string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
  variant?: CodeBlockVariant;
  animation?: AnimationType;
  animationDelay?: number;
  className?: string;
  copyable?: boolean;
  downloadable?: boolean;
  downloadFileName?: string;
  maxHeight?: string;
  theme?: ThemeType;
  wrapLongLines?: boolean;
  showLanguage?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  startingLineNumber?: number;
  caption?: string;
  showBorder?: boolean;
}

const codeBlockTooltipClass =
  "pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded border border-border/60 bg-popover px-2 py-1 text-popover-foreground text-xs shadow-sm opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100";

function CodeBlockActionButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      aria-label={label}
    >
      {children}
      <span className={codeBlockTooltipClass} role="tooltip">
        {label}
      </span>
    </motion.button>
  );
}

const iconSwapTransition = { type: "spring" as const, duration: 0.3, bounce: 0 };

// Copy button component
const CopyButton = ({
  code,
  className,
}: {
  code: string;
  className?: string;
}) => {
  const [copied, setCopied] = React.useState(false);
  const label = copied ? "Copied!" : "Copy code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <CodeBlockActionButton label={label} className={className} onClick={handleCopy}>
      <span className="relative flex h-4 w-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
              transition={iconSwapTransition}
            >
              <Check className="h-4 w-4 text-green-500" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
              transition={iconSwapTransition}
            >
              <Copy className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </CodeBlockActionButton>
  );
};

// Download button component
const DownloadButton = ({
  code,
  fileName,
  language,
}: {
  code: string;
  fileName?: string;
  language: string;
}) => {
  const handleDownload = () => {
    const extension = getFileExtension(language);
    const name = fileName || `code.${extension}`;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <CodeBlockActionButton label="Download code" onClick={handleDownload}>
      <Download className="h-4 w-4" />
    </CodeBlockActionButton>
  );
};

// Get file extension from language
const getFileExtension = (language: string): string => {
  const extensions: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    jsx: "jsx",
    tsx: "tsx",
    python: "py",
    bash: "sh",
    shell: "sh",
    css: "css",
    scss: "scss",
    html: "html",
    json: "json",
    yaml: "yml",
    markdown: "md",
    sql: "sql",
    graphql: "graphql",
    rust: "rs",
    go: "go",
    java: "java",
    c: "c",
    cpp: "cpp",
    csharp: "cs",
    php: "php",
    ruby: "rb",
    swift: "swift",
    kotlin: "kt",
    dockerfile: "dockerfile",
    toml: "toml",
    xml: "xml",
  };
  return extensions[language] || "txt";
};

// Language display names
const getLanguageDisplayName = (language: string): string => {
  const names: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    jsx: "JSX",
    tsx: "TSX",
    python: "Python",
    bash: "Bash",
    shell: "Shell",
    css: "CSS",
    scss: "SCSS",
    html: "HTML",
    json: "JSON",
    yaml: "YAML",
    markdown: "Markdown",
    sql: "SQL",
    graphql: "GraphQL",
    rust: "Rust",
    go: "Go",
    java: "Java",
    c: "C",
    cpp: "C++",
    csharp: "C#",
    php: "PHP",
    ruby: "Ruby",
    swift: "Swift",
    kotlin: "Kotlin",
    dockerfile: "Dockerfile",
    toml: "TOML",
    xml: "XML",
    diff: "Diff",
  };
  return (
    names[language] || language.charAt(0).toUpperCase() + language.slice(1)
  );
};

// Typewriter code animation component
const TypewriterCode = ({
  code,
  language,
  speed = 20,
  showLineNumbers,
  highlightLines = [],
  startingLineNumber = 1,
  theme,
}: {
  code: string;
  language: Language;
  speed?: number;
  showLineNumbers: boolean;
  highlightLines: number[];
  startingLineNumber: number;
  theme: typeof themes.oneDark;
}) => {
  const [displayedCode, setDisplayedCode] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex >= code.length) return;

    const timeout = setTimeout(() => {
      setDisplayedCode(code.slice(0, currentIndex + 1));
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, code, speed]);

  return (
    <div className="relative">
      <Highlight theme={theme} code={displayedCode || ""} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              className,
              "!bg-transparent font-mono text-sm leading-relaxed",
            )}
            style={{ ...style, background: "transparent" }}
          >
            {tokens.map((line, i) => {
              const lineNumber = i + startingLineNumber;
              const isHighlighted = highlightLines.includes(lineNumber);
              return (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className={cn(
                    "flex",
                    isHighlighted &&
                      "-mx-4 border-foreground border-l-2 bg-foreground/10 px-4",
                  )}
                >
                  {showLineNumbers && (
                    <span className="mr-4 inline-block w-8 shrink-0 select-none text-right text-muted-foreground/50">
                      {lineNumber}
                    </span>
                  )}
                  <span className="flex-1">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
      {currentIndex < code.length && (
        <motion.span
          className="absolute inline-block h-4 w-2 bg-foreground"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
};

// Main CodeBlock component
const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language = "typescript",
      title,
      showLineNumbers = true,
      highlightLines = [],
      addedLines = [],
      removedLines = [],
      variant = "default",
      animation = "none",
      animationDelay = 0,
      className,
      copyable = true,
      downloadable = false,
      downloadFileName,
      maxHeight,
      theme,
      wrapLongLines = false,
      showLanguage = true,
      collapsible = true,
      defaultCollapsed = false,
      startingLineNumber = 1,
      caption,
      showBorder = false,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(!defaultCollapsed);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [wordWrap, setWordWrap] = React.useState(wrapLongLines);
    const { resolved } = useTheme();
    const trimmedCode = code.trim();
    const selectedTheme = themeMap[theme ?? (resolved === "dark" ? "githubDark" : "github")];
    const codeSurfaceClass = resolved === "dark" ? "bg-[var(--code-background)] text-[var(--code-foreground)]" : "bg-card text-[var(--code-foreground-light)]";
    const codeHeaderClass = resolved === "dark" ? "bg-[var(--code-header)] text-[var(--code-foreground)]" : "bg-muted text-foreground";

    const borderClass = showBorder ? "border border-border shadow-sm" : "border-0 shadow-none";
    const headerBorderClass = showBorder ? "border-b border-border" : "border-b-0";

    const variantStyles: Record<CodeBlockVariant, string> = {
      default: `${codeSurfaceClass} ${borderClass}`,
      terminal: `${codeSurfaceClass} ${showBorder ? "border border-border shadow-lg" : "border-0 shadow-none"}`,
      minimal: "bg-muted/50 border-0 shadow-none",
      gradient: `bg-gradient-to-br from-card via-card to-primary/5 ${showBorder ? "border border-border shadow-md" : "border-0 shadow-none"}`,
      glass: `bg-card/80 backdrop-blur-xl ${showBorder ? "border border-border/50 shadow-xl" : "border-0 shadow-none"}`,
    };

    const headerStyles: Record<CodeBlockVariant, string> = {
      default: `${codeHeaderClass} ${headerBorderClass}`,
      terminal: `${codeHeaderClass} ${showBorder ? "border-b border-border" : "border-b-0"}`,
      minimal: showBorder ? "border-b border-border/50" : "border-b-0",
      gradient: `bg-muted/30 ${headerBorderClass}`,
      glass: `bg-muted/30 backdrop-blur-sm ${showBorder ? "border-b border-border/50" : "border-b-0"}`,
    };

    const containerAnimation = {
      fadeIn: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: animationDelay },
      },
      slideIn: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.4, delay: animationDelay },
      },
      highlight: {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, delay: animationDelay },
      },
      none: {
        initial: {},
        animate: {},
        transition: {},
      },
      typewriter: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      },
    };

    const currentAnimation =
      containerAnimation[animation] || containerAnimation.fadeIn;

    const headerRow = (
      <div
        className={cn(
          "flex items-center justify-between px-2 py-0.5 overflow-visible",
          headerStyles[variant],
          collapsible && "cursor-pointer select-none",
        )}
      >
        <div className="flex items-center gap-2">
          {/* Window controls */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80 transition-colors hover:bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80 transition-colors hover:bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500/80 transition-colors hover:bg-green-500" />
          </div>

          {/* Title or language */}
          <div className={cn(
            "flex items-center gap-1.5 text-sm",
            variant === "terminal" ? "text-muted-foreground" : "text-muted-foreground",
          )}>
            {variant === "terminal" ? (
              <Terminal className="h-3.5 w-3.5" />
            ) : (
              <FileCode className="h-4 w-4" />
            )}
            <span className="font-medium">
              {title || (showLanguage && getLanguageDisplayName(language))}
            </span>
          </div>
          {collapsible && (
            <span className="text-muted-foreground">
              {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="relative z-10 flex items-center gap-1 overflow-visible" onClick={(e) => e.stopPropagation()}>
          <CodeBlockActionButton
            label={wordWrap ? "Disable word wrap" : "Enable word wrap"}
            className={wordWrap ? "text-foreground" : undefined}
            onClick={() => setWordWrap(!wordWrap)}
          >
            <WrapText className="h-4 w-4" />
          </CodeBlockActionButton>

          <CodeBlockActionButton
            label={isExpanded ? "Minimize" : "Maximize"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </CodeBlockActionButton>

          {/* Download button */}
          {downloadable && (
            <DownloadButton
              code={trimmedCode}
              fileName={downloadFileName}
              language={language}
            />
          )}

          {/* Copy button */}
          {copyable && <CopyButton code={trimmedCode} />}
        </div>
      </div>
    );

    const codeContent = (
      <div
        className={cn(
          "overflow-auto rounded-b-lg p-0",
          wordWrap && "whitespace-pre-wrap break-words",
        )}
        style={maxHeight && !isExpanded ? { maxHeight } : undefined}
      >
              {animation === "typewriter" ? (
                <TypewriterCode
                  code={trimmedCode}
                  language={language as Language}
                  showLineNumbers={showLineNumbers}
                  highlightLines={highlightLines}
                  startingLineNumber={startingLineNumber}
                  theme={selectedTheme}
                />
              ) : (
                <Highlight
                  theme={selectedTheme}
                  code={trimmedCode}
                  language={language as Language}
                >
                  {({
                    className: preClassName,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre
                      className={cn(
                        preClassName,
                        "!bg-transparent text-sm leading-6 subpixel-antialiased [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace] [font-variant-ligatures:none]",
                      )}
                      style={{ ...style, background: "transparent" }}
                    >
                      {tokens.map((line, i) => {
                        const lineNumber = i + startingLineNumber;
                        const isHighlighted =
                          highlightLines.includes(lineNumber);
                        const isAdded = addedLines.includes(lineNumber);
                        const isRemoved = removedLines.includes(lineNumber);

                        return (
                          <motion.div
                            key={i}
                            {...getLineProps({ line })}
                            className={cn(
                              "flex",
                              isHighlighted &&
                                "-mx-4 border-foreground border-l-2 bg-foreground/10 px-4",
                              isAdded &&
                                "-mx-4 border-green-500 border-l-2 bg-green-500/10 px-4",
                              isRemoved &&
                                "-mx-4 border-red-500 border-l-2 bg-red-500/10 px-4 line-through opacity-60",
                            )}
                            initial={
                              animation === "slideIn"
                                ? { opacity: 0, x: -10 }
                                : animation === "highlight"
                                  ? {
                                      backgroundColor:
                                        "color-mix(in oklch, var(--primary) 20%, transparent)",
                                    }
                                  : {}
                            }
                            animate={
                              animation === "slideIn"
                                ? { opacity: 1, x: 0 }
                                : animation === "highlight"
                                  ? { backgroundColor: "transparent" }
                                  : {}
                            }
                            transition={{
                              duration: 0.3,
                              delay: animationDelay + i * 0.03,
                            }}
                          >
                            {showLineNumbers && (
                              <span className="mr-4 inline-block w-8 shrink-0 select-none text-right text-muted-foreground/50">
                                {isAdded && (
                                  <span className="mr-1 text-green-500">+</span>
                                )}
                                {isRemoved && (
                                  <span className="mr-1 text-red-500">-</span>
                                )}
                                {lineNumber}
                              </span>
                            )}
                            <span
                              className={cn("flex-1", wordWrap && "break-all")}
                            >
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </span>
                          </motion.div>
                        );
                      })}
                    </pre>
                  )}
                </Highlight>
              )}
      </div>
    );

    return (
      <motion.div
        ref={ref}
        className={cn(
          "not-typeset rounded-lg border-0 m-0",
          variantStyles[variant],
          className,
        )}
        initial={currentAnimation.initial}
        animate={currentAnimation.animate}
        transition={currentAnimation.transition}
      >
        {collapsible ? (
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              {headerRow}
            </CollapsibleTrigger>
            <CollapsibleContent>{codeContent}</CollapsibleContent>
          </Collapsible>
        ) : (
          <>
            {headerRow}
            {codeContent}
          </>
        )}

        {/* Caption */}
        {caption && (
          <div className="border-border border-t px-4 py-2 text-muted-foreground text-xs">
            {caption}
          </div>
        )}

        <ResponsiveDialog open={isExpanded} onOpenChange={setIsExpanded}>
          <ResponsiveDialogContent
            showHandle={false}
            className="h-[88dvh] w-full max-w-[min(1100px,94vw)] gap-0 overflow-hidden rounded-t-xl p-0 md:h-auto md:max-h-[90dvh] md:rounded-xl"
          >
            <div className={cn("flex items-center justify-between border-b border-border px-4 py-2", codeHeaderClass)}>
              <ResponsiveDialogTitle className="font-mono text-sm">
                {title || (showLanguage && getLanguageDisplayName(language)) || "Code"}
              </ResponsiveDialogTitle>
              <div className="flex items-center gap-1">
                <CodeBlockActionButton
                  label={wordWrap ? "Disable word wrap" : "Enable word wrap"}
                  className={wordWrap ? "text-foreground" : undefined}
                  onClick={() => setWordWrap(!wordWrap)}
                >
                  <WrapText className="h-4 w-4" />
                </CodeBlockActionButton>
                {copyable && <CopyButton code={trimmedCode} />}
              </div>
            </div>
            <div className={cn("max-h-[calc(90dvh-3rem)] overflow-auto p-3", codeSurfaceClass)}>
              {codeContent}
            </div>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      </motion.div>
    );
  },
);

CodeBlock.displayName = "CodeBlock";

export {
  CodeBlock,
  supportedLanguages,
  themeMap,
};
export type {
  AnimationType,
  CodeBlockProps,
  CodeBlockVariant,
  ThemeType,
};
