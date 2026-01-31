import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllBlogPosts } from "@/lib/blogLoader";
import { ArrowRight } from "lucide-react";

export function BlogListPage() {
  const [posts, setPosts] = useState<Array<{ id: string; title: string; date: string; description: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBlogPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center px-4 bg-neutral-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-neutral-500"
        >
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
          <span>Loading posts…</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 py-6 pb-12 bg-neutral-950 min-h-full">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 text-2xl font-semibold text-neutral-100"
      >
        Blog
      </motion.h1>
      <ul className="space-y-4">
        {posts.map((post, i) => (
          <motion.li
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <article className="group rounded-xl border border-terminal-border bg-terminal-bg p-4 transition-colors hover:border-terminal-accent/50 hover:bg-terminal-surface">
              <h2 className="mb-1 font-medium text-terminal-text group-hover:text-white">
                {post.title}
              </h2>
              <p className="mb-3 text-sm text-terminal-muted line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-terminal-muted">{post.date}</span>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-1.5 text-sm font-medium text-terminal-text transition-colors hover:border-terminal-accent hover:bg-terminal-border hover:text-white"
                >
                  Leer
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          </motion.li>
        ))}
      </ul>
      {posts.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-neutral-500"
        >
          No hay posts todavía.
        </motion.p>
      )}
    </div>
  );
}
