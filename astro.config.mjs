// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Assumption: deployed to the GitHub Pages user site (dangvu3627.github.io), served at the root.
// If a custom domain is picked, change `site` here.
export default defineConfig({
  site: 'https://dangvu3627.github.io',
  output: 'static',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
});
