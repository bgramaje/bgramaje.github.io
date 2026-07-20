import path from "path";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";

import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

import mdxMermaid from "mdx-mermaid";
import rehypeShiki from "@shikijs/rehype";
import { rehypeShikiOptions } from "./src/lib/shiki/config";

function modulePreloadEntry(): Plugin {
  return {
    name: "module-preload-entry",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
        if (!match) return html;
        const tag = `    <link rel="modulepreload" crossorigin href="${match[1]}">\n`;
        if (html.includes('rel="modulepreload"')) return html;
        return html.replace("  </head>", `${tag}  </head>`);
      },
    },
  };
}

export default defineConfig({
  base: "/", // Para repositorios de usuario (bgramaje.github.io), usar "/"
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  plugins: [
    tailwindcss(),
    react(),
    {
      enforce: "pre",
      // .md stays as ?raw / plain text (e.g. CHANGELOG.md); content uses .mdx only
      ...mdx({
        include: /\.mdx$/,
        jsxImportSource: "react",
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkGfm,
          [mdxMermaid, { output: "svg" }],
        ],
        rehypePlugins: [[rehypeShiki, rehypeShikiOptions]],
      }),
    },
    modulePreloadEntry(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Una sola copia de React (evita "Invalid hook call" con libs como @react-pdf/renderer)
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@react-pdf/renderer",
    ],
    exclude: ["shiki", "@shikijs/transformers"],
  },
});
