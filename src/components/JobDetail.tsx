import { Job } from "@/data/portfolio";
import { ExternalLink } from "lucide-react";

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="pb-3 border-b-2 border-terminal-border">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-terminal-success font-bold text-lg">{job.role}</h2>
            <span className="text-terminal-cyan font-medium text-xs shrink-0">{job.period}</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-terminal-text text-sm font-medium">{job.company}</p>
            {job.ctaLink && (
              <a
                href={job.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-accent hover:text-terminal-success transition-colors inline-flex items-center gap-1 text-xs shrink-0"
              >
                <span>Website</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
        
        {job.location && (
          <div className="flex flex-wrap items-center gap-3 text-xs mt-3">
            <span className="text-terminal-muted">📍 {job.location}</span>
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <h3 className="text-terminal-accent font-semibold text-sm uppercase tracking-wide">
          Description
        </h3>
        <p className="text-terminal-text text-sm leading-relaxed text-justify">
          {job.description}
        </p>
      </div>

      {/* Achievements Section */}
      {job.achievements && job.achievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-terminal-accent font-semibold text-sm uppercase tracking-wide">
            Key Achievements
          </h3>
          <ul className="space-y-2.5">
            {job.achievements.map((achievement, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-terminal-success shrink-0 mt-1">▸</span>
                <p className="text-terminal-text/90 text-sm leading-relaxed text-justify flex-1">
                  {achievement}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technologies Section */}
      <div className="space-y-3">
        <h3 className="text-terminal-accent font-semibold text-sm uppercase tracking-wide">
          Technologies
        </h3>
        <div className="flex flex-wrap gap-2">
          {job.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 text-xs font-medium bg-terminal-border/30 border border-terminal-border/50 text-terminal-text rounded hover:bg-terminal-border/50 hover:border-terminal-border transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

