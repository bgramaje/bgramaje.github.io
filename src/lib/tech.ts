/** Slug to readable label: nodedotjs -> Node.js, react -> React */
export function slugToLabel(slug: string): string {
  const s = slug.trim().toLowerCase().replace(/\s+/g, "");
  const withDots = s.replace(/dot/g, ".");
  return withDots.charAt(0).toUpperCase() + withDots.slice(1);
}

export function parseSlugList(value: string): string[] {
  return value
    .replace(/\n/g, " ")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export const STACK_GROUP_LABELS: Record<string, string> = {
  platform: "Platform",
  frontend: "Frontend",
  backend: "Backend",
  data: "Data",
  messaging: "Messaging",
  infra: "Infra",
  embedded: "Embedded",
  design: "Design",
};
