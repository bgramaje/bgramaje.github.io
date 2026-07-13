import { lazy, Suspense, type ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/shared/Callout";
import { Highlighter } from "@/components/ui/highlighter";
import { PublishedBlock } from "@/components/shared/PublishedBlock";

const LazyCodeBlock = lazy(() =>
  import("@/components/ui/code-block").then((m) => ({ default: m.CodeBlock })),
);

function CodeBlockFallback({ code }: { code: string }) {
  return (
    <pre className="not-typeset overflow-auto rounded-lg border border-border bg-[var(--code-background)] p-3 font-mono text-sm text-[var(--code-foreground)]">
      <code>{code}</code>
    </pre>
  );
}

function MDXCodeBlock(props: ComponentProps<typeof LazyCodeBlock>) {
  return (
    <Suspense fallback={<CodeBlockFallback code={props.code} />}>
      <LazyCodeBlock {...props} />
    </Suspense>
  );
}

export function sharedMDXComponents(): MDXComponents {
  return {
    Callout,
    Highlighter,
    CodeBlock: MDXCodeBlock,
    PublishedBlock,
  };
}
