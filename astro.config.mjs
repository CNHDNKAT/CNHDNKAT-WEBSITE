// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import remarkTypograf from "@mavrin/remark-typograf";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://cnhdnkat.com",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/capture-c"),
    }),
  ],
  markdown: {
    remarkPlugins: [[remarkTypograf, { locale: ["ru"] }]],
  },
});
