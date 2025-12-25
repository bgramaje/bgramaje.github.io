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
    <div className="p-2 md:p-3">
      <p className="text-terminal-muted hidden md:block text-xs mb-2">Available commands:</p>
      <div className="flex gap-2 overflow-x-auto pb-0 md:pb-1">
        {commandList.filter((cmd) => cmd !== "clear").map((cmd) => (
          <button
            key={cmd}
            onClick={() => onCommandClick(cmd)}
            className="px-3 py-1.5 text-xs border-2 border-terminal-border bg-terminal-bg text-terminal-text hover:bg-terminal-border hover:text-terminal-accent transition-colors cursor-pointer shrink-0"
            type="button"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}

