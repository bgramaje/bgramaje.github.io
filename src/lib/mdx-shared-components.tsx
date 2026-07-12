import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/shared/Callout";
import { Highlighter } from "@/components/ui/highlighter";
import { CodeBlock } from "@/components/ui/code-block";
import { PublishedBlock } from "@/components/shared/PublishedBlock";

export function sharedMDXComponents(): MDXComponents {
  return {
    Callout,
    Highlighter,
    CodeBlock,
    PublishedBlock,
  };
}
