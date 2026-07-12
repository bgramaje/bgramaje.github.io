import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { getAllBlogPosts, getDefaultBlogLocale } from "@/lib/blogLoader";
import { pageShellClass } from "@/lib/utils";
import { useDocumentHead } from "@/lib/useDocumentHead";

function parsePostDate(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

function formatListDate(value: string, locale = "es-ES"): string {
  const t = Date.parse(value);
  if (Number.isNaN(t)) return value;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(t))
    .replace(/\./g, "");
}

const allPosts = getAllBlogPosts();
const sortedPosts = [...allPosts].sort((a, b) => parsePostDate(b.date) - parsePostDate(a.date));

export function BlogListPage() {

  useDocumentHead({
    title: "Blog | bgramaje",
    description: "Blog posts by Borja Gramaje",
    canonical: "https://bgramaje.github.io/blog",
  });

  return (
    <div className={`${pageShellClass} py-6 pb-12 bg-background min-h-full`}>

      <header className="mb-5 border-b border-border/40 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-foreground font-bold font-mono text-[28px] md:text-[32px] leading-tight mb-2 mt-0 uppercase tracking-tight"
        >
          Blog
        </motion.h1>
      </header>

      <ul className="space-y-2 md:space-y-3" role="list">
        {sortedPosts.map((post, i) => {
          const tags = post.tags?.filter(Boolean).slice(0, 4) ?? [];
          const locale = getDefaultBlogLocale(post.id) ?? "es-ES";
          return (
            <motion.li
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 + i * 0.04 }}
            >
              <Link
                to={`/blog/${post.id}`}
                className="group flex gap-3 md:gap-4 cursor-pointer rounded-lg border border-border/50 bg-transparent px-3 py-3 md:px-4 md:py-4 transition-all duration-200 hover:border-border hover:bg-border/10 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chart-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="hidden sm:flex w-24 shrink-0 flex-col items-start gap-0.5 pt-0.5 border-r border-border/30 pr-3 md:pr-4">
                  <time
                    dateTime={post.date}
                    className="font-mono text-[10px] md:text-xs text-muted-foreground tabular-nums"
                  >
                    {formatListDate(post.date, locale)}
                  </time>
                </div>

                <article className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-1">
                    <h2 className="font-mono font-semibold text-foreground text-[13px] md:text-[15px] group-hover:text-chart-3 transition-colors">
                      {post.title}
                    </h2>
                    <span className="sm:hidden font-mono text-[10px] text-muted-foreground/90 tabular-nums">
                      {formatListDate(post.date, locale)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-sans line-clamp-2 mb-2">
                    {post.description}
                  </p>
                  {tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Etiquetas">
                      {tags.map((tag) => (
                        <li key={tag}>
                          <span className="inline-block rounded border border-border/50 bg-card/80 px-1.5 py-0.5 font-mono text-[9px] md:text-[10px] uppercase tracking-wide text-muted-foreground group-hover:border-border/70">
                            {tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>

                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-md border border-transparent text-chart-3 text-base font-mono opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:border-border/40 group-hover:bg-border/10"
                  aria-hidden
                >
                  &gt;
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {sortedPosts.length === 0 && (
        <p className="text-muted-foreground text-sm font-sans rounded-lg border border-dashed border-border/50 px-4 py-6 text-center">
          No hay posts todavía.
        </p>
      )}
    </div>
  );
}
