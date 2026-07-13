import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { getAllBlogPosts, getBlogPostPath, getDefaultBlogLocale } from "@/lib/loaders/blogLoader";
import { pageShellClass } from "@/lib/utils";
import { useDocumentHead } from "@/lib/useDocumentHead";

const enterVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function parsePostDate(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

function formatListDate(value: string, locale = "en-GB"): string {
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
    lang: "en",
  });

  return (
    <div className={`${pageShellClass} py-8 pb-16 min-h-full`}>
      <motion.header
        className="mb-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h1
          variants={enterVariants}
          transition={{ duration: 0.3 }}
          className="text-foreground font-bold font-mono text-3xl md:text-4xl leading-tight uppercase tracking-tight text-balance"
        >
          Blog
        </motion.h1>
        <motion.p
          variants={enterVariants}
          transition={{ duration: 0.3 }}
          className="text-muted-foreground text-sm font-sans mt-1.5 text-pretty"
        >
          Thoughts, projects, and notes
        </motion.p>
      </motion.header>

      <ul className="space-y-4" role="list">
        {sortedPosts.map((post, i) => {
          const tags = post.tags?.filter(Boolean).slice(0, 4) ?? [];
          const locale = getDefaultBlogLocale(post.id) ?? "en-GB";
          return (
            <motion.li
              key={post.id}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
            >
              <Link
                to={getBlogPostPath(post.id, getDefaultBlogLocale(post.id))}
                className="group flex gap-4 rounded-xl bg-card p-4 md:p-5 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chart-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex-1 min-w-0">
                  <time
                    dateTime={post.date}
                    className="block font-mono text-xs text-muted-foreground tabular-nums mb-1"
                  >
                    {formatListDate(post.date, locale)}
                  </time>
                  <h2 className="font-mono font-semibold text-foreground text-sm md:text-base leading-snug text-balance group-hover:text-chart-3 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-sans line-clamp-2 text-pretty mt-1.5">
                    {post.description}
                  </p>
                  {tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5 mt-3" aria-label="Tags">
                      {tags.map((tag) => (
                        <li key={tag}>
                          <span className="inline-block rounded-md border border-border/40 bg-muted/50 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                            {tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {sortedPosts.length === 0 && (
        <p className="text-muted-foreground text-sm font-sans rounded-lg border border-dashed border-border/50 px-4 py-6 text-center">
          No posts yet.
        </p>
      )}
    </div>
  );
}
