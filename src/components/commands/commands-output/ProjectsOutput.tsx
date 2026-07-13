import { projects } from "@/content/data/portfolio";
import { TechChip } from "@/components/shared/TechChip";

const rowClass =
  "group min-h-10 rounded-lg px-2 py-1.5 -mx-2 -my-1.5 transition-[color,background-color,transform] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function ProjectRow({
  project,
  href,
  label,
}: {
  project: (typeof projects)[number];
  href: string | undefined;
  label: string;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="text-success shrink-0 mt-0.5" aria-hidden>
        ▸
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-foreground text-sm font-medium group-hover:text-success transition-colors min-w-0 truncate" title={project.name}>
            {project.name}
          </p>
          {href ? (
            <span className="text-chart-3 text-xs shrink-0 opacity-60 group-hover:opacity-100 group-hover:underline transition-opacity">
              {label} ↗
            </span>
          ) : null}
        </div>
        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {project.technologies.map((tech) => (
            <TechChip key={tech} label={tech} tier="default" />
          ))}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${rowClass} block hover:bg-border/25`}
      >
        {content}
      </a>
    );
  }

  return <div className={rowClass}>{content}</div>;
}

export function ProjectsOutput() {
  return (
    <div className="space-y-3 mx-2">
      <p className="text-primary font-semibold">Side projects:</p>
      {projects.map((project) => {
        const href = project.url ?? project.github;
        const label = project.url ? "View live" : "View source";
        return (
          <ProjectRow
            key={project.name}
            project={project}
            href={href}
            label={label}
          />
        );
      })}
    </div>
  );
}
