import { useState, useEffect, useRef } from "react";
import { getAllBlogPosts, type BlogMetadata } from "@/lib/blogLoader";

interface BlogOutputProps {
  onPostClick: (postId: string) => void;
}

export function BlogOutput({ onPostClick }: BlogOutputProps) {
  const [posts, setPosts] = useState<Array<BlogMetadata & { id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllBlogPosts()
      .then((blogPosts) => {
        setPosts(blogPosts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading blog posts:", error);
        setLoading(false);
      });
  }, []);

  // Notify parent when content is loaded and rendered
  useEffect(() => {
    if (!loading && posts.length > 0 && containerRef.current) {
      // Trigger a resize event to help with scroll calculations
      window.dispatchEvent(new Event('resize'));
    }
  }, [loading, posts]);

  if (loading) {
    return (
      <div className="space-y-2">
        <p className="text-terminal-accent font-semibold mb-3">Blog Posts:</p>
        <div className="text-terminal-muted text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-2">
      <p className="text-terminal-accent font-semibold mb-3">Blog Posts:</p>
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => onPostClick(post.id)}
          className="p-3 border-2 border-terminal-border bg-terminal-bg hover:bg-terminal-border/30 hover:border-terminal-accent cursor-pointer transition-colors"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-terminal-success font-medium font-mono">{post.title}</h3>
              <span className="text-terminal-muted text-xs shrink-0">{post.date}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-terminal-muted text-xs flex-1">{post.description}</p>
              <span className="text-terminal-accent text-xs shrink-0">[Click to read]</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

