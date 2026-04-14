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

const blogModules = import.meta.glob<BlogMDXModule>("../mdx/blogs/**/*.mdx", { eager: false });

type LoaderFn = () => Promise<BlogMDXModule>;

const ROOT_KEY = "__root__";

interface ParsedPath {
  postId: string;
  /** `null` = single file at `blogs/{postId}.mdx` */
  locale: string | null;
}

function parseBlogPath(path: string): ParsedPath | null {
  const nested = path.match(/mdx\/blogs\/([^/]+)\/([^/]+)\.mdx$/);
  if (nested) {
    return { postId: nested[1], locale: nested[2] };
  }
  const root = path.match(/mdx\/blogs\/([^/]+)\.mdx$/);
  if (root) {
    return { postId: root[1], locale: null };
  }
  return null;
}

const loadersByPost = new Map<string, Map<string, LoaderFn>>();

for (const path of Object.keys(blogModules)) {
  const parsed = parseBlogPath(path);
  if (!parsed) continue;
  const loader = blogModules[path] as LoaderFn;
  if (!loadersByPost.has(parsed.postId)) {
    loadersByPost.set(parsed.postId, new Map());
  }
  const key = parsed.locale ?? ROOT_KEY;
  loadersByPost.get(parsed.postId)!.set(key, loader);
}

function assertValidPostShape(postId: string, map: Map<string, LoaderFn>) {
  const hasRoot = map.has(ROOT_KEY);
  if (hasRoot && map.size > 1) {
    throw new Error(`Blog "${postId}" cannot mix a root .mdx with locale files in a subfolder.`);
  }
}

for (const [postId, map] of loadersByPost) {
  assertValidPostShape(postId, map);
}

function pickDefaultLocale(locales: string[]): string {
  if (locales.includes("en")) return "en";
  return [...locales].sort()[0]!;
}

/** All blog post ids (folder name or root filename, deduped). */
export function getAllBlogIds(): string[] {
  return [...loadersByPost.keys()].sort();
}

/**
 * Locales available for a post (e.g. `["en","es"]`).
 * Empty array = single-file post (`blogs/foo.mdx`).
 */
export function getBlogLocales(postId: string): string[] {
  const map = loadersByPost.get(postId);
  if (!map || map.has(ROOT_KEY)) return [];
  return [...map.keys()].sort();
}

export function getDefaultBlogLocale(postId: string): string | undefined {
  const locales = getBlogLocales(postId);
  if (!locales.length) return undefined;
  return pickDefaultLocale(locales);
}

const contentCache = new Map<string, Promise<BlogMDXModule>>();

/** Load MDX for one post. For multi-locale posts, pass `locale` (e.g. `en`, `es`). */
export async function loadBlogContent(postId: string, locale?: string): Promise<BlogMDXModule> {
  const map = loadersByPost.get(postId);
  if (!map) {
    throw new Error(`Blog not found: ${postId}`);
  }

  if (map.has(ROOT_KEY)) {
    const rootLoader = map.get(ROOT_KEY)!;
    const cached = contentCache.get(postId);
    if (cached) return cached;
    const promise = rootLoader().then((module) => {
      const typed = module as BlogMDXModule;
      if (!typed.default) throw new Error(`Invalid MDX module for ${postId}: missing default export`);
      return typed;
    });
    contentCache.set(postId, promise);
    return promise;
  }

  const locales = [...map.keys()];
  const loc = locale && map.has(locale) ? locale : pickDefaultLocale(locales);
  const cacheKey = `${postId}:${loc}`;
  const cached = contentCache.get(cacheKey);
  if (cached) return cached;

  const loader = map.get(loc);
  if (!loader) {
    throw new Error(`Locale not found for ${postId}: ${loc}`);
  }

  const promise = loader().then((module) => {
    const typed = module as BlogMDXModule;
    if (!typed.default) throw new Error(`Invalid MDX module for ${postId}/${loc}: missing default export`);
    return typed;
  });
  contentCache.set(cacheKey, promise);
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
        const defaultLocale = getDefaultBlogLocale(id);
        const module = await loadBlogContent(id, defaultLocale);
        const frontmatter = module.frontmatter ?? defaultMetadata;
        return { ...frontmatter, id };
      } catch {
        return { ...defaultMetadata, id, title: "Error loading post", description: "Failed to load metadata" };
      }
    })
  );
  return allPostsCache;
}
