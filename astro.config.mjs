import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [tailwind()],
  env: {
    schema: {
      WORDPRESS_URL: {
        type: 'string',
        context: 'server',
        access: 'public',
        optional: true,
        default: 'https://st.melyweb.net',
      },
      SITE_NAME: {
        type: 'string',
        context: 'server',
        access: 'public',
        optional: true,
        default: 'MelyWeb',
      },
    },
  },
});
