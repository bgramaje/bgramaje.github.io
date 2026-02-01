import { publications } from "@/data/portfolio";

export function PublicationsOutput() {
  return (
    <div className="space-y-3 mx-2">
        {publications.map((pub) => (
          <div
            key={pub.uid}
            role={pub.link ? "link" : undefined}
            onClick={() => pub.link && window.open(pub.link, "_blank", "noopener,noreferrer")}
            className="flex items-start gap-3 cursor-pointer rounded-lg px-2 py-1.5 -mx-2 -my-1.5 hover:bg-terminal-border/25 transition-colors"
          >
            <span className="text-terminal-success shrink-0 mt-0.5">▸</span>
            <div className="flex-1 min-w-0">
              <p className="text-terminal-text text-sm font-medium min-w-0 truncate">{pub.title}</p>
              <p className="text-terminal-muted text-xs mt-0.5">
                {pub.publisher} · {pub.role} · {pub.tags.join(", ")}
              </p>
              <p className="text-terminal-text/70 text-xs mt-0.5 min-w-0 truncate" title={pub.description}>
                {pub.description}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
