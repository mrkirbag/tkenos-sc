import { defineConfig, envField } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://xn--tkeos-sc-f3a.com',
  integrations: [react()],
  output: 'server',
  adapter: netlify(),
  env: {
    schema: {
      TURSO_URL: envField.string({ context: 'server', access: 'secret' }),
      TURSO_AUTH_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      JWT_SECRET: envField.string({ context: 'server', access: 'secret' }),
      UPLOADTHING_TOKEN: envField.string({ context: 'server', access: 'secret' }),
    },
  },
  devToolbar: {
    enabled: false
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    optimizeDeps: {
      include: [
        '@tanstack/react-query',
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lucide-react',
        'clsx',
        'recharts',
      ]
    }
  }
});