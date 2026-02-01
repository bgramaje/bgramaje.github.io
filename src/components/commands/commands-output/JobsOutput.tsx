import { useEffect, useState } from "react";
import { getAllJobIds, loadJobContent } from "@/lib/jobLoader";

interface JobListItem {
  slug: string;
  role: string;
  company: string;
  period: string;
}

interface JobsOutputProps {
  onJobClick?: (slug: string) => void;
}

/** Extrae el año de inicio de period (ej. "2022 - Present" -> 2022) para ordenar. */
function startYearFromPeriod(period: string): number {
  const match = period.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0], 10) : 0;
}

export function JobsOutput({ onJobClick }: JobsOutputProps) {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const ids = getAllJobIds();
    Promise.all(ids.map((slug) => loadJobContent(slug)))
      .then((modules) => {
        if (cancelled) return;
        const list: JobListItem[] = ids
          .map((slug, i) => {
            const fm = modules[i]?.frontmatter;
            return {
              slug,
              role: fm?.role ?? "—",
              company: fm?.company ?? "—",
              period: fm?.period ?? "—",
            };
          })
          .sort((a, b) => startYearFromPeriod(b.period) - startYearFromPeriod(a.period));
        setJobs(list);
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-terminal-muted text-sm mx-2">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-terminal-border border-t-terminal-accent" />
        Loading jobs…
      </div>
    );
  }

  return (
    <div className="space-y-3 mx-2">
      {jobs.map((job) => (
        <div
          key={job.slug}
          onClick={() => onJobClick?.(job.slug)}
          className="flex items-start gap-3 cursor-pointer group rounded-lg px-2 py-1.5 -mx-2 -my-1.5 hover:bg-terminal-border/25 transition-colors"
        >
          <span className="text-terminal-success shrink-0 mt-0.5">▸</span>
          <div className="flex-1 min-w-0">
            <p className="text-terminal-text text-sm font-medium group-hover:text-terminal-success transition-colors min-w-0 truncate">
              {job.role}
            </p>
            <p className="text-terminal-muted text-xs mt-0.5">
              {job.company} · {job.period}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
