import { commands } from "@/content/data/portfolio";

interface CommandChipsProps {
  onCommandClick: (command: string) => void;
  allowedCommands?: string[];
}

export function CommandChips({ onCommandClick, allowedCommands }: CommandChipsProps) {
  const commandList = allowedCommands 
    ? [...allowedCommands].sort() 
    : Object.keys(commands).sort();

  return (
    <div className="p-1 pt-1 md:p-1 md:pt-2">
      <div className="flex gap-2 overflow-x-auto pb-0 md:pb-1">
        {commandList.filter((cmd) => cmd !== "clear").map((cmd) => (
          <button
            key={cmd}
            onClick={() => onCommandClick(cmd)}
            className="min-h-6 px-3 py-1.5 text-xs font-medium border border-border bg-card text-muted-foreground hover:bg-border/50 hover:text-foreground transition-colors cursor-pointer shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            type="button"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
