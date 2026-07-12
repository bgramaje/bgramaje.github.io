import { studies } from "@/content/data/portfolio";

export function StudiesOutput() {
  return (
    <div className="space-y-3">
        {studies.map((study, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span className="text-success shrink-0 mt-0.5">
              {study.type === "master" ? "✔" : "▸"}
            </span>
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">
                {study.degree}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {study.institution}
                {(study.startDate || study.endDate || study.ongoing) && (
                  <span className="ml-2 text-muted-foreground opacity-70">
                    {study.startDate}
                    {study.ongoing ? " - present" : study.endDate ? ` - ${study.endDate}` : ""}
                  </span>
                )}
                {study.ongoing && (
                  <span className="text-success ml-1">(ongoing)</span>
                )}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
