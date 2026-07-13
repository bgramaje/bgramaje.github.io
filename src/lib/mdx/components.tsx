import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/shared/Callout";
import { sharedMDXComponents } from "@/lib/mdx/shared-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...sharedMDXComponents(),
    // Callout component for MDX
    Callout: (props: React.ComponentProps<typeof Callout>) => (
      <div className="my-1.5 mt-4 md:mt-6">
        <Callout {...props} />
      </div>
    ),
    ...components,
  };
}
