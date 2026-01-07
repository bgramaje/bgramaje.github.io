import { publications } from "@/data/portfolio";

export function PublicationsOutput() {
  return (
    <div className="space-y-2">
      <p className="text-terminal-accent font-semibold mb-2">Scientific Publications:</p>
      {publications.map((pub) => (
        <div key={pub.uid} className="space-y-1 pb-4 border-b border-terminal-border/30 last:border-0">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-terminal-success font-medium flex-1">{pub.title}</h3>
            {pub.link && (
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-accent text-sm hover:underline shrink-0"
              >
                [View ↗]
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-terminal-muted">{pub.publisher}</span>
            <span className="text-terminal-cyan">{pub.role}</span>
          </div>
          <p className="text-terminal-text/80 text-sm leading-relaxed">{pub.description}</p>
          <div className="flex flex-wrap gap-2">
            {pub.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-terminal-border/50 text-terminal-accent rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

