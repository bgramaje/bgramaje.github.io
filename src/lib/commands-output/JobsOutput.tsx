import { jobs } from "@/data/portfolio";

interface JobsOutputProps {
  onJobClick?: (jobId: number) => void;
}

export function JobsOutput({ onJobClick }: JobsOutputProps) {
  return (
    <div className="space-y-2">
      <p className="text-terminal-accent font-semibold mb-3">Work Experience:</p>
      {jobs.map((job, index) => (
        <div
          key={job.id ?? index}
          onClick={() => onJobClick?.(job.id ?? index)}
          className="p-3 border-2 border-terminal-border bg-terminal-bg hover:bg-terminal-border/30 hover:border-terminal-accent cursor-pointer transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-terminal-success font-medium">{job.role}</h3>
              <span className="text-terminal-cyan text-xs shrink-0">{job.period}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-terminal-muted text-sm">{job.company}</p>
              <span className="text-terminal-accent text-xs shrink-0">[Click to view]</span>
            </div>
            <p className="text-terminal-muted text-xs line-clamp-2">{job.shortDescription}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

