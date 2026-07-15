import type React from "react";

export interface JobFrontmatter {
  title?: string;
  company?: string;
  role?: string;
  period?: string;
}

export interface JobMDXModule {
  default: React.ComponentType;
  frontmatter?: JobFrontmatter;
}

const jobModules = import.meta.glob<JobMDXModule>("@/content/mdx/jobs/*.mdx");

function idFromPath(path: string): string {
  const match = path.match(/jobs\/([^/]+)\.mdx$/);
  return match ? match[1] : "";
}

type JobModuleLoader = () => Promise<JobMDXModule>;

const loadersById = new Map<string, JobModuleLoader>();
for (const [path, loader] of Object.entries(jobModules)) {
  const id = idFromPath(path);
  if (id && loader) loadersById.set(id, loader);
}

/** All job IDs from src/content/mdx/jobs/*.mdx */
export function getAllJobIds(): string[] {
  return [...loadersById.keys()];
}

const contentCache = new Map<string, Promise<JobMDXModule>>();

/** Load MDX for one job by slug (e.g. "devoltec-sl"). Cached. */
export async function loadJobContent(id: string): Promise<JobMDXModule> {
  const cached = contentCache.get(id);
  if (cached) return cached;

  const loader = loadersById.get(id);
  if (!loader) {
    const err = new Error(`Job not found: ${id}`);
    contentCache.set(id, Promise.reject(err));
    throw err;
  }

  const promise = loader().then((module) => {
    const typed = module as JobMDXModule;
    if (!typed.default) throw new Error(`Invalid MDX module for job ${id}: missing default export`);
    return typed;
  });
  contentCache.set(id, promise);
  return promise;
}
