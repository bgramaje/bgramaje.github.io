import { projects } from "@/content/data/portfolio";

export function ProjectsOutput() {
  return (
    <div className="space-y-3 mx-2">
      <p className="text-primary font-semibold">Side projects:</p>
      {projects.map((project) => {
        const href = project.url ?? project.github;
        const label = project.url ? "View live" : "View source";
        return (
          <div
            key={project.name}
            role={href ? "link" : undefined}
            title={href}
            onClick={() =>
              href && window.open(href, "_blank", "noopener,noreferrer")
            }
            className="group rounded-lg px-2 py-1.5 -mx-2 -my-1.5 hover:bg-border/25 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-success shrink-0 mt-0.5">▸</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-foreground text-sm font-medium group-hover:text-success transition-colors min-w-0 truncate">
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
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs bg-border/50 text-success rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
