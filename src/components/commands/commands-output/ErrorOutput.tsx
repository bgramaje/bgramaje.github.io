interface ErrorOutputProps {
  command: string;
}

export function ErrorOutput({ command }: ErrorOutputProps) {
  return (
    <div className="space-y-1">
      <p className="text-terminal-error">
        bgramaje: command not found: <span className="text-terminal-text">{command}</span>
      </p>
      <p className="text-terminal-muted text-sm">
        Type <span className="text-terminal-success">help</span> to see available commands
      </p>
    </div>
  );
}
