import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";

import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

import mdxMermaid from "mdx-mermaid";
import rehypeHighlight from "rehype-highlight";

export default defineConfig({
  base: "/", // Para repositorios de usuario (bgramaje.github.io), usar "/"
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  plugins: [
    react(),
    {
      enforce: "pre",
      ...mdx({
        jsxImportSource: "react",
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkGfm,
          [mdxMermaid, { output: "svg" }],
        ],
        rehypePlugins: [
          rehypeHighlight,
        ],
      }),
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
