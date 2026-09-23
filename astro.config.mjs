// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

const siteUrl = process.env.PUBLIC_SITE_URL ?? 'https://slaptrailer.se';

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/tack'),
    }),
  ],
});
