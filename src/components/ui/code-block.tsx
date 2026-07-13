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
import * as React from "react";
import { useTheme } from "@/app/theme-provider";
import { cn } from "@/lib/utils";
import { highlightCode, type CodeBlockTheme } from "@/lib/shiki";
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

interface CodeBlockProps {
  code: string;
  language?: string;
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
  theme?: CodeBlockTheme;
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

// Shiki output (build-time fences + client CodeBlock share highlightCode)
function ShikiHighlighted({
  code,
  language,
  theme,
  showLineNumbers,
  startingLineNumber,
  highlightLines,
  addedLines,
  removedLines,
  animation,
  wordWrap,
  typewriterSpeed = 20,
}: {
  code: string;
  language: string;
  theme?: CodeBlockTheme;
  showLineNumbers: boolean;
  startingLineNumber: number;
  highlightLines: number[];
  addedLines: number[];
  removedLines: number[];
  animation: AnimationType;
  wordWrap: boolean;
  typewriterSpeed?: number;
}) {
  const [html, setHtml] = React.useState<string | null>(null);
  const [typewriterIndex, setTypewriterIndex] = React.useState(
    animation === "typewriter" ? 0 : code.length,
  );
  const typewriterDone = animation !== "typewriter" || typewriterIndex >= code.length;
  const source = typewriterDone ? code : code.slice(0, typewriterIndex);

  React.useEffect(() => {
    if (animation !== "typewriter" || typewriterDone) return;
    const timeout = setTimeout(() => {
      setTypewriterIndex((prev) => prev + 1);
    }, typewriterSpeed);
    return () => clearTimeout(timeout);
  }, [animation, typewriterDone, typewriterSpeed, typewriterIndex]);

  React.useEffect(() => {
    if (!typewriterDone) return;
    let cancelled = false;
    void highlightCode({
      code: source,
      language,
      theme,
      showLineNumbers,
      startingLineNumber,
      highlightLines,
      addedLines,
      removedLines,
    }).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [
    addedLines,
    highlightLines,
    language,
    removedLines,
    showLineNumbers,
    source,
    startingLineNumber,
    theme,
    typewriterDone,
  ]);

  if (!typewriterDone) {
    return (
      <div className="relative font-mono text-sm leading-relaxed">
        <pre className="!bg-transparent whitespace-pre-wrap break-words">
          <code>{source}</code>
        </pre>
        <motion.span
          className="absolute inline-block h-4 w-2 bg-foreground"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
    );
  }

  if (!html) {
    return (
      <pre className="!bg-transparent font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className={cn("code-block-shiki", wordWrap && "whitespace-pre-wrap break-words")}
      // ponytail: Shiki returns trusted build-time / self-generated HTML only
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

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
        <ShikiHighlighted
          code={trimmedCode}
          language={language}
          theme={theme}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          highlightLines={highlightLines}
          addedLines={addedLines}
          removedLines={removedLines}
          animation={animation}
          wordWrap={wordWrap}
        />
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

export { CodeBlock };
export type {
  AnimationType,
  CodeBlockProps,
  CodeBlockVariant,
  CodeBlockTheme,
};
