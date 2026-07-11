import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { getAllBlogPosts } from "@/lib/blogLoader";
import type { BlogMetadata } from "@/lib/blogLoader";
import { ScrollProgress } from "@/components/ui/scroll-progress";

type BlogListItem = BlogMetadata & { id: string };

function parsePostDate(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

function formatListDate(value: string): string {
  const t = Date.parse(value);
  if (Number.isNaN(t)) return value;
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(t))
    .replace(/\./g, "");
}

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBlogPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => parsePostDate(b.date) - parsePostDate(a.date)),
    [posts]
  );

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 py-6 pb-12 bg-neutral-950 min-h-full">
        <ScrollProgress className="top-0 z-50" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2 text-sm text-terminal-muted"
        >
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-terminal-border border-t-terminal-accent" />
          Cargando…
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 py-6 pb-12 bg-neutral-950 min-h-full">
      <ScrollProgress className="top-0 z-50" />

      <header className="mb-8 border-b border-terminal-border/40 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-white font-bold font-mono text-[28px] md:text-[32px] leading-tight mb-2 mt-0 uppercase tracking-tight"
        >
          Blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-terminal-muted text-xs md:text-sm font-sans max-w-prose"
        >
          Artículos y notas. {sortedPosts.length > 0 && (
            <span className="text-terminal-muted/80">
              {sortedPosts.length} {sortedPosts.length === 1 ? "entrada" : "entradas"}.
            </span>
          )}
        </motion.p>
      </header>

      <ul className="space-y-2 md:space-y-3" role="list">
        {sortedPosts.map((post, i) => {
          const tags = post.tags?.filter(Boolean).slice(0, 4) ?? [];
          return (
            <motion.li
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 + i * 0.04 }}
            >
              <Link
                to={`/blog/${post.id}`}
                className="group flex gap-3 md:gap-4 cursor-pointer rounded-lg border border-terminal-border/50 bg-transparent px-3 py-3 md:px-4 md:py-4 transition-all duration-200 hover:border-terminal-border hover:bg-terminal-border/5 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                <div className="hidden sm:flex w-24 shrink-0 flex-col items-start gap-0.5 pt-0.5 border-r border-terminal-border/30 pr-3 md:pr-4">
                  <time
                    dateTime={post.date}
                    className="font-mono text-[10px] md:text-xs text-terminal-muted tabular-nums"
                  >
                    {formatListDate(post.date)}
                  </time>
                </div>

                <article className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-1">
                    <h2 className="font-mono font-semibold text-slate-100 text-[13px] md:text-[15px] group-hover:text-terminal-cyan transition-colors">
                      {post.title}
                    </h2>
                    <span className="sm:hidden font-mono text-[10px] text-terminal-muted/90 tabular-nums">
                      {formatListDate(post.date)}
                    </span>
                  </div>
                  <p className="text-terminal-muted text-xs md:text-sm leading-relaxed font-sans line-clamp-2 mb-2">
                    {post.description}
                  </p>
                  {tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Etiquetas">
                      {tags.map((tag) => (
                        <li key={tag}>
                          <span className="inline-block rounded border border-terminal-border/50 bg-neutral-950/60 px-1.5 py-0.5 font-mono text-[9px] md:text-[10px] uppercase tracking-wide text-terminal-muted group-hover:border-terminal-border/70">
                            {tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>

                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-md border border-transparent text-terminal-cyan text-base font-mono opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:border-terminal-border/40 group-hover:bg-terminal-border/10"
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-terminal-muted text-sm font-sans rounded-lg border border-dashed border-terminal-border/50 px-4 py-6 text-center"
        >
          No hay posts todavía.
        </motion.p>
      )}
    </div>
  );
}
