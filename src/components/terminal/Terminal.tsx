import { useState, useEffect, type RefObject } from "react";
import { TerminalPrompt } from "./TerminalPrompt";

interface TerminalProps {
  onSubmit: (command: string) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    setValue: (v: string) => void
  ) => void;
  inputRef: RefObject<HTMLInputElement>;
  placeholder?: string;
}

export function Terminal({ onSubmit, onKeyDown, inputRef, placeholder }: TerminalProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 text-sm">
      <TerminalPrompt />
      <div className="relative flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => onKeyDown(e, value, setValue)}
          className="w-full bg-transparent text-terminal-text outline-none caret-transparent focus:ring-0"
          placeholder={placeholder ?? ""}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Terminal command"
        />
        <span className="absolute left-0 top-0 pointer-events-none text-terminal-text whitespace-pre">
          {value || (placeholder ? <span className="text-terminal-muted">{placeholder}</span> : null)}
          <span className="inline-block w-2.5 h-5 bg-terminal-accent animate-blink ml-px align-middle -mb-0.5" aria-hidden />
        </span>
      </div>
    </form>
  );
}
