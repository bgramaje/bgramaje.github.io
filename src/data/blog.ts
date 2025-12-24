export interface BlogPost {
  id: string;
  title: string;
  date: string;
  description: string;
  // content is now loaded from src/blogs/{id}.mdx
}

// Blog posts metadata - content is loaded from src/blogs/{id}.mdx files
export const blogPosts: BlogPost[] = [
  {
    id: "getting-started-with-react",
    title: "Getting Started with React",
    date: "2024-01-15",
    description: "A comprehensive guide to React for beginners",
  },
  {
    id: "typescript-best-practices",
    title: "TypeScript Best Practices",
    date: "2024-02-20",
    description: "Essential TypeScript patterns and practices",
  },
  {
    id: "building-terminal-portfolio",
    title: "Building a Terminal Portfolio",
    date: "2024-03-10",
    description: "How I built this interactive terminal-style portfolio",
  },
  {
    id: "showcase-features",
    title: "Building a Modern Web Application: A Comprehensive Guide",
    date: "2024-04-15",
    description: "A comprehensive showcase of modern web development patterns, code examples, and best practices",
  },
];

export function getBlogPost(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}

