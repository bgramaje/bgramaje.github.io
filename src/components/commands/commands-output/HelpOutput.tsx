import { commands } from "@/data/portfolio";

export function HelpOutput() {
  const sortedCommands = Object.entries(commands).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sortedCommands.map(([cmd, desc]) => (
          <div key={cmd} className="flex gap-3">
            <span className="text-terminal-success font-medium min-w-[100px]">{cmd}</span>
            <span className="text-terminal-muted">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
