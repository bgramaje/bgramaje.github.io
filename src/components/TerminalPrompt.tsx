import { cn } from "@/lib/utils";

interface TerminalPromptProps {
  /** When true, uses smaller/compact styling for history lines */
  compact?: boolean;
}

/** Shared prompt prefix "❯ bgramaje@whoami ~ $" for terminal input and output lines */
export function TerminalPrompt({ compact }: TerminalPromptProps) {
  return (
    <>
      <span className={cn("shrink-0", compact && "text-xs")} style={{ color: "#22c55e" }}>❯</span>
      {" "}
      <div className="flex items-center gap-0.5">
      <span className={cn("shrink-0", compact && "text-xs")} style={{ color: "#7ba3b8" }}>bgramaje</span>
      <span className={cn("text-terminal-muted shrink-0", compact && "text-xs")}>@</span>
      <span className={cn("text-terminal-cyan shrink-0", compact && "text-xs")}>whoami</span>
      </div>
      <span className={cn("text-terminal-muted shrink-0 mx-1", compact && "text-xs")}>~</span>
      <span className={cn("text-terminal-muted shrink-0", compact && "text-xs")}>$</span>
    </>
  );
}
