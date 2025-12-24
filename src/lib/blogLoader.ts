import type React from "react";

export interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  tags?: string[];
}

export interface BlogMDXModule {
  default: React.ComponentType;
  frontmatter?: BlogMetadata;
}

// Get all blog post IDs dynamically from the blogs folder using Vite's import.meta.glob
// This is efficient and doesn't compile all files, just gets the filenames
export function getAllBlogIds(): string[] {
  const blogModules = import.meta.glob("../blogs/*.mdx", { eager: false });
  return Object.keys(blogModules).map((path) => {
    // Extract filename from path: "../blogs/filename.mdx" -> "filename"
    // Path format: "../blogs/filename.mdx"
    const match = path.match(/blogs\/([^/]+)\.mdx$/);
    return match ? match[1] : "";
  }).filter(Boolean);
}

// Load MDX content from src/blogs/{id}.mdx files as React components
// This is called when entering the blog page
export async function loadBlogContent(id: string): Promise<BlogMDXModule> {
  try {
    // Import MDX file as a React component
    const module = await import(`../blogs/${id}.mdx`);
    return module as BlogMDXModule;
  } catch (error) {
    console.error(`Failed to load blog content for ${id}:`, error);
    throw error;
  }
}

// Get all blog posts by reading their frontmatter dynamically
export async function getAllBlogPosts(): Promise<Array<BlogMetadata & { id: string }>> {
  // Get all blog IDs dynamically from the blogs folder
  const blogIds = getAllBlogIds();

  const posts = await Promise.all(
    blogIds.map(async (id) => {
      try {
        const module = await loadBlogContent(id);
        const frontmatter = module.frontmatter || {
          title: "Untitled",
          description: "",
          date: new Date().toISOString().split("T")[0],
          tags: [],
        };
        return { ...frontmatter, id };
      } catch (error) {
        console.error(`Failed to load metadata for ${id}:`, error);
        return {
          id,
          title: "Error loading post",
          description: "Failed to load post metadata",
          date: new Date().toISOString().split("T")[0],
          tags: [],
        };
      }
    })
  );

  return posts;
}

