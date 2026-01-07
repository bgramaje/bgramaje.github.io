import { personalInfo, socialLinks } from "@/data/portfolio";

export function ContactOutput() {
  return (
    <div className="space-y-2">
      <p className="text-terminal-accent font-semibold">Contact & Social:</p>
      <div className="flex items-center gap-3">
        <img
          src="/images/pic3.png"
          alt="Profile"
          className="w-14 h-14 rounded-xl border-2 border-terminal-border bg-terminal-bg object-cover"
          loading="lazy"
        />
        <div className="space-y-0.5">
          <p className="text-terminal-text font-medium">{personalInfo.name}</p>
          <p className="text-terminal-muted text-xs">{personalInfo.title}</p>
          <a href={`mailto:${personalInfo.email}`} className="text-terminal-cyan text-xs hover:underline">
            {personalInfo.email}
          </a>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 pt-0">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-terminal-border/50 rounded-lg hover:bg-terminal-border transition-colors text-terminal-success"
          >
            <span>{link.name}</span>
            <span className="text-terminal-muted">↗</span>
          </a>
        ))}
      </div>
      <p className="text-terminal-muted text-sm pt-2">
        Type <span className="text-terminal-text">help</span> to see available commands
      </p>
    </div>
  );
}

