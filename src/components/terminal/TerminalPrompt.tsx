import { cn } from "@/lib/utils";

interface TerminalPromptProps {
  /** When true, uses smaller/compact styling for history lines */
  compact?: boolean;
}

/** Shared prompt prefix "❯ bgramaje@whoami ~ $" for terminal input and output lines */
export function TerminalPrompt({ compact }: TerminalPromptProps) {
  return (
    <>
      <span className={cn("shrink-0 text-success", compact && "text-xs")}>❯</span>
      {" "}
      <div className="flex items-center gap-0.5">
      <span className={cn("shrink-0 text-chart-2", compact && "text-xs")}>bgramaje</span>
      <span className={cn("text-muted-foreground shrink-0", compact && "text-xs")}>@</span>
      <span className={cn("text-chart-3 shrink-0", compact && "text-xs")}>whoami</span>
      </div>
      <span className={cn("text-muted-foreground shrink-0 mx-1", compact && "text-xs")}>~</span>
      <span className={cn("text-muted-foreground shrink-0", compact && "text-xs")}>$</span>
    </>
  );
}
