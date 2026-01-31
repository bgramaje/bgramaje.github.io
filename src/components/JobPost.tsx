import { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { useMDXWorkComponents } from "@/mdx-work-components";
import { loadJobContent } from "@/lib/jobLoader";

interface JobPostProps {
  id: string;
}

export function JobPost({ id }: JobPostProps) {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const components = useMDXWorkComponents({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadJobContent(id)
      .then((module) => {
        if (!cancelled) setMDXContent(() => module.default);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const wrapperClass = "space-y-2 pr-0 md:pr-2 pl-0 md:pl-2 font-sans";
  const proseClass = "prose prose-invert prose-sm max-w-none relative";

  if (loading) {
    return (
      <div className={wrapperClass}>
        <div className="flex items-center gap-2 py-6 text-terminal-muted text-sm">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-terminal-border border-t-terminal-accent" />
          Loading…
        </div>
      </div>
    );
  }

  if (error || !MDXContent) {
    return (
      <div className={wrapperClass}>
        <p className="text-terminal-error">
          {error ?? "Failed to load job"}: <span className="text-terminal-text">{id}</span>
        </p>
      </div>
    );
  }

  const Content = MDXContent;
  return (
    <div className={wrapperClass}>
      <div className={proseClass}>
        <MDXProvider components={components}>
          <Content />
        </MDXProvider>
      </div>
    </div>
  );
}
