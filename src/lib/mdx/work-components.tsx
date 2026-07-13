import type React from "react";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/shared/Callout";
import { sharedMDXComponents } from "@/lib/mdx/shared-components";
import { WorkTitle } from "@/components/work/WorkTitle";
import { WorkTimerange } from "@/components/work/WorkTimerange";
import { WorkCompany } from "@/components/work/WorkCompany";
import { WorkHeader } from "@/components/work/WorkHeader";
import { WorkTitleBlock } from "@/components/work/WorkTitleBlock";
import { WorkTechnologies } from "@/components/work/WorkTechnologies";
import { WorkSummary } from "@/components/work/WorkSummary";
import { WorkSection } from "@/components/work/WorkSection";
import { WorkAchievement } from "@/components/work/WorkAchievement";

/** MDX components for job/work MDX content: custom components only.
 *  Base typography is handled by the `typeset` wrapper around the content. */
export function useMDXWorkComponents(components: MDXComponents): MDXComponents {
  return {
    ...sharedMDXComponents(),
    Callout: (props: React.ComponentProps<typeof Callout>) => (
      <div className="my-1.5 mt-3 md:mt-4">
        <Callout {...props} />
      </div>
    ),
    WorkTitle,
    WorkTimerange,
    WorkCompany,
    WorkHeader,
    WorkTitleBlock,
    WorkTechnologies,
    WorkSummary,
    WorkSection,
    WorkAchievement,
    ...components,
  };
}
