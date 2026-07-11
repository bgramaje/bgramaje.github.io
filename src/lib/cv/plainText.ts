/** Convierte fragmentos Markdown habituales del YAMLResume a texto plano para el PDF. */
export function plainFromMarkdown(md: string): string {
  return md
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .trim();
}

export function bulletLines(summary: string | undefined): string[] {
  if (!summary) return [];
  return summary
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"))
    .map((l) => plainFromMarkdown(l.replace(/^-\s*/, "")))
    .filter(Boolean);
}

export function introLines(summary: string | undefined): string[] {
  if (!summary) return [];
  return summary
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("-"))
    .map((l) => plainFromMarkdown(l))
    .filter(Boolean);
}

export function paragraphLines(summary: string | undefined): string[] {
  if (!summary) return [];
  const bullets = bulletLines(summary);
  if (bullets.length > 0) return bullets;
  return summary
    .split("\n")
    .map((l) => plainFromMarkdown(l.trim()))
    .filter(Boolean);
}
