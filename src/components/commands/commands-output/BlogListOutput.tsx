import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBlogPosts } from "@/lib/blogLoader";

export function BlogListOutput() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Array<{ id: string; title: string; date: string; description: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBlogPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-terminal-muted text-sm">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-terminal-border border-t-terminal-accent" />
        Loading posts…
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="text-terminal-muted text-sm">No posts yet.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-terminal-accent font-semibold text-sm">Blog posts:</p>
      <ul className="space-y-1.5">
        {posts.map((post) => (
          <li key={post.id}>
            <button
              type="button"
              onClick={() => navigate(`/blog/${post.id}`)}
              className="group flex w-full flex-col items-start gap-0.5 rounded-lg border border-terminal-border/50 bg-terminal-bg/30 px-2 py-1.5 text-left text-xs transition-colors hover:border-terminal-accent/50 hover:bg-terminal-border/30"
            >
              <span className="font-medium text-terminal-text group-hover:text-terminal-accent">
                {post.title}
              </span>
              <span className="text-terminal-muted line-clamp-1">{post.description}</span>
              <span className="text-terminal-muted/80 text-[10px]">{post.date}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-terminal-muted text-xs pt-0.5">
        Click a post to read it. Type <span className="text-terminal-text">help</span> for commands.
      </p>
    </div>
  );
}
