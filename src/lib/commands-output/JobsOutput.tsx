import { jobs } from "@/data/portfolio";

interface JobsOutputProps {
  onJobClick?: (jobId: number) => void;
}

export function JobsOutput({ onJobClick }: JobsOutputProps) {
  return (
    <div className="space-y-3 mx-2">
        {jobs.map((job, index) => (
          <div
            key={job.id ?? index}
            onClick={() => onJobClick?.(job.id ?? index)}
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
              <p className="text-terminal-text/70 text-xs mt-0.5 min-w-0 truncate" title={job.shortDescription}>
                {job.shortDescription}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
