import { personalInfo, socialLinks } from "@/content/data/portfolio";
import { PROFILE_PHOTO_PATH, PROFILE_PHOTO_WEBP_PATH } from "@/components/cv/profilePhoto";

export function ContactOutput() {
  return (
    <div className="space-y-2">
      <p className="text-primary font-semibold">Contact:</p>
      <div className="flex items-center gap-3">
        <picture>
          <source srcSet={PROFILE_PHOTO_WEBP_PATH} type="image/webp" />
          <img
            src={PROFILE_PHOTO_PATH}
            alt={personalInfo.name}
            width={56}
            height={56}
            decoding="async"
            className="w-14 h-14 rounded-xl bg-background object-cover outline outline-1 outline-[oklch(0_0_0/0.1)] dark:outline-[oklch(1_0_0/0.1)]"
          />
        </picture>
        <div className="min-w-0 space-y-0.5">
          <p className="text-foreground font-medium">{personalInfo.name}</p>
          <p className="text-muted-foreground text-xs">{personalInfo.title}</p>
          <a href={`mailto:${personalInfo.email}`} className="rounded-sm text-chart-3 text-xs hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            {personalInfo.email}
          </a>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-0">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-1 text-xs bg-border/50 rounded-lg hover:bg-border transition-colors text-success focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span>{link.name}</span>
            <span className="text-muted-foreground" aria-hidden>↗</span>
          </a>
        ))}
      </div>
      <p className="text-muted-foreground text-sm pt-0">
        Type <span className="text-foreground">help</span> to see available commands
      </p>
    </div>
  );
}
