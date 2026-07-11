import { projects } from "@/data/portfolio";

export function ProjectsOutput() {
  return (
    <div className="space-y-3 mx-2">
      <p className="text-terminal-accent font-semibold">Side projects:</p>
      {projects.map((project) => (
        <div key={project.name} className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-terminal-success shrink-0">▸</span>
            <h3 className="text-terminal-text text-sm font-medium">{project.name}</h3>
          </div>
          <p className="text-terminal-muted text-xs leading-relaxed pl-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pl-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs bg-terminal-border/50 text-terminal-success rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pl-4 text-xs text-terminal-cyan hover:underline"
            >
              {project.github}
            </a>
          ) : null}
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pl-4 ml-2 text-xs text-terminal-cyan hover:underline"
            >
              {project.url}
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
