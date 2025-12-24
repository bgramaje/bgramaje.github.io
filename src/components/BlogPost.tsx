import { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { useMDXComponents } from "@/mdx-components";
import { loadBlogContent, type BlogMDXModule } from "@/lib/blogLoader";

interface BlogPostProps {
  id: string;
}

export function BlogPost({ id }: BlogPostProps) {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const components = useMDXComponents({});

  useEffect(() => {
    loadBlogContent(id)
      .then((module: BlogMDXModule) => {
        setMDXContent(() => module.default);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading blog content:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-terminal-muted text-sm">Loading...</div>
      </div>
    );
  }

  if (!MDXContent) {
    return (
      <div className="space-y-1">
        <p className="text-terminal-error">
          Failed to load blog post: <span className="text-terminal-text">{id}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="prose prose-invert prose-sm max-w-none">
        <MDXProvider components={components}>
          <MDXContent />
        </MDXProvider>
      </div>
    </div>
  );
}

