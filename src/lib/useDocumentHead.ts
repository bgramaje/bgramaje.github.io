import { useEffect } from "react";

interface DocumentHead {
  title?: string;
  description?: string;
  canonical?: string;
  structuredData?: object;
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

export function useDocumentHead({ title, description, canonical, structuredData }: DocumentHead) {
  useEffect(() => {
    const prevTitle = document.title;
    const descEl = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const ogTitleEl = document.head.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescriptionEl = document.head.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]'
    );
    const canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const ogUrlEl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    const prevDesc = descEl?.getAttribute("content") ?? null;
    const prevOgTitle = ogTitleEl?.getAttribute("content") ?? null;
    const prevOgDescription = ogDescriptionEl?.getAttribute("content") ?? null;
    const prevCanonical = canonicalEl?.getAttribute("href") ?? null;
    const prevOgUrl = ogUrlEl?.getAttribute("content") ?? null;

    const updatedTitleEl = title ? upsertMeta('meta[property="og:title"]', title) : null;
    const updatedDescEl = description ? upsertMeta('meta[name="description"]', description) : null;
    const updatedOgDescriptionEl = description
      ? upsertMeta('meta[property="og:description"]', description)
      : null;
    let updatedCanonicalEl: HTMLLinkElement | null = null;
    const updatedOgUrlEl = canonical ? upsertMeta('meta[property="og:url"]', canonical) : null;
    let structuredDataEl: HTMLScriptElement | null = null;

    if (title) {
      document.title = title;
    }

    if (canonical) {
      updatedCanonicalEl = canonicalEl ?? document.createElement("link");
      updatedCanonicalEl.rel = "canonical";
      updatedCanonicalEl.href = canonical;
      if (!canonicalEl) document.head.appendChild(updatedCanonicalEl);
    }

    if (structuredData) {
      structuredDataEl = document.createElement("script");
      structuredDataEl.type = "application/ld+json";
      structuredDataEl.text = JSON.stringify(structuredData);
      document.head.appendChild(structuredDataEl);
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
      if (canonical) {
        if (canonicalEl) {
          if (prevCanonical == null) canonicalEl.remove();
          else canonicalEl.setAttribute("href", prevCanonical);
        } else {
          updatedCanonicalEl?.remove();
        }
        if (ogUrlEl) {
          if (prevOgUrl == null) ogUrlEl.remove();
          else ogUrlEl.setAttribute("content", prevOgUrl);
        } else {
          updatedOgUrlEl?.remove();
        }
      }
      structuredDataEl?.remove();
    };
  }, [title, description, canonical, structuredData]);
}
