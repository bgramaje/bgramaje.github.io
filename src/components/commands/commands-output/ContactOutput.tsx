import { personalInfo, socialLinks } from "@/content/data/portfolio";
import { PROFILE_PHOTO_PATH, PROFILE_PHOTO_WEBP_PATH } from "@/components/cv/profilePhoto";
import { StaggerItem } from "@/components/commands/commands-output/StaggerItem";

export function ContactOutput() {
  return (
    <div className="flex flex-col gap-2">
      <StaggerItem index={0} className="flex items-center gap-3">
        <picture>
          <source srcSet={PROFILE_PHOTO_WEBP_PATH} type="image/webp" />
          <img
            src={PROFILE_PHOTO_PATH}
            alt={personalInfo.name}
            width={56}
            height={56}
            decoding="async"
            className="w-14 h-14 rounded-xl bg-background object-cover"
          />
        </picture>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-foreground font-medium">{personalInfo.name}</p>
          <p className="text-muted-foreground text-xs">{personalInfo.title}</p>
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center rounded-sm text-chart-3 text-xs transition-[color,transform] duration-100 ease-out active:scale-[0.97] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {personalInfo.email}
          </a>
        </div>
      </StaggerItem>
      <div className="flex flex-wrap gap-2">
        {socialLinks.map((link, i) => (
          <StaggerItem key={link.name} index={i + 1}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-1.5 py-0 text-xs rounded-md transition-[color,transform] duration-100 ease-out active:scale-[0.97] text-success hover:text-success/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span>{link.name}</span>
              <span className="text-muted-foreground" aria-hidden>↗</span>
            </a>
          </StaggerItem>
        ))}
      </div>
      <StaggerItem index={socialLinks.length + 1}>
        <p className="text-muted-foreground text-sm">
          Type <span className="text-foreground">help</span> to see available commands
        </p>
      </StaggerItem>
    </div>
  );
}
