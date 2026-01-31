import { commands } from "@/data/portfolio";

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
            className="px-3 py-1.5 text-xs font-medium border border-terminal-border bg-terminal-surface text-terminal-muted hover:bg-terminal-border/50 hover:text-terminal-text transition-colors cursor-pointer shrink-0 rounded-md"
            type="button"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}

