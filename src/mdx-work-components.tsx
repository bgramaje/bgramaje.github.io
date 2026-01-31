import type React from "react";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/ui/code-block";
import { Highlighter } from "@/components/ui/highlighter";
import { WorkTitle } from "@/components/work/WorkTitle";
import { WorkTimerange } from "@/components/work/WorkTimerange";
import { WorkCompany } from "@/components/work/WorkCompany";
import { WorkHeader } from "@/components/work/WorkHeader";
import { WorkTitleBlock } from "@/components/work/WorkTitleBlock";
import { WorkTechnologies } from "@/components/work/WorkTechnologies";

function isInlineCode(className?: string) {
  return !className || !/language-\w+/.test(className);
}

/** MDX components for job/work MDX content: smaller headers, same prose + Highlighter/Callout/CodeBlock */
export function useMDXWorkComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1
        className="text-white font-bold font-mono text-lg md:text-xl leading-tight mb-2 mt-0 md:mt-1"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-slate-100 font-mono font-semibold text-sm md:text-[15px] mt-4 mb-1.5 md:mt-5 md:mb-2 uppercase tracking-tight first:mt-2 md:first:mt-3"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-terminal-cyan font-medium text-xs md:text-sm mb-0.5 mt-1.5 font-sans" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-white font-medium text-xs md:text-sm my-1 text-justify font-sans" {...props}>
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
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-terminal-text" {...props}>
        {children}
      </strong>
    ),
    pre: ({ children, ...props }) => (
      <div className="mb-1.5 md:mb-2 overflow-x-auto -mx-2 md:mx-0">
        <pre
          {...props}
          className="!m-0 p-2 md:p-4 text-[10px] md:text-xs leading-relaxed border-2 rounded-lg"
          style={{
            borderColor: "rgb(30 30 46 / var(--tw-border-opacity, 1))",
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          }}
        >
          {children}
        </pre>
      </div>
    ),
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
      return <code className={className} {...props}>{children}</code>;
    },
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-terminal-accent pl-2 md:pl-3 italic text-terminal-muted text-xs md:text-sm mb-1.5 my-1.5 md:my-2 font-sans rounded-r"
        {...props}
      >
        {children}
      </blockquote>
    ),
    a: ({ children, ...props }) => (
      <a className="text-terminal-cyan hover:underline text-xs md:text-sm font-sans" target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
    hr: () => (
      <hr className="border-0 h-px my-3 md:my-4 bg-gradient-to-r from-transparent via-terminal-border/40 to-transparent max-w-[80px]" aria-hidden />
    ),
    Callout: (props: React.ComponentProps<typeof Callout>) => (
      <div className="my-1.5 mt-3 md:mt-4">
        <Callout {...props} />
      </div>
    ),
    Highlighter,
    CodeBlock,
    WorkTitle,
    WorkTimerange,
    WorkCompany,
    WorkHeader,
    WorkTitleBlock,
    WorkTechnologies,
    ...components,
  };
}
