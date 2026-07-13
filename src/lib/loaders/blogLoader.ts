import type React from "react";

export interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  tags?: readonly string[];
}

export interface BlogMDXModule {
  default: React.ComponentType;
  frontmatter?: BlogMetadata;
}

const blogModules = import.meta.glob<BlogMDXModule>("../../content/mdx/blogs/**/*.mdx");

/** Eager load just the frontmatter from each MDX file (no React component code). */
const blogFrontmatter = import.meta.glob<BlogMetadata>("../../content/mdx/blogs/**/*.mdx", {
  import: "frontmatter",
  eager: true,
});

type ModuleRef = () => Promise<BlogMDXModule>;

const ROOT_KEY = "__root__";

interface ParsedPath {
  postId: string;
  /** `null` = single file at `blogs/{postId}.mdx` */
  locale: string | null;
}

function parseBlogPath(path: string): ParsedPath | null {
  const nested = path.match(/content\/mdx\/blogs\/([^/]+)\/([^/]+)\.mdx$/);
  if (nested) {
    return { postId: nested[1], locale: nested[2] };
  }
  const root = path.match(/content\/mdx\/blogs\/([^/]+)\.mdx$/);
  if (root) {
    return { postId: root[1], locale: null };
  }
  return null;
}

const modulesByPost = new Map<string, Map<string, ModuleRef>>();

for (const path of Object.keys(blogModules)) {
  const parsed = parseBlogPath(path);
  if (!parsed) continue;
  const loader = blogModules[path];
  if (!loader) continue;
  if (!modulesByPost.has(parsed.postId)) {
    modulesByPost.set(parsed.postId, new Map());
  }
  const key = parsed.locale ?? ROOT_KEY;
  modulesByPost.get(parsed.postId)!.set(key, loader);
}

function assertValidPostShape(postId: string, map: Map<string, ModuleRef>) {
  const hasRoot = map.has(ROOT_KEY);
  if (hasRoot && map.size > 1) {
    throw new Error(`Blog "${postId}" cannot mix a root .mdx with locale files in a subfolder.`);
  }
}

for (const [postId, map] of modulesByPost) {
  assertValidPostShape(postId, map);
}

function pickDefaultLocale(locales: string[]): string {
  if (locales.includes("en")) return "en";
  return [...locales].sort()[0]!;
}

/** All blog post ids (folder name or root filename, deduped). */
export function getAllBlogIds(): string[] {
  return [...modulesByPost.keys()].sort();
}

/**
 * Locales available for a post (e.g. `["en","es"]`).
 * Empty array = single-file post (`blogs/foo.mdx`).
 */
export function getBlogLocales(postId: string): string[] {
  const map = modulesByPost.get(postId);
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
  const map = modulesByPost.get(postId);
  if (!map) {
    throw new Error(`Blog not found: ${postId}`);
  }

  if (map.has(ROOT_KEY)) {
    const cached = contentCache.get(postId);
    if (cached) return cached;
    const promise = map.get(ROOT_KEY)!();
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

  const promise = loader();
  contentCache.set(cacheKey, promise);
  return promise;
}

const defaultMetadata: BlogMetadata = {
  title: "Untitled",
  description: "",
  date: new Date().toISOString().split("T")[0],
  tags: [],
};

/** Map blog path → metadata from eager frontmatter glob */
const blogFrontmatterMap = new Map<string, BlogMetadata>();

function frontmatterKey(postId: string, locale: string | null): string {
  return locale ? `${postId}:${locale}` : postId;
}

for (const [path, frontmatter] of Object.entries(blogFrontmatter)) {
  const parsed = parseBlogPath(path);
  if (!parsed || !frontmatter) continue;
  blogFrontmatterMap.set(
    frontmatterKey(parsed.postId, parsed.locale),
    frontmatter as BlogMetadata,
  );
}

export const BLOG_SITE_ORIGIN = "https://bgramaje.github.io";

export function getBlogPostPath(postId: string, locale?: string): string {
  const locales = getBlogLocales(postId);
  if (locales.length) {
    const loc =
      locale && locales.includes(locale) ? locale : pickDefaultLocale(locales);
    return `/blog/${postId}/${loc}`;
  }
  return `/blog/${postId}`;
}

export function getBlogPostUrl(postId: string, locale?: string): string {
  return `${BLOG_SITE_ORIGIN}${getBlogPostPath(postId, locale)}`;
}

export function getBlogAlternates(
  postId: string,
): Array<{ hreflang: string; href: string }> {
  const locales = getBlogLocales(postId);
  if (!locales.length) return [];
  const defaultLoc = pickDefaultLocale(locales);
  return [
    ...locales.map((loc) => ({
      hreflang: loc,
      href: getBlogPostUrl(postId, loc),
    })),
    { hreflang: "x-default", href: getBlogPostUrl(postId, defaultLoc) },
  ];
}

export function getBlogMetadata(postId: string, locale?: string): BlogMetadata {
  const locales = getBlogLocales(postId);
  if (locales.length) {
    const loc =
      locale && locales.includes(locale) ? locale : pickDefaultLocale(locales);
    return blogFrontmatterMap.get(frontmatterKey(postId, loc)) ?? defaultMetadata;
  }
  return blogFrontmatterMap.get(postId) ?? defaultMetadata;
}

let allPostsCache: Array<BlogMetadata & { id: string }> | null = null;

/** All posts with metadata from frontmatter. Derived synchronously at import time. */
export function getAllBlogPosts(): Array<BlogMetadata & { id: string }> {
  if (allPostsCache) return allPostsCache;
  allPostsCache = getAllBlogIds().map((id) => {
    const metadata = getBlogMetadata(id);
    return { ...metadata, id };
  });
  return allPostsCache;
}
