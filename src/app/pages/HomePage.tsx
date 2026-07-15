import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Terminal } from "@/components/terminal/Terminal";
import { TerminalOutput } from "@/components/terminal/TerminalOutput";
import { CommandToolbar } from "@/components/terminal/CommandToolbar";
import { TerminalModal } from "@/components/terminal/TerminalModal";
import { JobModal } from "@/components/jobs/JobModal";
import { TerminalTitleBar } from "@/components/terminal/TerminalTitleBar";
import { Snowfall } from "@/components/shared/Snowfall";
import { ContactOutput } from "@/components/commands/commands-output/ContactOutput";
import { commands as availableCommands } from "@/content/data/portfolio";
import { processCommand } from "@/components/commands/commands";
import { FOCUS_TERMINAL_INPUT_EVENT, requestTerminalInputFocus } from "@/lib/terminal-focus";
import { pageWidthClass } from "@/lib/utils";
import { useDocumentHead } from "@/lib/useDocumentHead";

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
  useDocumentHead({
    title: "bgramaje | Software Engineer",
    description:
      "Software engineer portfolio by bgramaje, focused on full-stack development, IoT, data platforms, and technical writing.",
    canonical: "https://bgramaje.github.io/",
    lang: "en",
  });

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

  useEffect(() => {
    const focusInput = () => {
      inputRef.current?.focus();
    };
    window.addEventListener(FOCUS_TERMINAL_INPUT_EVENT, focusInput);
    return () => window.removeEventListener(FOCUS_TERMINAL_INPUT_EVENT, focusInput);
  }, []);

  const handleCommand = useCallback(
    (input: string) => {
      const trimmedInput = input.trim();
      const cmd = trimmedInput.toLowerCase().split(/\s+/)[0];

      if (cmd === "clear") {
        setHistory([]);
        return;
      }

      const output = processCommand(trimmedInput, {
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
    [],
  );

  const handleToolbarCommand = useCallback(
    (command: string) => {
      handleCommand(command);
      requestTerminalInputFocus();
    },
    [handleCommand]
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
    <div className="flex-1 flex flex-col min-h-0 bg-background relative overflow-hidden">
      <Snowfall />

      <div
        className={`${pageWidthClass} min-w-0 flex-1 flex flex-col gap-1 md:gap-1.5 py-1 md:py-1.5 relative z-10 min-h-0`}
        onClick={focusInput}
      >
        <div className="flex-1 min-h-0 min-w-0 w-full bg-transparent border border-border/60 dark:border-border/90 overflow-hidden relative flex flex-col rounded-lg">
          <TerminalTitleBar />

          <div
            ref={terminalRef}
            className="flex-1 min-w-0 w-full overflow-y-auto pt-1.5 pb-4 px-1.5 scroll-smooth text-sm relative"
            onClick={handleTerminalContentClick}
          >
            <div className="sticky top-0.5 z-10 h-0 overflow-visible flex justify-end pointer-events-none">
              <div className="absolute right-1.5 top-0 w-11 flex flex-col items-center pointer-events-auto">
                <CommandToolbar onCommandClick={handleToolbarCommand} />
              </div>
            </div>
            <div className="pr-11 md:pr-12 min-w-0">
              <h1 className="sr-only">bgramaje — interactive portfolio terminal</h1>

              <div aria-live="polite" aria-relevant="additions" className="min-w-0">
                <AnimatePresence mode="popLayout" initial={false}>
                  {history.map((item) => (
                    <TerminalOutput key={item.id} command={item.command} output={item.output} />
                  ))}
                </AnimatePresence>
              </div>

              {history.length === 1 && (
                <p className="text-muted-foreground text-xs mb-2 mt-0.5 px-0.5 max-w-[min(100%,28rem)] leading-relaxed text-pretty">
                  Try: <span className="text-chart-3">help</span>, <span className="text-chart-3">jobs</span>, <span className="text-chart-3">contact</span>.{" "}
                  <span className="text-muted-foreground/80">↑↓ history · Tab completes</span>
                </p>
              )}

              <Terminal
                onSubmit={handleCommand}
                onKeyDown={handleKeyDown}
                inputRef={inputRef}
              />
            </div>
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
      </div>
    </div>
  );
}
