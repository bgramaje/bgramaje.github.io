let loaded = false;

/** Blog/job MDX code blocks only — kept off the home critical path. */
export function loadHighlightCss() {
  if (loaded) return;
  loaded = true;
  void import("@/styles/highlight-js/github-dark.css");
}
