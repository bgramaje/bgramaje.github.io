import { useEffect } from "react";

interface DocumentHead {
  title?: string;
  description?: string;
}

function upsertMeta(selector: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, attr, name] = selector.match(/\[(.+?)="(.+?)"\]/) ?? [];
    if (!attr || !name) return el;
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
}

export function useDocumentHead({ title, description }: DocumentHead) {
  useEffect(() => {
    const prevTitle = document.title;
    const descEl = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const ogTitleEl = document.head.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescriptionEl = document.head.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]'
    );
    const prevDesc = descEl?.getAttribute("content") ?? null;
    const prevOgTitle = ogTitleEl?.getAttribute("content") ?? null;
    const prevOgDescription = ogDescriptionEl?.getAttribute("content") ?? null;

    const updatedTitleEl = title ? upsertMeta('meta[property="og:title"]', title) : null;
    const updatedDescEl = description ? upsertMeta('meta[name="description"]', description) : null;
    const updatedOgDescriptionEl = description
      ? upsertMeta('meta[property="og:description"]', description)
      : null;

    if (title) {
      document.title = title;
    }

    return () => {
      document.title = prevTitle;
      if (description) {
        if (descEl) {
          if (prevDesc == null) descEl.remove();
          else descEl.setAttribute("content", prevDesc);
        } else {
          updatedDescEl?.remove();
        }
        if (ogDescriptionEl) {
          if (prevOgDescription == null) ogDescriptionEl.remove();
          else ogDescriptionEl.setAttribute("content", prevOgDescription);
        } else {
          updatedOgDescriptionEl?.remove();
        }
      }
      if (title) {
        if (ogTitleEl) {
          if (prevOgTitle == null) ogTitleEl.remove();
          else ogTitleEl.setAttribute("content", prevOgTitle);
        } else {
          updatedTitleEl?.remove();
        }
      }
    };
  }, [title, description]);
}
