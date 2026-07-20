import { useMemo, type ReactNode } from "react";
import changelogMarkdown from "../../../CHANGELOG.md?raw";
import { pageShellClass } from "@/lib/utils";
import { useDocumentHead } from "@/lib/useDocumentHead";

/** ponytail: Keep-a-Changelog subset only; full MD parser if we need tables/code fences */
function renderChangelog(md: string) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={key++}>
        {listItems.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  const inline = (text: string) => {
    const parts = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i}>{part.slice(1, -1)}</code>;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return (
          <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer">
            {link[1]}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  for (const line of lines) {
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }
    flushList();
    if (line.startsWith("# ")) {
      // Skip document title — page already has an h1
    } else if (line.startsWith("## ")) {
      nodes.push(<h2 key={key++}>{inline(line.slice(3))}</h2>);
    } else if (line.startsWith("### ")) {
      nodes.push(<h3 key={key++}>{inline(line.slice(4))}</h3>);
    } else if (line.trim() === "") {
      // skip blank
    } else {
      nodes.push(<p key={key++}>{inline(line)}</p>);
    }
  }
  flushList();
  return nodes;
}

export function ChangelogPage() {
  useDocumentHead({
    title: "Changelog | bgramaje",
    description: "Latest updates and announcements for bgramaje's portfolio.",
    canonical: "https://bgramaje.github.io/changelog",
    lang: "en",
  });

  const content = useMemo(() => {
    const md =
      typeof changelogMarkdown === "string"
        ? changelogMarkdown
        : String(changelogMarkdown ?? "");
    return renderChangelog(md);
  }, []);

  return (
    <div className={`${pageShellClass} min-h-full py-8 pb-16`}>
      <header className="mb-8">
        <h1 className="text-balance font-mono text-3xl font-bold uppercase leading-[1.05] tracking-tighter text-foreground md:text-4xl">
          Changelog
        </h1>
        <p className="mt-2 text-pretty font-sans text-sm leading-relaxed text-muted-foreground">
          Latest updates and announcements
        </p>
      </header>
      <article className="typeset typeset-docs max-w-[42em]">{content}</article>
    </div>
  );
}
