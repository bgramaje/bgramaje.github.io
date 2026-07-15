import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Github, Linkedin } from "lucide-react";
import { BlogPost } from "@/components/blog/BlogPost";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { socialLinks } from "@/content/data/portfolio";
import { getBlogLocales, getDefaultBlogLocale, getAllBlogIds } from "@/lib/loaders/blogLoader";
import { useDocumentHead } from "@/lib/useDocumentHead";
import { pageShellClass } from "@/lib/utils";

const backLinkClass =
  "inline-flex min-h-10 items-center gap-2 rounded-sm text-sm text-muted-foreground transition-[color,transform] active:scale-[0.96] hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function BlogPage() {
  const { id, locale } = useParams<{ id: string; locale?: string }>();

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

  return (
    <div className={`${pageShellClass} relative py-6 pb-4 md:pb-12 bg-background min-h-full`}>
      <ScrollProgress className="top-0 z-50" />
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.25 }}
        className="mb-3 md:mb-6"
      >
        <Link to="/blog" className={backLinkClass}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to blog
        </Link>
      </motion.div>
      <motion.article
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="pb-6 md:pb-20"
      >
        <BlogPost id={id} locale={locale} />
      </motion.article>

      <div className="sticky bottom-3 md:bottom-6 z-10 mt-3 md:mt-6 flex justify-center gap-3">
        {linkedinLink && (
          <RainbowButton
            asChild
            size="icon"
            variant="default"
            className="h-10 w-10 shrink-0 rounded-lg p-0 transition-[width,transform] duration-300 ease-out"
          >
            <a
              href={linkedinLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-10 w-10 min-w-10 items-center justify-center overflow-hidden transition-[width,transform] duration-300 ease-out hover:w-[112px]"
              aria-label="Open bgramaje on LinkedIn"
            >
              <span className="flex w-full items-center justify-center">
                <Linkedin size={18} className="shrink-0" aria-hidden />
                <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-300 ease-out group-hover:ml-2 group-hover:max-w-[72px]">
                  bgramaje
                </span>
              </span>
            </a>
          </RainbowButton>
        )}
        {githubLink && (
          <RainbowButton
            asChild
            size="icon"
            variant="default"
            className="h-10 w-10 shrink-0 rounded-lg p-0 transition-[width,transform] duration-300 ease-out"
          >
            <a
              href={githubLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-10 w-10 min-w-10 items-center justify-center overflow-hidden transition-[width,transform] duration-300 ease-out hover:w-[112px]"
              aria-label="Open bgramaje on GitHub"
            >
              <span className="flex w-full items-center justify-center">
                <Github size={18} className="shrink-0" aria-hidden />
                <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-300 ease-out group-hover:ml-2 group-hover:max-w-[72px]">
                  bgramaje
                </span>
              </span>
            </a>
          </RainbowButton>
        )}
      </div>
    </div>
  );
}
