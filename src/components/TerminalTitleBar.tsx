import { X, Github, Mail, Linkedin } from "lucide-react";
import { personalInfo } from "@/data/portfolio";

interface TerminalTitleBarProps {
  title?: string;
  onClose?: () => void;
}

export function TerminalTitleBar({ title = "bgramaje@portfolio", onClose }: TerminalTitleBarProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-terminal-bg border-b-2 border-terminal-border shrink-0">
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-[#ff5f57] rounded-full" />
        <div className="w-3 h-3 bg-[#ffbd2e] rounded-full" />
        <div className="w-3 h-3 bg-[#28ca42] rounded-full" />
      </div>
      <div className="flex-1 text-center">
        <span className="text-terminal-muted text-sm">{title}</span>
      </div>
      {onClose ? (
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-terminal-muted hover:text-terminal-text transition-colors rounded-md hover:bg-terminal-border/30"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/bgramaje"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center text-terminal-muted hover:text-terminal-text transition-colors rounded-md hover:bg-terminal-border/30"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="w-7 h-7 flex items-center justify-center text-terminal-muted hover:text-terminal-text transition-colors rounded-md hover:bg-terminal-border/30"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
          <a
            href="https://linkedin.com/in/bgramaje"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center text-terminal-muted hover:text-terminal-text transition-colors rounded-md hover:bg-terminal-border/30"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
        </div>
      )}
    </div>
  );
}

