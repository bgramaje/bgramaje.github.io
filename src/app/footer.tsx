import { useState } from "react";
import { socialLinks } from "@/content/data/portfolio";
import { pageWidthClass } from "@/lib/utils";

const footerLinkClass =
  "inline-flex min-h-8 items-center rounded-sm px-1 text-muted-foreground transition-[color,transform] active:scale-[0.96] hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function SiteFooter() {
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);

  const handleCvClick = async () => {
    if (cvLoading) return;
    setCvLoading(true);
    setCvError(null);
    try {
      const { downloadResumePdfFromYaml } = await import("@/components/cv/downloadResumePdf");
      await downloadResumePdfFromYaml("en");
    } catch (err) {
      console.error(err);
      setCvError("Could not generate the CV PDF. Please try again.");
    } finally {
      setCvLoading(false);
    }
  };

  return (
    <footer className="shrink-0 bg-background">
      <div className={`${pageWidthClass} flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1 text-xs`}>
        <span className="text-muted-foreground">© {new Date().getFullYear()} bgramaje</span>
        <nav aria-label="Social links" className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target={link.icon === "mail" ? undefined : "_blank"}
              rel={link.icon === "mail" ? undefined : "noopener noreferrer"}
              className={footerLinkClass}
            >
              {link.name}
            </a>
          ))}
          <button
            type="button"
            onClick={handleCvClick}
            disabled={cvLoading}
            className={`${footerLinkClass} disabled:opacity-60`}
            aria-busy={cvLoading}
            aria-label="Download CV PDF"
          >
            {cvLoading ? "CV…" : "CV"}
          </button>
        </nav>
      </div>
      {cvError ? (
        <p role="alert" className={`${pageWidthClass} pb-2 text-xs text-destructive`}>
          {cvError}
        </p>
      ) : null}
    </footer>
  );
}
