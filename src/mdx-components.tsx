import type { MDXComponents } from "mdx/types";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import type { MermaidProps } from "mdx-mermaid/lib/Mermaid";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/ui/code-block";
import { Highlighter } from "@/components/ui/highlighter";

function isInlineCode(className?: string) {
  // En MDX, los inline code normalmente no traen language-xxx
  return !className || !/language-\w+/.test(className);
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 className="text-terminal-success font-bold font-mono text-[42px] leading-tight mb-3 mt-2 md:mt-3" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-slate-100 font-mono font-bold text-[15px] md:text-[17px] mt-5 mb-2 md:mt-6 md:mb-3 uppercase tracking-tight first:mt-3 md:first:mt-4" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-terminal-cyan font-medium text-xs md:text-sm mb-0.5 mt-1.5 font-sans" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-white font-medium text-xs md:text-sm my-1.5 text-justify font-sans" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h4 className="text-terminal-text font-regular text-xs md:text-sm my-1.5 text-justify font-sans" {...props}>
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p className="text-terminal-text text-xs md:text-sm leading-relaxed text-justify mb-1.5 md:mb-2 font-sans" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside text-terminal-text text-xs md:text-sm mb-1.5 space-y-0.5 pl-2 md:pl-3 pt-0.5 font-sans" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside text-terminal-text text-xs md:text-sm mb-1.5 space-y-0.5 pl-2 md:pl-3 pt-0.5 font-sans" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-terminal-text text-xs md:text-sm font-sans" {...props}>
        {children}
      </li>
    ),
    table: ({ children, ...props }) => (
      <div className="mdx-table-wrapper my-2 md:my-3 overflow-x-auto rounded-lg border border-terminal-border/60">
        <table className="w-full border-collapse text-left font-sans text-[11px] md:text-xs" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="text-neutral-100 border-b border-terminal-border/50" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="text-terminal-text" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="mdx-table-row hover:bg-terminal-border/20 transition-colors" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th className="px-2 py-1.5 md:px-3 md:py-2 font-semibold text-neutral-200 whitespace-nowrap border-r border-terminal-border/50 last:border-r-0" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-2 py-1.5 md:px-3 md:py-2 border-r border-terminal-border/50 last:border-r-0" {...props}>
        {children}
      </td>
    ),
    // Un solo sitio para "layout" de bloques de código: el <pre>
    pre: ({ children, ...props }) => (
      <div className="mb-1.5 md:mb-2 overflow-x-auto -mx-2 md:mx-0">
        <pre
          {...props}
          className={[
            "!m-0 p-2 md:p-4 text-[10px] md:text-xs leading-relaxed border-2 rounded-lg",
            // opcional: si quieres fijar fondo aquí y no en hljs theme
            // "bg-terminal-bg",
          ].join(" ")}
          style={{
            borderColor: "rgb(30 30 46 / var(--tw-border-opacity, 1))",
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          }}
        >
          {children}
        </pre>
      </div>
    ),
    // Inline code: estilo; Code block: no tocar (rehype-highlight manda)
    code: ({ className, children, ...props }) => {
      if (isInlineCode(className)) {
        return (
          <code
            className="px-1 py-0.5 bg-terminal-bg border border-terminal-border text-terminal-accent text-[10px] md:text-xs rounded-lg font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-terminal-accent pl-2 md:pl-3 italic text-terminal-muted text-xs md:text-sm mb-1.5 my-1.5 md:my-2 font-sans rounded-r-lg"
        {...props}
      >
        {children}
      </blockquote>
    ),
    a: ({ children, ...props }) => (
      <a className="text-terminal-accent hover:underline text-xs md:text-sm font-sans" target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
    img: (props) => <img className="my-2 md:my-3 rounded-xl max-w-full" {...props} />,
    hr: () => (
      <hr className="border-0 h-px my-4 md:my-5 bg-gradient-to-r from-transparent via-terminal-border/40 to-transparent max-w-[120px] mx-auto" aria-hidden />
    ),
    // Mermaid: card-style container + overflow for wide diagrams
    mermaid: (props: MermaidProps) => (
      <div className="my-2 md:my-4 overflow-x-auto rounded-xl border-2 border-terminal-border bg-terminal-bg/60 p-4 md:p-5 shadow-inner">
        <div className="flex justify-center min-w-0 [&_.mermaid]:max-w-full">
          <Mermaid chart={props.chart} />
        </div>
      </div>
    ),
    // Callout component for MDX
    Callout: (props: React.ComponentProps<typeof Callout>) => (
      <div className="my-1.5 mt-4 md:mt-6">
        <Callout {...props} />
      </div>
    ),
    // Magic UI Highlighter — use in MDX: <Highlighter action="highlight" color="#87CEFA">text</Highlighter>
    Highlighter,
    // Joly UI CodeBlock — use in MDX: <CodeBlock code={...} language="tsx" variant="terminal" />
    CodeBlock,
    ...components,
  };
}
