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
        <div className="flex items-center gap-2 mb-0 opacity-70 text-xs sm:mb-2">
          <span className="text-terminal-success">❯</span>
          <span className="text-terminal-text">bgramaje</span>
          <span className="text-terminal-muted">@</span>
          <span className="text-terminal-cyan">portfolio</span>
          <span className="text-terminal-muted mx-1">~</span>
          <span className="text-terminal-muted">$</span>
          <span className="text-terminal-text hidden sm:block">{command}</span>
        </div>
        <span className="text-terminal-text inline sm:hidden text-xs">{command}</span>

        {/* Output */}
        <div>
          {output}
        </div>
      </motion.div>
    );
  }
);

TerminalOutput.displayName = "TerminalOutput";

