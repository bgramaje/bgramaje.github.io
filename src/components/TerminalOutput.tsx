import { motion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface TerminalOutputProps {
  command: string;
  output: ReactNode;
}

export const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  ({ command, output }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="mb-4 text-sm"
      >
        {/* Command Line */}
        <div className="flex items-center gap-2 mb-2 opacity-70">
          <span className="text-terminal-success">❯</span>
          <span className="text-terminal-text">bgramaje</span>
          <span className="text-terminal-muted">@</span>
          <span className="text-terminal-cyan">portfolio</span>
          <span className="text-terminal-muted mx-1">~</span>
          <span className="text-terminal-muted">$</span>
          <span className="text-terminal-text">{command}</span>
        </div>

        {/* Output */}
        <div className="pl-4 border-l-2 border-terminal-border ml-1">
          {output}
        </div>
      </motion.div>
    );
  }
);

TerminalOutput.displayName = "TerminalOutput";

