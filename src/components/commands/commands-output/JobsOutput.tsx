import { useEffect, useState } from "react";
import { getAllJobIds, loadJobContent } from "@/lib/loaders/jobLoader";

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

const rowClass =
  "flex w-full min-h-10 items-start gap-3 rounded-lg px-2 py-1.5 -mx-2 -my-1.5 text-left transition-[color,background-color,transform] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

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
      <div
        role="status"
        className="flex items-center gap-2 text-muted-foreground text-sm mx-2"
      >
        <span
          className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-border border-t-primary"
          aria-hidden
        />
        Loading jobs…
      </div>
    );
  }

  return (
    <div className="space-y-3 mx-2">
      {jobs.map((job) => (
        <button
          key={job.slug}
          type="button"
          onClick={() => onJobClick?.(job.slug)}
          aria-label={`View ${job.role} at ${job.company}`}
          className={`${rowClass} group cursor-pointer hover:bg-border/25`}
        >
          <span className="text-success shrink-0 mt-0.5" aria-hidden>
            ▸
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm font-medium group-hover:text-success transition-colors min-w-0 truncate" title={job.role}>
              {job.role}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5 tabular-nums">
              {job.company} · {job.period}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
