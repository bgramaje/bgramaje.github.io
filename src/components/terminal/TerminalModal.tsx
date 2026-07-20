import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { Terminal } from "@/components/terminal/Terminal";
import { TerminalOutput } from "@/components/terminal/TerminalOutput";
import { CommandChips } from "@/components/terminal/CommandChips";
import { TerminalDialogShell } from "@/components/terminal/TerminalDialogShell";

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
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (history.length === 0) return;
    const id = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(id);
  }, [history, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
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
    } else {
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

      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          command: input,
          output: (
            <div className="flex flex-col gap-1">
              <p className="text-destructive">
                Unknown command: <span className="text-foreground">{input}</span>
              </p>
              <p className="text-muted-foreground text-sm">
                Type <span className="text-success">close</span> to close this modal
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
      } else if (e.key === "Tab" && !e.shiftKey) {
        // Only steal Tab when autocomplete can complete; otherwise allow focus to leave (WCAG 2.1.2).
        const needle = currentValue.toLowerCase();
        const matches = ["close"].filter((cmd) => cmd.startsWith(needle));
        if (matches.length === 1 && matches[0] !== needle) {
          e.preventDefault();
          setValue(matches[0]);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [commandHistory, historyIndex, onClose]
  );

  return (
    <TerminalDialogShell
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="terminal"
      className="md:max-h-[95dvh]"
      scrollRef={terminalRef}
      footer={<CommandChips onCommandClick={handleCommand} allowedCommands={["close"]} />}
    >
      <div className="-mx-1 min-h-0">
        <div aria-live="polite" aria-relevant="additions" className="min-w-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {history.map((item) => (
              <TerminalOutput key={item.id} command={item.command} output={item.output} />
            ))}
          </AnimatePresence>
        </div>

        <Terminal
          onSubmit={handleCommand}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
        />
      </div>
    </TerminalDialogShell>
  );
}
