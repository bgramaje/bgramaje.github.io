import { personalInfo, socialLinks } from "@/data/portfolio";

export function ContactOutput() {
  return (
    <div className="space-y-2">
      <p className="text-terminal-accent font-semibold">Contact & Social:</p>
      <div className="space-y-2">
        <p className="text-terminal-text">
          <span className="text-terminal-muted">Email:</span>{" "}
          <a href={`mailto:${personalInfo.email}`} className="text-terminal-cyan hover:underline">
            {personalInfo.email}
          </a>
        </p>
        <p className="text-terminal-text">
          <span className="text-terminal-muted">Location:</span>{" "}
          <span className="text-terminal-muted">{personalInfo.location}</span>
        </p>
      </div>
      <div className="flex flex-wrap gap-4 pt-0">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-terminal-border/50 rounded hover:bg-terminal-border transition-colors text-terminal-success"
          >
            <span>{link.name}</span>
            <span className="text-terminal-muted">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

