import type { MDXComponents } from "mdx/types";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import type { MermaidProps } from "mdx-mermaid/lib/Mermaid";
import { Callout } from "@/components/Callout";
import { MermaidConfig } from "mermaid";

function isInlineCode(className?: string) {
  // En MDX, los inline code normalmente no traen language-xxx
  return !className || !/language-\w+/.test(className);
}

const mermaidConfig = {
  theme: "base",
  themeVariables: {
    actorBkg: "#e8f0ff",
    actorBorder: "#2b5cff",
    actorTextColor: "#0b1b3a",
    actorLineColor: "#2b5cff",
  },
} as MermaidConfig;


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 className="text-terminal-success font-bold font-mono text-sm md:text-base mb-2 mt-3 md:mt-4" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-white font-semibold text-[14px] md:text-[16px] my-3 md:my-4 font-sans" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-terminal-cyan font-medium text-xs md:text-sm mb-1 mt-2 font-sans" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-white font-medium text-xs md:text-sm my-2 text-justify font-sans" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h4 className="text-terminal-text font-regular text-xs md:text-sm my-2 text-justify font-sans" {...props}>
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p className="text-terminal-text text-xs md:text-sm leading-relaxed text-justify mb-2 md:mb-3 font-sans" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside text-terminal-text text-xs md:text-sm mb-2 space-y-1 pl-2 md:pl-3 pt-1 font-sans" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside text-terminal-text text-xs md:text-sm mb-2 space-y-1 pl-2 md:pl-3 pt-1 font-sans" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-terminal-text text-xs md:text-sm font-sans" {...props}>
        {children}
      </li>
    ),
    // Un solo sitio para "layout" de bloques de código: el <pre>
    pre: ({ children, ...props }) => (
      <div className="mb-2 md:mb-3 overflow-x-auto -mx-2 md:mx-0">
        <pre
          {...props}
          className={[
            "!m-0 p-2 md:p-4 text-[10px] md:text-xs leading-relaxed border-2 rounded-[0.35rem]",
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
            className="px-1 py-0.5 bg-terminal-bg border border-terminal-border text-terminal-accent text-[10px] md:text-xs rounded font-mono"
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
        className="border-l-4 border-terminal-accent pl-2 md:pl-3 italic text-terminal-muted text-xs md:text-sm mb-2 my-2 md:my-3 font-sans"
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
    img: (props) => <img className="my-3 md:my-4 rounded-lg max-w-full" {...props} />,
    // Mermaid aislado: no pasa por pre/code
    mermaid: (props: MermaidProps) => (
      <div className="my-3 md:my-4 overflow-x-auto">
        <Mermaid chart={props.chart} config={{ mermaid: mermaidConfig }} />
      </div>
    ),
    // Callout component for MDX
    Callout: (props: React.ComponentProps<typeof Callout>) => (
      <div className="my-2 mt-6 md:mt-10">
        <Callout {...props} />
      </div>
    ),
    ...components,
  };
}
