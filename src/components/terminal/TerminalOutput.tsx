import { memo } from "react";
import { motion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { TerminalPrompt } from "./TerminalPrompt";

interface TerminalOutputProps {
  command: string;
  output: ReactNode;
}

function TerminalOutputInner({ command, output }: TerminalOutputProps, ref: React.ForwardedRef<HTMLDivElement>) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.12 }}
      className="mb-3 text-sm"
    >
      <div className="flex items-center gap-2 flex-wrap mb-0.5 text-xs">
        <TerminalPrompt compact />
        <span className="text-terminal-text">{command}</span>
      </div>
      <div className="mt-2">{output}</div>
    </motion.div>
  );
}

export const TerminalOutput = memo(forwardRef<HTMLDivElement, TerminalOutputProps>(TerminalOutputInner));
TerminalOutput.displayName = "TerminalOutput";
