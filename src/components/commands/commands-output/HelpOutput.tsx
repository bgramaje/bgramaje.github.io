import { commands } from "@/content/data/portfolio";
import { StaggerItem } from "@/components/commands/commands-output/StaggerItem";

export function HelpOutput() {
  const sortedCommands = Object.entries(commands).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {sortedCommands.map(([cmd, desc], i) => (
        <StaggerItem key={cmd} index={i} className="flex gap-3">
          <span className="text-success font-medium min-w-[100px]">{cmd}</span>
          <span className="text-muted-foreground">{desc}</span>
        </StaggerItem>
      ))}
    </div>
  );
}
