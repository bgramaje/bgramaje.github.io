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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  | "nightOwl"
  | "oceanicNext"
  | "palenight"
  | "shadesOfPurple"
  | "synthwave84"
  | "vsDark"
  | "vsLight";

// Terminal theme — matches site palette (terminal-*)
const terminalTheme = {
  plain: {
    color: "#ffffff",
    backgroundColor: "#1a1a1a",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#888888" } },
    { types: ["punctuation"], style: { color: "#cccccc" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol"], style: { color: "#aaaaaa" } },
    { types: ["selector", "attr-name", "string", "char", "builtin", "inserted"], style: { color: "#bbbbbb" } },
    { types: ["operator", "entity", "url", "variable"], style: { color: "#cccccc" } },
    { types: ["atrule", "attr-value", "keyword", "function", "class-name"], style: { color: "#ffffff" } },
    { types: ["regex", "important"], style: { color: "#cccccc" } },
    { types: ["deleted"], style: { color: "#888888" } },
  ],
};

// Theme mapping
const themeMap: Record<ThemeType, typeof themes.oneDark> = {
  terminal: terminalTheme as typeof themes.oneDark,
  oneDark: themes.oneDark,
  dracula: themes.dracula,
  github: themes.github,
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

// Copy button component
const CopyButton = ({
  code,
  className,
}: {
  code: string;
  className?: string;
}) => {
  const [copied, setCopied] = React.useState(false);

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
    <motion.button
      onClick={handleCopy}
      className={cn(
        "rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={copied ? "Copied!" : "Copy code"}
      title={copied ? "Copied!" : "Copy code"}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-4 w-4 text-green-500" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
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
    <motion.button
      onClick={handleDownload}
      className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Download code"
      title="Download code"
    >
      <Download className="h-4 w-4" />
    </motion.button>
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
                      "-mx-4 border-zinc-900 border-l-2 bg-zinc-900/10 px-4 dark:border-zinc-50 dark:bg-zinc-50/10",
                  )}
                >
                  {showLineNumbers && (
                    <span className="mr-4 inline-block w-8 shrink-0 select-none text-right text-zinc-500/50 dark:text-zinc-400/50">
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
          className="absolute inline-block h-4 w-2 bg-zinc-900 dark:bg-zinc-50"
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
      animation = "fadeIn",
      animationDelay = 0,
      className,
      copyable = true,
      downloadable = false,
      downloadFileName,
      maxHeight,
      theme = "oneDark",
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
    const trimmedCode = code.trim();
    const selectedTheme = themeMap[theme] || themes.oneDark;

    const borderClass = showBorder ? "border border-zinc-200 shadow-sm dark:border-zinc-800" : "border-0 shadow-none";
    const headerBorderClass = showBorder ? "border-b border-zinc-200 dark:border-zinc-800" : "border-b-0";

    const variantStyles: Record<CodeBlockVariant, string> = {
      default: `bg-white dark:bg-zinc-950 ${borderClass}`,
      terminal: `bg-terminal-surface ${showBorder ? "border border-terminal-border shadow-lg" : "border-0 shadow-none"}`,
      minimal: "bg-zinc-100/50 dark:bg-zinc-800/50 border-0 shadow-none",
      gradient: `bg-gradient-to-br from-card via-card to-primary/5 dark:border-zinc-800 ${showBorder ? "border border-zinc-200 shadow-md dark:border-zinc-800" : "border-0 shadow-none"}`,
      glass: `bg-white/80 backdrop-blur-xl dark:bg-zinc-950/80 dark:border-zinc-800/50 ${showBorder ? "border border-zinc-200 border-zinc-200/50 shadow-xl dark:border-zinc-800 dark:border-zinc-800/50" : "border-0 shadow-none"}`,
    };

    const headerStyles: Record<CodeBlockVariant, string> = {
      default: `bg-zinc-100/50 dark:bg-zinc-800/50 ${headerBorderClass}`,
      terminal: `bg-terminal-bg ${showBorder ? "border-b border-terminal-border" : "border-b-0"}`,
      minimal: `dark:border-zinc-800/50 ${showBorder ? "border-b border-zinc-200/50 dark:border-zinc-800/50" : "border-b-0"}`,
      gradient: `bg-zinc-100/30 dark:bg-zinc-800/30 ${headerBorderClass}`,
      glass: `bg-zinc-100/30 backdrop-blur-sm dark:bg-zinc-800/30 ${showBorder ? "border-b border-zinc-200/50 dark:border-zinc-800/50" : "border-b-0"}`,
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
          "flex items-center justify-between px-2 py-0.5",
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
            variant === "terminal" ? "text-terminal-muted" : "text-zinc-500 dark:text-zinc-400",
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
            <span className="text-zinc-500 dark:text-zinc-400">
              {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Word wrap toggle */}
          <motion.button
            onClick={() => setWordWrap(!wordWrap)}
            className={cn(
              "rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
              wordWrap
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle word wrap"
            title="Toggle word wrap"
          >
            <WrapText className="h-4 w-4" />
          </motion.button>

          {/* Expand toggle */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isExpanded ? "Minimize" : "Maximize"}
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </motion.button>

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
          "overflow-auto p-1.5",
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
                        "!bg-transparent font-mono text-sm leading-relaxed",
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
                                "-mx-4 border-zinc-900 border-l-2 bg-zinc-900/10 px-4 dark:border-zinc-50 dark:bg-zinc-50/10",
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
                                        "hsl(var(--primary) / 0.2)",
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
                              <span className="mr-4 inline-block w-8 shrink-0 select-none text-right text-zinc-500/50 dark:text-zinc-400/50">
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
          "overflow-hidden rounded-lg mt-5 md:mt-6 mb-5 md:mb-6 border-2 border-neutral-500/80",
          variantStyles[variant],
          isExpanded && "fixed inset-4 z-50",
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
          <div className="border-zinc-200 border-t px-4 py-2 text-zinc-500 text-xs dark:border-zinc-800 dark:text-zinc-400">
            {caption}
          </div>
        )}
      </motion.div>
    );
  },
);

CodeBlock.displayName = "CodeBlock";

// Inline code component
interface InlineCodeProps {
  children: string;
  className?: string;
  variant?: "default" | "primary" | "success" | "warning" | "error";
}

const InlineCode = React.forwardRef<HTMLSpanElement, InlineCodeProps>(
  ({ children, className, variant = "default" }, ref) => {
    const variantStyles: Record<string, string> = {
      default: "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50",
      primary: "bg-zinc-900/10 text-zinc-900 dark:bg-zinc-50/10 dark:text-zinc-50",
      success: "bg-green-500/10 text-green-600 dark:text-green-400",
      warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      error: "bg-red-500/10 text-red-600 dark:text-red-400",
    };

    return (
      <code
        ref={ref}
        className={cn(
          "rounded-md px-1.5 py-0.5 font-mono text-sm",
          variantStyles[variant],
          className,
        )}
      >
        {children}
      </code>
    );
  },
);

InlineCode.displayName = "InlineCode";

// Code comparison component
interface CodeCompareProps {
  before: string;
  after: string;
  language?: string;
  beforeTitle?: string;
  afterTitle?: string;
  className?: string;
  theme?: ThemeType;
  showDiff?: boolean;
}

const CodeCompare = React.forwardRef<HTMLDivElement, CodeCompareProps>(
  (
    {
      before,
      after,
      language = "typescript",
      beforeTitle = "Before",
      afterTitle = "After",
      className,
      theme = "oneDark",
      showDiff = false,
    },
    ref,
  ) => {
    // Simple diff calculation for line additions/removals
    const beforeLines = before.trim().split("");
    const afterLines = after.trim().split("");

    const removedLines = showDiff
      ? beforeLines
          .map((_, i) => i + 1)
          .filter(
            (_, i) => beforeLines[i] && !afterLines.includes(beforeLines[i]),
          )
      : [];
    const addedLines = showDiff
      ? afterLines
          .map((_, i) => i + 1)
          .filter(
            (_, i) => afterLines[i] && !beforeLines.includes(afterLines[i]),
          )
      : [];

    return (
      <div ref={ref} className={cn("grid gap-4 md:grid-cols-2", className)}>
        <CodeBlock
          code={before}
          language={language}
          title={beforeTitle}
          variant="default"
          animation="slideIn"
          theme={theme}
          removedLines={removedLines}
        />
        <CodeBlock
          code={after}
          language={language}
          title={afterTitle}
          variant="gradient"
          animation="slideIn"
          animationDelay={0.2}
          theme={theme}
          addedLines={addedLines}
        />
      </div>
    );
  },
);

CodeCompare.displayName = "CodeCompare";

// Animated code tabs
interface CodeTabsProps {
  tabs: Array<{
    label: string;
    code: string;
    language?: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
  theme?: ThemeType;
  defaultTab?: number;
}

const CodeTabs = React.forwardRef<HTMLDivElement, CodeTabsProps>(
  ({ tabs, className, theme = "oneDark", defaultTab = 0 }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultTab);

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
          className,
        )}
      >
        {/* Tab headers */}
        <div className="flex overflow-x-auto border-zinc-200 border-b bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-800/50">
          {tabs.map((tab, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap px-4 py-2.5 font-medium text-sm transition-colors",
                activeTab === index
                  ? "border-zinc-900 border-b-2 bg-white/50 text-zinc-900 dark:border-zinc-50 dark:bg-zinc-950/50 dark:text-zinc-50"
                  : "text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50",
              )}
              whileHover={{
                backgroundColor:
                  activeTab === index ? undefined : "hsl(var(--muted) / 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CodeBlock
              code={tabs[activeTab]?.code || ""}
              language={tabs[activeTab]?.language || "typescript"}
              showLineNumbers={true}
              variant="minimal"
              animation="none"
              copyable={true}
              className="rounded-none border-0"
              theme={theme}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  },
);

CodeTabs.displayName = "CodeTabs";

// Terminal/Command component
interface TerminalBlockProps {
  commands: Array<{
    command: string;
    output?: string;
  }>;
  title?: string;
  className?: string;
  animated?: boolean;
}

const TerminalBlock = React.forwardRef<HTMLDivElement, TerminalBlockProps>(
  ({ commands, title = "Terminal", className, animated = true }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg border border-zinc-200 bg-[#1a1b26] shadow-lg dark:border-zinc-800",
          className,
        )}
        initial={animated ? { opacity: 0, y: 20 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-zinc-200 border-b bg-[#16161e] px-4 py-2 dark:border-zinc-800">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-sm dark:text-zinc-400">
            <Terminal className="h-4 w-4" />
            <span>{title}</span>
          </div>
        </div>

        {/* Commands */}
        <div className="p-4 font-mono text-sm">
          {commands.map((item, index) => (
            <motion.div
              key={index}
              initial={animated ? { opacity: 0, x: -10 } : {}}
              animate={animated ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="mb-2 last:mb-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400">$</span>
                <span className="text-zinc-950 dark:text-zinc-50">{item.command}</span>
              </div>
              {item.output && (
                <div className="mt-1 whitespace-pre-wrap pl-4 text-zinc-500 dark:text-zinc-400">
                  {item.output}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  },
);

TerminalBlock.displayName = "TerminalBlock";

export {
  CodeBlock,
  CodeCompare,
  CodeTabs,
  InlineCode,
  supportedLanguages,
  TerminalBlock,
  themeMap,
};
export type {
  AnimationType,
  CodeBlockProps,
  CodeBlockVariant,
  CodeCompareProps,
  CodeTabsProps,
  InlineCodeProps,
  TerminalBlockProps,
  ThemeType,
};
