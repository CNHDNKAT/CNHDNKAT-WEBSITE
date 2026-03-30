// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://cnhdnkat.com",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/capture-c"),
    }),
  ],
});
