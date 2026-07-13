import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { useMDXComponents } from "@/lib/mdx-components";
import { BlogLocaleBanner } from "@/components/blog/BlogLocaleBanner";
import { PublishedBlock } from "@/components/shared/PublishedBlock";
import { useDocumentHead } from "@/lib/useDocumentHead";
import {
  getBlogAlternates,
  getBlogLocales,
  getBlogPostPath,
  getBlogPostUrl,
  loadBlogContent,
  type BlogMetadata,
} from "@/lib/blogLoader";
import { loadHighlightCss } from "@/lib/load-highlight-css";
import { cn } from "@/lib/utils";

interface BlogPostProps {
  id: string;
  locale?: string;
}

function publishedCopy(locale: string | null) {
  if (locale === "es") return { label: "Publicado el" as const, intl: "es-ES" as const };
  return { label: "Published on" as const, intl: "en-GB" as const };
}

function contentLang(locale: string | null): "en" | "es" {
  return locale === "es" ? "es" : "en";
}

export function BlogPost({ id, locale: localeParam }: BlogPostProps) {
  const [searchParams] = useSearchParams();
  const locales = useMemo(() => getBlogLocales(id), [id]);
  const langParam = searchParams.get("lang");

  const effectiveLocale = useMemo(() => {
    if (!locales.length) return null;
    if (localeParam && locales.includes(localeParam)) return localeParam;
    return null;
  }, [locales, localeParam]);

  const [MDXContent, setMDXContent] = useState<ComponentType | null>(null);
  const [meta, setMeta] = useState<BlogMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canonical = getBlogPostUrl(id, effectiveLocale ?? undefined);
  const alternates = useMemo(() => getBlogAlternates(id), [id]);
  const structuredData = useMemo(
    () =>
      meta
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: meta.title,
            description: meta.description,
            author: {
              "@type": "Person",
              name: "Borja Gramaje",
              url: "https://bgramaje.github.io/",
            },
            datePublished: meta.date,
            dateModified: meta.date,
            mainEntityOfPage: canonical,
            inLanguage: effectiveLocale ?? undefined,
          }
        : undefined,
    [canonical, effectiveLocale, meta],
  );
  const components = useMDXComponents({
    h1: () => null,
  });

  useDocumentHead({
    title: meta ? `${meta.title} | bgramaje` : "bgramaje | Borja",
    description: meta?.description,
    canonical,
    lang: contentLang(effectiveLocale),
    alternates: locales.length ? alternates : undefined,
    structuredData,
  });

  useEffect(() => {
    loadHighlightCss();
  }, []);

  useEffect(() => {
    if (!effectiveLocale && locales.length) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    loadBlogContent(id, effectiveLocale ?? undefined)
      .then((module) => {
        if (!cancelled) {
          setMDXContent(() => module.default);
          setMeta(module.frontmatter ?? null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, effectiveLocale, locales.length]);

  if (langParam && locales.includes(langParam)) {
    return <Navigate to={getBlogPostPath(id, langParam)} replace />;
  }

  const wrapperClass = "space-y-2 pr-0 md:pr-2 pl-0 md:pl-2 font-sans pb-20";
  const typesetClass = "typeset typeset-docs max-w-[42em]";
  const entryHeaderClass = "typeset typeset-docs w-full max-w-none";
  const pub = publishedCopy(effectiveLocale);
  const lang = contentLang(effectiveLocale);

  if (loading) {
    return (
      <div className={wrapperClass} lang={lang}>
        <div role="status" className="flex items-center gap-2 py-6 text-muted-foreground text-sm">
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary"
            aria-hidden="true"
          />
          Loading…
        </div>
      </div>
    );
  }

  if (error || !MDXContent) {
    return (
      <div className={wrapperClass} lang={lang}>
        <p className="text-destructive" role="alert">
          {error ?? "Failed to load post"}: <span className="text-foreground">{id}</span>
        </p>
      </div>
    );
  }

  const Content = MDXContent;
  return (
    <div className={wrapperClass} lang={lang}>
      <header className="mb-4 w-full space-y-3">
        <div
          className={cn(
            entryHeaderClass,
            "flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-4",
          )}
        >
          {meta?.title ? (
            <h1 className="min-w-0 flex-1 !mt-0 mb-0 text-balance">{meta.title}</h1>
          ) : null}
          {meta?.date ? (
            <PublishedBlock
              date={meta.date}
              label={pub.label}
              locale={pub.intl}
              className="mb-0 shrink-0 self-start md:self-auto"
            />
          ) : null}
        </div>
        {locales.length > 1 && effectiveLocale ? (
          <div className="not-typeset w-full">
            <BlogLocaleBanner postId={id} currentLocale={effectiveLocale} className="w-full" />
          </div>
        ) : null}
      </header>
      <div className={typesetClass}>
        <MDXProvider components={components}>
          <Content />
        </MDXProvider>
      </div>
    </div>
  );
}
