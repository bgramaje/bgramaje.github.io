import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const site = "https://bgramaje.github.io";
const blogDir = path.resolve("src/content/mdx/blogs");

const entries = await readdir(blogDir, { withFileTypes: true });
const ids = entries
  .map((e) => (e.isDirectory() ? e.name : e.name.replace(/\.mdx$/, "")))
  .filter(Boolean);

const urls = ["/", "/blog", ...ids.sort().map((id) => `/blog/${id}`)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${site}${url}</loc></url>`).join("\n")}
</urlset>
`;

await writeFile("public/sitemap.xml", xml);
