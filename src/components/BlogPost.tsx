import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useSearchParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { useMDXComponents } from "@/mdx-components";
import { PublishedBlock } from "@/components/mdx/PublishedBlock";
import { SegmentedNavGroup, segmentedNavItemClassName } from "@/components/ui/segmented-nav";
import {
  getBlogLocales,
  getDefaultBlogLocale,
  loadBlogContent,
  type BlogMetadata,
} from "@/lib/blogLoader";
import { cn } from "@/lib/utils";

interface BlogPostProps {
  id: string;
}

function publishedCopy(locale: string | null) {
  if (locale === "en") return { label: "Published on" as const, intl: "en-GB" as const };
  if (locale === "es") return { label: "Publicado el" as const, intl: "es-ES" as const };
  return { label: "Publicado el" as const, intl: "es-ES" as const };
}

export function BlogPost({ id }: BlogPostProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const locales = useMemo(() => getBlogLocales(id), [id]);
  const langParam = searchParams.get("lang");
  const localesKey = locales.join(",");

  const effectiveLocale = useMemo(() => {
    if (!locales.length) return null;
    if (langParam && locales.includes(langParam)) return langParam;
    return getDefaultBlogLocale(id)!;
  }, [id, locales, langParam]);

  useEffect(() => {
    if (!locales.length) {
      if (langParam !== null) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("lang");
            return next;
          },
          { replace: true }
        );
      }
      return;
    }
    if (!langParam || !locales.includes(langParam)) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("lang", effectiveLocale!);
          return next;
        },
        { replace: true }
      );
    }
  }, [id, localesKey, langParam, effectiveLocale, setSearchParams]);

  const [MDXContent, setMDXContent] = useState<ComponentType | null>(null);
  const [meta, setMeta] = useState<BlogMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const components = useMDXComponents({});

  useEffect(() => {
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
  }, [id, effectiveLocale]);

  const wrapperClass = "space-y-2 pr-0 md:pr-2 pl-0 md:pl-2 font-sans pb-20";
  const proseClass = "prose prose-invert prose-sm max-w-none relative";

  const pub = publishedCopy(effectiveLocale);

  if (loading) {
    return (
      <div className={wrapperClass}>
        <div className="flex items-center gap-2 py-6 text-terminal-muted text-sm">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-terminal-border border-t-terminal-accent" />
          Loading…
        </div>
      </div>
    );
  }

  if (error || !MDXContent) {
    return (
      <div className={wrapperClass}>
        <p className="text-terminal-error">
          {error ?? "Failed to load post"}: <span className="text-terminal-text">{id}</span>
        </p>
      </div>
    );
  }

  const Content = MDXContent;
  const showMetaBar = locales.length > 0 || Boolean(meta?.date);

  return (
    <div className={wrapperClass}>
      {showMetaBar ? (
        <div
          className={cn(
            "mb-3 flex w-full min-h-8 flex-nowrap items-center gap-3",
            locales.length > 0 && meta?.date ? "justify-between" : "justify-end"
          )}
        >
          <div className="flex h-8 min-w-0 shrink-0 items-center">
            {locales.length > 0 ? (
              <SegmentedNavGroup role="tablist" aria-label="Article language">
                {locales.map((loc) => {
                  const active = loc === effectiveLocale;
                  return (
                    <button
                      key={loc}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={segmentedNavItemClassName(active)}
                      onClick={() =>
                        setSearchParams(
                          (prev) => {
                            const next = new URLSearchParams(prev);
                            next.set("lang", loc);
                            return next;
                          },
                          { replace: true }
                        )
                      }
                    >
                      {loc}
                    </button>
                  );
                })}
              </SegmentedNavGroup>
            ) : null}
          </div>
          {meta?.date ? (
            <div className="flex h-8 shrink-0 items-center justify-end">
              <PublishedBlock
                date={meta.date}
                label={pub.label}
                locale={pub.intl}
                className="mb-0"
              />
            </div>
          ) : null}
        </div>
      ) : null}
      <div className={proseClass}>
        <MDXProvider components={components}>
          <Content />
        </MDXProvider>
      </div>
    </div>
  );
}
