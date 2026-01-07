import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "@/components/Terminal";
import { TerminalOutput } from "@/components/TerminalOutput";
import { CommandChips } from "@/components/CommandChips";
import { TerminalModal } from "@/components/TerminalModal";
import { TerminalTitleBar } from "@/components/TerminalTitleBar";
import { Snowfall } from "@/components/Snowfall";
import { ContactOutput } from "@/lib/commands-output/ContactOutput";
import { commands as availableCommands } from "@/data/portfolio";
import { processCommand } from "@/lib/commands";

export interface HistoryItem {
  id: number;
  command: string;
  output: React.ReactNode;
}

export function HomePage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: Date.now(),
      command: "contact",
      output: <ContactOutput />,
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState("Terminal");
  const [modalPlaceholder, setModalPlaceholder] = useState<string | undefined>(undefined);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        });
      });
    }
  }, []);

  // Scroll to bottom when history changes (for async content like blog posts)
  useEffect(() => {
    if (history.length > 0) {
      // Wait a bit longer for async content to render
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [history, scrollToBottom]);

  const handleCommand = useCallback(
    (input: string) => {
      const trimmedInput = input.trim();
      const cmd = trimmedInput.toLowerCase().split(/\s+/)[0];

      if (cmd === "clear") {
        setHistory([]);
        return;
      }

      const output = processCommand(trimmedInput, {
        onCommandClick: handleCommand,
        onOpenModal: (content: React.ReactNode, title: string, placeholder?: string) => {
          setModalContent(content);
          setModalTitle(title);
          setModalPlaceholder(placeholder);
          setModalOpen(true);
        },
        onNavigate: (path: string) => {
          navigate(path);
        },
      });

      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          command: input,
          output,
        },
      ]);

      if (trimmedInput) {
        setCommandHistory((prev) => [...prev, trimmedInput.toLowerCase()]);
      }
      setHistoryIndex(-1);
    },
    [navigate]
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
        const commands = Object.keys(availableCommands);
        const matches = commands.filter((cmd) => cmd.startsWith(currentValue.toLowerCase()));
        if (matches.length === 1) {
          setValue(matches[0]);
        }
      }
    },
    [commandHistory, historyIndex]
  );

  const focusInput = useCallback((e: React.MouseEvent) => {
    // Only focus if clicking on the container itself, not on content inside
    if (e.target === e.currentTarget) {
      inputRef.current?.focus();
    }
  }, []);

  const handleTerminalContentClick = useCallback((e: React.MouseEvent) => {
    // Prevent scroll when clicking on terminal content
    e.stopPropagation();
  }, []);

  return (
    <div className="h-[100dvh] bg-terminal-bg flex items-center justify-center p-2 md:p-4 relative dot-pattern-rotated overflow-hidden">
      {/* Snowfall effect - only visible during December 1 - January 7 */}
      <Snowfall />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-5xl h-full flex flex-col items-center justify-center gap-2 md:gap-3 relative z-10"
        onClick={focusInput}
      >
        {/* Terminal Window */}
        <div className="w-full flex-grow bg-terminal-surface border-2 border-terminal-border shadow-lg overflow-hidden relative flex flex-col rounded-lg">
          {/* Title Bar */}
          <TerminalTitleBar />

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto pt-2 pb-32 px-2 md:px-2 scroll-smooth text-sm"
            onClick={handleTerminalContentClick}
          >
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
          </div>

          {/* Command Chips - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 border-t-2 border-terminal-border bg-terminal-surface">
            <CommandChips 
              onCommandClick={handleCommand} 
              allowedCommands={Object.keys(availableCommands).filter((cmd) => !["clear", "close", "exit", "home"].includes(cmd))} />
            </div>
          </div>

        {/* Terminal Modal */}
        <TerminalModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalContent(null);
            setModalPlaceholder(undefined);
          }}
          initialContent={modalContent}
          title={modalTitle}
          placeholder={modalPlaceholder}
        />
      </motion.div>
    </div>
  );
}

