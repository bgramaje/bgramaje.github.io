import { useState, useRef, useEffect, type RefObject } from "react";

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
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 group text-sm">
      <span className="text-terminal-success shrink-0">❯</span>
      <span className="text-terminal-text shrink-0">bgramaje</span>
      <span className="text-terminal-muted shrink-0">@</span>
      <span className="text-terminal-cyan shrink-0">portfolio</span>
      <span className="text-terminal-muted shrink-0 mx-1">~</span>
      <span className="text-terminal-muted shrink-0">$</span>
      
      <div className="relative flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => onKeyDown(e, value, setValue)}
          className="w-full bg-transparent text-terminal-text outline-none caret-transparent"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <span
          ref={spanRef}
          className="absolute left-0 top-0 pointer-events-none text-terminal-text whitespace-pre"
        >
          {value || (placeholder ? <span className="text-terminal-muted">{placeholder}</span> : "")}
          <span className="inline-block w-2.5 h-5 bg-terminal-accent animate-blink ml-px align-middle -mb-0.5" />
        </span>
      </div>
    </form>
  );
}

