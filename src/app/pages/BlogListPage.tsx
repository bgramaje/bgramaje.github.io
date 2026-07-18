import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { getAllBlogPosts, getBlogPostPath, getDefaultBlogLocale } from "@/lib/loaders/blogLoader";
import { cn, pageShellClass } from "@/lib/utils";
import { useDocumentHead } from "@/lib/useDocumentHead";

const springEnter = { type: "spring" as const, bounce: 0, duration: 0.35 };

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

type BlogPostMeta = (typeof sortedPosts)[number];

function BlogPostCard({
  post,
  enterHidden,
  enterVisible,
  enterTransition,
}: {
  post: BlogPostMeta;
  enterHidden: { opacity: number; y?: number };
  enterVisible: { opacity: number; y?: number };
  enterTransition: typeof springEnter | { duration: number };
}) {
  const tags = post.tags?.filter(Boolean).slice(0, 4) ?? [];
  const locale = getDefaultBlogLocale(post.id) ?? "en-GB";

  return (
    <motion.li
      variants={{ hidden: enterHidden, visible: enterVisible }}
      transition={enterTransition}
    >
      <Link
        to={getBlogPostPath(post.id, getDefaultBlogLocale(post.id))}
        className={cn(
          "group relative flex min-h-11 items-start gap-3 rounded-2xl bg-card p-4 md:gap-4 md:p-5",
          "shadow-[var(--shadow-border)]",
          "transition-[transform,box-shadow] duration-200 ease-out",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]",
          "active:scale-[0.96]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chart-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <div className="min-w-0 flex-1">
          <time
            dateTime={post.date}
            className="mb-1 block font-mono text-xs tabular-nums tracking-wide text-muted-foreground"
          >
            {formatListDate(post.date, locale)}
          </time>
          <h2 className="text-balance font-mono text-sm font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-chart-3 md:text-base">
            {post.title}
          </h2>
          <p className="mt-1.5 line-clamp-2 text-pretty font-sans text-xs leading-relaxed text-muted-foreground md:text-sm">
            {post.description}
          </p>
          {tags.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
              {tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-block rounded-md bg-muted/70 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <span
          className={cn(
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground",
            "opacity-40 transition-[opacity,transform,color] duration-200 ease-out",
            "group-hover:translate-x-0.5 group-hover:text-chart-3 group-hover:opacity-100",
            "group-focus-visible:translate-x-0.5 group-focus-visible:text-chart-3 group-focus-visible:opacity-100",
          )}
          aria-hidden
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </Link>
    </motion.li>
  );
}

export function BlogListPage() {
  const reduceMotion = useReducedMotion();
  const enterHidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 };
  const enterVisible = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const enterTransition = reduceMotion ? { duration: 0.2 } : springEnter;

  useDocumentHead({
    title: "Blog | bgramaje",
    description: "Blog posts by bgramaje",
    canonical: "https://bgramaje.github.io/blog",
    lang: "en",
  });

  return (
    <div className={`${pageShellClass} min-h-full py-8 pb-16`}>
      <motion.header
        className="mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
          },
        }}
      >
        <motion.h1
          variants={{ hidden: enterHidden, visible: enterVisible }}
          transition={enterTransition}
          className="text-balance font-mono text-3xl font-bold uppercase leading-[1.05] tracking-tighter text-foreground md:text-4xl"
        >
          Blog
        </motion.h1>
        <motion.p
          variants={{ hidden: enterHidden, visible: enterVisible }}
          transition={enterTransition}
          className="mt-2 text-pretty font-sans text-sm leading-relaxed text-muted-foreground"
        >
          Thoughts, projects, and notes
        </motion.p>
      </motion.header>

      <motion.ul
        className="space-y-3 md:space-y-4"
        role="list"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.08,
              delayChildren: reduceMotion ? 0 : 0.12,
            },
          },
        }}
      >
        {sortedPosts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            enterHidden={enterHidden}
            enterVisible={enterVisible}
            enterTransition={enterTransition}
          />
        ))}
      </motion.ul>

      {sortedPosts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/50 px-4 py-6 text-center font-sans text-sm text-muted-foreground">
          No posts yet.
        </p>
      ) : null}
    </div>
  );
}
