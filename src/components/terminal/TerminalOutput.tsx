import { memo, forwardRef, type ReactNode } from "react";
import { TerminalPrompt } from "./TerminalPrompt";

interface TerminalOutputProps {
  command: string;
  output: ReactNode;
}

function TerminalOutputInner({ command, output }: TerminalOutputProps, ref: React.ForwardedRef<HTMLDivElement>) {
  return (
    <div ref={ref} className="mb-3 text-sm animate-fade-in">
      <div className="flex items-center gap-2 flex-wrap mb-0.5 text-xs">
        <TerminalPrompt compact />
        <span className="text-foreground">{command}</span>
      </div>
      <div className="mt-2">{output}</div>
    </div>
  );
}

export const TerminalOutput = memo(forwardRef<HTMLDivElement, TerminalOutputProps>(TerminalOutputInner));
TerminalOutput.displayName = "TerminalOutput";
