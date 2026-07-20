import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MDXProvider } from "@mdx-js/react";
import { useMDXWorkComponents } from "@/lib/mdx/work-components";
import { loadJobContent } from "@/lib/loaders/jobLoader";

interface JobPostProps {
  id: string;
}

const contentMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
};

export function JobPost({ id }: JobPostProps) {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const components = useMDXWorkComponents({});
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? { initial: false as const, animate: { opacity: 1 } }
    : contentMotion;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setMDXContent(null);

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

  const wrapperClass = "font-sans";
  const typesetClass = "typeset typeset-docs max-w-none";

  if (loading) {
    return (
      <motion.div
        key={`loading-${id}`}
        className={wrapperClass}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-3 py-2" role="status" aria-live="polite">
          <span className="sr-only">Loading job details</span>
          <div className="h-5 w-2/5 animate-pulse rounded bg-border/30" aria-hidden />
          <div className="h-3 w-1/4 animate-pulse rounded bg-border/20" aria-hidden />
          <div className="mt-4 space-y-2" aria-hidden>
            <div className="h-3 w-full animate-pulse rounded bg-border/20" />
            <div className="h-3 w-11/12 animate-pulse rounded bg-border/20" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-border/20" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !MDXContent) {
    return (
      <motion.div key={`error-${id}`} className={wrapperClass} {...motionProps}>
        <p className="text-destructive" role="alert">
          {error ?? "Failed to load job"}: <span className="text-foreground">{id}</span>
        </p>
      </motion.div>
    );
  }

  const Content = MDXContent;
  return (
    <motion.div key={`content-${id}`} className={wrapperClass} {...motionProps}>
      <div className={typesetClass}>
        <MDXProvider components={components}>
          <Content />
        </MDXProvider>
      </div>
    </motion.div>
  );
}
