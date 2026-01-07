import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "@/components/Terminal";
import { TerminalOutput } from "@/components/TerminalOutput";
import { BlogPost } from "@/components/BlogPost";
import { loadBlogContent } from "@/lib/blogLoader";
import { CommandChips } from "@/components/CommandChips";
import { TerminalTitleBar } from "@/components/TerminalTitleBar";
import { Snowfall } from "@/components/Snowfall";

export function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [history, setHistory] = useState<Array<{ id: number; command: string; output: React.ReactNode }>>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      loadBlogContent(id)
        .then(() => {
          setHistory([
            {
              id: Date.now(),
              command: `blog detail ${id}`,
              output: <BlogPost id={id} />,
            },
          ]);
        })
        .catch(() => {
          // Blog not found
          setHistory([
            {
              id: Date.now(),
              command: `blog detail ${id}`,
              output: (
                <div className="space-y-1">
                  <p className="text-terminal-error">
                    Blog not found: <span className="text-terminal-text">{id}</span>
                  </p>
                  <p className="text-terminal-muted text-sm">
                    Type <span className="text-terminal-success">home</span> to return to the main page
                  </p>
                </div>
              ),
            },
          ]);
        });
    } else {
      setHistory([
        {
          id: Date.now(),
          command: `blog detail ${id}`,
          output: (
            <div className="space-y-1">
              <p className="text-terminal-error">
                Blog not found: <span className="text-terminal-text">{id}</span>
              </p>
              <p className="text-terminal-muted text-sm">
                Type <span className="text-terminal-success">home</span> to return to the main page
              </p>
            </div>
          ),
        },
      ]);
    }
    inputRef.current?.focus();
  }, [id]);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const handleCommand = useCallback(
    (input: string) => {
      const trimmedInput = input.trim();
      const cmd = trimmedInput.toLowerCase().split(/\s+/)[0];

      if (cmd === "home" || cmd === "cd" || cmd === "exit") {
        navigate("/");
        return;
      }

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
                Type <span className="text-terminal-success">home</span> to return to the main page
              </p>
            </div>
          ),
        },
      ]);

      if (trimmedInput) {
        setCommandHistory((prev) => [...prev, trimmedInput.toLowerCase()]);
      }
      setHistoryIndex(-1);

      // Scroll to bottom only after executing a command
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    },
    [navigate, scrollToBottom]
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
        const allowedCommands = ["home"];
        const matches = allowedCommands.filter((cmd) => cmd.startsWith(currentValue.toLowerCase()));
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
    <div className="h-[100dvh] bg-terminal-bg flex items-center justify-center p-4 md:p-4 relative dot-pattern-rotated overflow-hidden">
      {/* Snowfall effect - only visible during December 1 - January 7 */}
      <Snowfall />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-5xl h-full flex flex-col items-center justify-center gap-2 md:gap-6 relative z-10 overflow-hidden"
        onClick={focusInput}
      >
        {/* Terminal Window */}
        <div className="w-full flex-grow bg-terminal-surface border-2 border-terminal-border shadow-lg overflow-hidden relative flex flex-col rounded-lg">
          {/* Title Bar */}
          <TerminalTitleBar />

          {/* Terminal Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
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

            {/* Command Chips - Only home */}
            <div className="absolute bottom-0 left-0 right-0 border-t-2 border-terminal-border bg-terminal-surface">
              <CommandChips onCommandClick={handleCommand} allowedCommands={["home"]} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

