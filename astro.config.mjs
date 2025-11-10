import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://rensoconese.github.io',
  base: '/remax-titanium-intranet/',
  integrations: [
    react(),
    tailwind()
  ],
  output: 'static',
  server: {
    port: 4321,
    host: true
  }
});
