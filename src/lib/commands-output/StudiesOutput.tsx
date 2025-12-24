import { studies } from "@/data/portfolio";

export function StudiesOutput() {
  return (
    <div className="space-y-3">
      <p className="text-terminal-accent font-semibold">Academic Studies:</p>
      <div className="space-y-3">
        {studies.map((study, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span className="text-terminal-success shrink-0 mt-0.5">
              {study.type === "master" ? "✔" : "▸"}
            </span>
            <div className="flex-1">
              <p className="text-terminal-text text-sm font-medium">
                {study.degree}
              </p>
              <p className="text-terminal-muted text-xs mt-0.5">
                {study.institution}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

