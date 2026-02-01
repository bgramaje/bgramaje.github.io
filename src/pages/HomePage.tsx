import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "@/components/terminal/Terminal";
import { TerminalOutput } from "@/components/terminal/TerminalOutput";
import { CommandToolbar } from "@/components/terminal/CommandToolbar";
import { TerminalModal } from "@/components/terminal/TerminalModal";
import { JobModal } from "@/components/JobModal";
import { TerminalTitleBar } from "@/components/terminal/TerminalTitleBar";
import { Snowfall } from "@/components/Snowfall";
import { ContactOutput } from "@/components/commands/commands-output/ContactOutput";
import { commands as availableCommands } from "@/data/portfolio";
import { processCommand } from "@/components/commands/commands";

export interface HistoryItem {
  id: number;
  command: string;
  output: React.ReactNode;
}

const initialHistory: HistoryItem[] = [
  {
    id: Date.now(),
    command: "contact",
    output: <ContactOutput />,
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState("Terminal");
  const [modalPlaceholder, setModalPlaceholder] = useState<string | undefined>(undefined);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobModalJobId, setJobModalJobId] = useState("");
  const [jobModalTitle, setJobModalTitle] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      const t = setTimeout(scrollToBottom, 80);
      return () => clearTimeout(t);
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
        onOpenJobModal: (jobId: string, title: string) => {
          setJobModalJobId(jobId);
          setJobModalTitle(title);
          setJobModalOpen(true);
        },
        onNavigate: (path: string) => {
          navigate(path);
        },
      });

      setHistory((prev) => [
        ...prev,
        { id: Date.now(), command: input, output },
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
    if (e.target === e.currentTarget) {
      inputRef.current?.focus();
    }
  }, []);

  const handleTerminalContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-neutral-950 p-1 md:p-1.5 relative overflow-hidden">
      <Snowfall />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="w-full min-w-0 max-w-4xl mx-auto flex-1 flex flex-col gap-1 md:gap-1.5 relative z-10 min-h-0"
        onClick={focusInput}
      >
        <div className="flex-1 min-h-0 min-w-0 w-full bg-transparent border border-terminal-border/60 overflow-hidden relative flex flex-col rounded-lg">
          <TerminalTitleBar />

          <div
            ref={terminalRef}
            className="flex-1 min-w-0 w-full overflow-y-auto pt-1.5 pb-4 px-1.5 scroll-smooth text-sm relative"
            onClick={handleTerminalContentClick}
          >
            <div className="sticky top-0.5 z-10 h-0 overflow-visible flex justify-end">
              <div className="absolute right-0.5 top-0 w-11 flex flex-col items-center">
                <CommandToolbar onCommandClick={handleCommand} />
              </div>
            </div>
            <AnimatePresence mode="popLayout">
              {history.map((item) => (
                <TerminalOutput key={item.id} command={item.command} output={item.output} />
              ))}
            </AnimatePresence>

            {history.length === 1 && (
              <p className="text-terminal-muted text-xs mb-2 mt-0.5 px-0.5" aria-hidden>
                Try: <span className="text-terminal-cyan">help</span>, <span className="text-terminal-cyan">jobs</span>, <span className="text-terminal-cyan">contact</span>, <span className="text-terminal-cyan">home</span>
              </p>
            )}

            <Terminal
              onSubmit={handleCommand}
              onKeyDown={handleKeyDown}
              inputRef={inputRef}
            />
          </div>
        </div>

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

        <JobModal
          isOpen={jobModalOpen}
          onClose={() => {
            setJobModalOpen(false);
            setJobModalJobId("");
            setJobModalTitle("");
          }}
          jobId={jobModalJobId}
          title={jobModalTitle}
        />
      </motion.div>
    </div>
  );
}
