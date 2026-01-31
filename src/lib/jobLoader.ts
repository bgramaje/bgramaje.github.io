import type React from "react";

export interface JobMDXModule {
  default: React.ComponentType;
  frontmatter?: { title?: string; company?: string; role?: string; period?: string };
}

const jobModules = import.meta.glob<JobMDXModule>("../mdx/jobs/*.mdx", { eager: false });

/** Extract id from glob path: "../mdx/jobs/0.mdx" -> "0" */
function idFromPath(path: string): string {
  const match = path.match(/mdx\/jobs\/([^/]+)\.mdx$/);
  return match ? match[1] : "";
}

/** All job IDs from src/mdx/jobs/*.mdx */
export function getAllJobIds(): string[] {
  return Object.keys(jobModules)
    .map(idFromPath)
    .filter(Boolean);
}

const contentCache = new Map<string, Promise<JobMDXModule>>();

/** Load MDX for one job by id (e.g. "0", "1", "2"). Cached. */
export async function loadJobContent(id: string): Promise<JobMDXModule> {
  const cached = contentCache.get(id);
  if (cached) return cached;

  const path = `../mdx/jobs/${id}.mdx`;
  const loader = jobModules[path];
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
