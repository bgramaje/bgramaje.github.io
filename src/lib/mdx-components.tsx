import type { MDXComponents } from "mdx/types";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import type { MermaidProps } from "mdx-mermaid/lib/Mermaid";
import { Callout } from "@/components/shared/Callout";
import { sharedMDXComponents } from "@/lib/mdx-shared-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...sharedMDXComponents(),
    // Mermaid: card-style container + overflow for wide diagrams
    mermaid: (props: MermaidProps) => (
      <div className="my-2 md:my-4 overflow-x-auto rounded-xl border-2 border-border bg-background/60 p-4 md:p-5 shadow-inner">
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
    ...components,
  };
}
