import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllBlogPosts } from "@/lib/blogLoader";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-6"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-terminal-muted hover:text-terminal-text transition-colors font-sans"
        >
          <ArrowLeft className="h-4 w-4" />
          Inicio
        </Link>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-terminal-success font-bold font-mono text-[28px] md:text-[32px] leading-tight mb-2 mt-0 uppercase tracking-tight"
      >
        Blog
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="text-terminal-muted text-xs md:text-sm font-sans mb-6"
      >
        Artículos y notas.
      </motion.p>

      <ul className="space-y-3 md:space-y-4">
        {posts.map((post, i) => (
          <motion.li
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
          >
            <Link
              to={`/blog/${post.id}`}
              className="group block cursor-pointer rounded-lg border border-terminal-border/60 bg-transparent px-3 py-3 md:px-4 md:py-4 transition-all duration-200 hover:border-terminal-border hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
            >
              <article>
                <h2 className="font-mono font-semibold text-slate-100 text-[13px] md:text-[15px] mb-1.5 group-hover:text-terminal-cyan transition-colors">
                  {post.title}
                </h2>
                <p className="text-terminal-muted text-xs md:text-sm leading-relaxed font-sans mb-3 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-terminal-muted text-[10px] md:text-xs font-sans">{post.date}</span>
                  <span className="inline-flex items-center gap-1.5 text-terminal-accent group-hover:text-terminal-cyan text-xs md:text-sm font-sans transition-colors">
                    Leer
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            </Link>
          </motion.li>
        ))}
      </ul>

      {posts.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-terminal-muted text-sm font-sans"
        >
          No hay posts todavía.
        </motion.p>
      )}
    </div>
  );
}
