import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const site = "https://bgramaje.github.io";
const blogDir = path.resolve("src/content/mdx/blogs");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return parseYaml(match[1]) ?? {};
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toRfc822(dateStr) {
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return new Date().toUTCString();
  return new Date(t).toUTCString();
}

function pickDefaultLocale(locales) {
  if (locales.includes("en")) return "en";
  return [...locales].sort()[0];
}

async function discoverPosts() {
  const entries = await readdir(blogDir, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dir = path.join(blogDir, entry.name);
      const files = (await readdir(dir)).filter((f) => f.endsWith(".mdx"));
      const variants = await Promise.all(
        files.map(async (file) => {
          const locale = file.replace(/\.mdx$/, "");
          const raw = await readFile(path.join(dir, file), "utf8");
          const fm = parseFrontmatter(raw);
          return { locale, ...fm };
        }),
      );
      posts.push({ id: entry.name, variants });
      continue;
    }

    if (entry.name.endsWith(".mdx")) {
      const id = entry.name.replace(/\.mdx$/, "");
      const raw = await readFile(path.join(blogDir, entry.name), "utf8");
      const fm = parseFrontmatter(raw);
      posts.push({ id, variants: [{ locale: null, ...fm }] });
    }
  }

  return posts.sort((a, b) => a.id.localeCompare(b.id));
}

function postPaths(post) {
  const multi = post.variants.some((v) => v.locale);
  if (!multi) {
    const v = post.variants[0];
    return [{ path: `/blog/${post.id}`, lastmod: v.date, variant: v }];
  }
  return post.variants
    .filter((v) => v.locale)
    .sort((a, b) => a.locale.localeCompare(b.locale))
    .map((v) => ({
      path: `/blog/${post.id}/${v.locale}`,
      lastmod: v.date,
      variant: v,
    }));
}

const posts = await discoverPosts();
const urlEntries = [
  { path: "/", lastmod: null },
  { path: "/blog", lastmod: null },
  ...posts.flatMap(postPaths),
];

const latestDate = posts
  .flatMap((p) => p.variants.map((v) => v.date))
  .filter(Boolean)
  .sort()
  .at(-1);

for (const entry of urlEntries) {
  if (!entry.lastmod && latestDate && entry.path !== "/") {
    entry.lastmod = latestDate;
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries
  .map(({ path: p, lastmod }) => {
    const loc = `${site}${p}`;
    const mod = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${loc}</loc>${mod}\n  </url>`;
  })
  .join("\n")}
</urlset>
`;

const feedItems = posts.flatMap((post) => {
  const multi = post.variants.some((v) => v.locale);
  const variants = multi
    ? post.variants.filter((v) => v.locale)
    : post.variants;
  return variants.map((v) => {
    const href = multi
      ? `${site}/blog/${post.id}/${v.locale}`
      : `${site}/blog/${post.id}`;
    return { href, title: v.title, description: v.description, date: v.date };
  });
});

feedItems.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>bgramaje | Blog</title>
    <link>${site}/blog</link>
    <description>Blog posts by bgramaje on software engineering, IoT, and data platforms.</description>
    <language>en</language>
    <lastBuildDate>${toRfc822(latestDate ?? new Date().toISOString().slice(0, 10))}</lastBuildDate>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>
${feedItems
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.href}</link>
      <guid isPermaLink="true">${item.href}</guid>
      <pubDate>${toRfc822(item.date)}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

await writeFile("public/sitemap.xml", sitemap);
await writeFile("public/feed.xml", feed);
