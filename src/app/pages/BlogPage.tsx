import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, FileDown, Github, Linkedin, Loader2 } from "lucide-react";
import { BlogPost } from "@/components/blog/BlogPost";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Dock, DockItem, DockSeparator } from "@/components/motion/dock";
import { downloadCvPdf } from "@/components/cv/CvPdfDownloadButton";
import { socialLinks } from "@/content/data/portfolio";
import { getBlogLocales, getDefaultBlogLocale, getAllBlogIds } from "@/lib/loaders/blogLoader";
import { useDocumentHead } from "@/lib/useDocumentHead";
import { pageShellClass } from "@/lib/utils";

const springEnter = { type: "spring" as const, bounce: 0, duration: 0.35 };

const backLinkClass =
  "inline-flex min-h-10 items-center gap-2 rounded-sm text-sm text-muted-foreground transition-[color,transform] duration-100 ease-out active:scale-[0.97] hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const dockLinkClass =
  "flex size-full items-center justify-center rounded-full text-foreground outline-none transition-colors hover:text-chart-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function BlogPage() {
  const { id, locale } = useParams<{ id: string; locale?: string }>();
  const reduceMotion = useReducedMotion();
  const [cvLoading, setCvLoading] = useState(false);
  const enterHidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 };
  const enterVisible = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const enterTransition = reduceMotion ? { duration: 0.2 } : springEnter;

  const postMissing = !id || !getAllBlogIds().includes(id);
  const locales = id && !postMissing ? getBlogLocales(id) : [];
  const localeInvalid =
    Boolean(locale && locales.length && !locales.includes(locale)) ||
    Boolean(locale && !locales.length);

  useDocumentHead({
    title: postMissing || localeInvalid ? "Post not found | bgramaje" : undefined,
    lang: postMissing || localeInvalid ? "en" : undefined,
  });

  if (postMissing) {
    return (
      <div className={`${pageShellClass} py-8 bg-background min-h-full`}>
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className={`mt-4 ${backLinkClass}`}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to blog
        </Link>
      </div>
    );
  }

  if (locales.length && !locale) {
    return <Navigate to={`/blog/${id}/${getDefaultBlogLocale(id)}`} replace />;
  }

  if (localeInvalid) {
    return (
      <div className={`${pageShellClass} py-8 bg-background min-h-full`}>
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className={`mt-4 ${backLinkClass}`}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to blog
        </Link>
      </div>
    );
  }

  const linkedinLink = socialLinks.find((l) => l.icon === "linkedin");
  const githubLink = socialLinks.find((l) => l.icon === "github");

  const handleCvDownload = async () => {
    if (cvLoading) return;
    setCvLoading(true);
    try {
      await downloadCvPdf();
    } catch (err) {
      console.error(err);
    } finally {
      setCvLoading(false);
    }
  };

  return (
    <div className={`${pageShellClass} relative py-6 pb-20 md:pb-24 bg-background min-h-full`}>
      <ScrollProgress className="top-0 z-50" />
      <motion.div
        initial={enterHidden}
        animate={enterVisible}
        transition={enterTransition}
        className="mb-3 md:mb-6"
      >
        <Link to="/blog" className={backLinkClass}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to blog
        </Link>
      </motion.div>
      <motion.article
        initial={enterHidden}
        animate={enterVisible}
        transition={{
          ...enterTransition,
          delay: reduceMotion ? 0 : 0.05,
        }}
        className="pb-6"
      >
        <BlogPost id={id} locale={locale} />
      </motion.article>

      <div className="pointer-events-none sticky bottom-3 z-10 mt-6 flex justify-center md:bottom-6">
        <Dock size={40} aria-label="Share and download" className="pointer-events-auto">
          {linkedinLink ? (
            <DockItem tooltip="LinkedIn" aria-label="Open bgramaje on LinkedIn">
              <a
                href={linkedinLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className={dockLinkClass}
                aria-label="Open bgramaje on LinkedIn"
              >
                <Linkedin className="h-5 w-5" aria-hidden />
              </a>
            </DockItem>
          ) : null}
          {githubLink ? (
            <DockItem tooltip="GitHub" aria-label="Open bgramaje on GitHub">
              <a
                href={githubLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className={dockLinkClass}
                aria-label="Open bgramaje on GitHub"
              >
                <Github className="h-5 w-5" aria-hidden />
              </a>
            </DockItem>
          ) : null}
          {(linkedinLink || githubLink) && <DockSeparator />}
          <DockItem
            tooltip={cvLoading ? "Generating CV…" : "Download CV"}
            aria-label={cvLoading ? "Generating CV PDF" : "Download CV PDF"}
            onClick={() => {
              void handleCvDownload();
            }}
          >
            {cvLoading ? (
              <Loader2
                className={reduceMotion ? "h-5 w-5" : "h-5 w-5 animate-spin"}
                aria-hidden
              />
            ) : (
              <FileDown className="h-5 w-5" aria-hidden />
            )}
          </DockItem>
        </Dock>
      </div>
    </div>
  );
}
