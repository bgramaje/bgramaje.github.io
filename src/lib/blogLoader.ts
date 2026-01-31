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

const blogModules = import.meta.glob<BlogMDXModule>("../blogs/*.mdx", { eager: false });

/** Extract slug from glob path: "../blogs/filename.mdx" -> "filename" */
function slugFromPath(path: string): string {
  const match = path.match(/blogs\/([^/]+)\.mdx$/);
  return match ? match[1] : "";
}

/** All blog IDs from src/blogs/*.mdx (no modules loaded). */
export function getAllBlogIds(): string[] {
  return Object.keys(blogModules)
    .map(slugFromPath)
    .filter(Boolean);
}

const contentCache = new Map<string, Promise<BlogMDXModule>>();

/** Load MDX for one post. Cached per id to avoid duplicate loads. */
export async function loadBlogContent(id: string): Promise<BlogMDXModule> {
  const cached = contentCache.get(id);
  if (cached) return cached;

  const path = `../blogs/${id}.mdx`;
  const loader = blogModules[path];
  if (!loader) {
    const err = new Error(`Blog not found: ${id}`);
    contentCache.set(id, Promise.reject(err));
    throw err;
  }

  const promise = loader().then((module) => {
    const typed = module as BlogMDXModule;
    if (!typed.default) throw new Error(`Invalid MDX module for ${id}: missing default export`);
    return typed;
  });
  contentCache.set(id, promise);
  return promise;
}

const defaultMetadata: BlogMetadata = {
  title: "Untitled",
  description: "",
  date: new Date().toISOString().split("T")[0],
  tags: [],
};

let allPostsCache: Promise<Array<BlogMetadata & { id: string }>> | null = null;

/** All posts with metadata from frontmatter. Cached after first call. */
export function getAllBlogPosts(): Promise<Array<BlogMetadata & { id: string }>> {
  if (allPostsCache) return allPostsCache;

  const blogIds = getAllBlogIds();
  allPostsCache = Promise.all(
    blogIds.map(async (id) => {
      try {
        const module = await loadBlogContent(id);
        const frontmatter = module.frontmatter ?? defaultMetadata;
        return { ...frontmatter, id };
      } catch {
        return { ...defaultMetadata, id, title: "Error loading post", description: "Failed to load metadata" };
      }
    })
  );
  return allPostsCache;
}

