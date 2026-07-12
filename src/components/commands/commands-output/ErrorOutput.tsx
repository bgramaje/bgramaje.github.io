interface ErrorOutputProps {
  command: string;
}

export function ErrorOutput({ command }: ErrorOutputProps) {
  return (
    <div className="space-y-1">
      <p className="text-destructive">
        bgramaje: command not found: <span className="text-foreground">{command}</span>
      </p>
      <p className="text-muted-foreground text-sm">
        Type <span className="text-success">help</span> to see available commands
      </p>
    </div>
  );
}
