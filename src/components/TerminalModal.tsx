import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "./Terminal";
import { TerminalOutput } from "./TerminalOutput";
import { CommandChips } from "./CommandChips";
import { TerminalTitleBar } from "./TerminalTitleBar";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: React.ReactNode;
  title?: string;
  placeholder?: string;
}

export function TerminalModal({
  isOpen,
  onClose,
  initialContent,
  title = "Terminal",
  placeholder,
}: TerminalModalProps) {
  const [history, setHistory] = useState<Array<{ id: number; command: string; output: React.ReactNode }>>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (initialContent) {
          setHistory([
            {
              id: Date.now(),
              command: placeholder || "",
              output: initialContent,
            },
          ]);
        } else {
          setHistory([]);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
      setHistory([]);
    }
  }, [isOpen, initialContent, placeholder]);

  const handleCommand = useCallback(
    (input: string) => {
      const trimmedInput = input.trim();
      const cmd = trimmedInput.toLowerCase().split(/\s+/)[0];

      if (cmd === "clear") {
        setHistory([]);
        return;
      }

      if (cmd === "exit" || cmd === "close") {
        onClose();
        return;
      }

      // Only allow close command in modal
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          command: input,
          output: (
            <div className="space-y-1">
              <p className="text-terminal-error">
                Unknown command: <span className="text-terminal-text">{input}</span>
              </p>
              <p className="text-terminal-muted text-sm">
                Type <span className="text-terminal-success">close</span> to close this modal
              </p>
            </div>
          ),
        },
      ]);

      if (trimmedInput) {
        setCommandHistory((prev) => [...prev, trimmedInput.toLowerCase()]);
      }
      setHistoryIndex(-1);
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, currentValue: string, setValue: (v: string) => void) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setValue(commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setValue("");
          } else {
            setHistoryIndex(newIndex);
            setValue(commandHistory[newIndex]);
          }
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const allowedCommands = ["close"];
        const matches = allowedCommands.filter((cmd) => cmd.startsWith(currentValue.toLowerCase()));
        if (matches.length === 1) {
          setValue(matches[0]);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [commandHistory, historyIndex, onClose]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl h-[95dvh] bg-terminal-surface border-2 border-terminal-border shadow-2xl flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title Bar */}
          <TerminalTitleBar title={title} onClose={onClose} />

          {/* Terminal Content Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Terminal Content */}
            <div
              ref={terminalRef}
              className={`flex-1 overflow-y-auto pt-2 pb-4 px-2 md:pt-3 md:pb-6 md:px-4 scroll-smooth text-sm ${
                isLoading ? "flex items-center justify-center" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 border-2 border-terminal-border border-t-terminal-accent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Command History */}
                  <AnimatePresence mode="popLayout">
                    {history.map((item) => (
                      <TerminalOutput key={item.id} command={item.command} output={item.output} />
                    ))}
                  </AnimatePresence>

                  {/* Input Line */}
                  <Terminal
                    onSubmit={handleCommand}
                    onKeyDown={handleKeyDown}
                    inputRef={inputRef}
                  />
                </>
              )}
            </div>

            {/* Command Chips - Only close */}
            {!isLoading && (
              <div className="border-t-2 border-terminal-border bg-terminal-surface shrink-0">
                <CommandChips onCommandClick={handleCommand} allowedCommands={["close"]} />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

