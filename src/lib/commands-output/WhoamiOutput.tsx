import { personalInfo } from "@/data/portfolio";

export function WhoamiOutput() {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <p className="text-terminal-success">{personalInfo.name}</p>
        <p className="text-terminal-muted text-sm">{personalInfo.title}</p>
      </div>
      <p className="text-terminal-muted text-sm mt-3">
        Type <span className="text-terminal-success">help</span> to see available commands
      </p>
    </div>
  );
}

