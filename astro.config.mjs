// @ts-check

import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { visit } from 'unist-util-visit';

function copyMediaPlugin() {
  return {
    name: 'copy-media',
    writeBundle() {
      /**
       * @param {string} src
       * @param {string} dest
       */
      const copyDir = (src, dest) => {
        try {
          mkdirSync(dest, { recursive: true });
          const entries = readdirSync(src);

          for (const entry of entries) {
            const srcPath = join(src, entry);
            const destPath = join(dest, entry);

            if (statSync(srcPath).isDirectory()) {
              copyDir(srcPath, destPath);
            } else {
              copyFileSync(srcPath, destPath);
            }
          }
        } catch (err) {
          console.warn(
            'Could not copy media files:',
            err instanceof Error ? err.message : String(err),
          );
        }
      };

      copyDir('./media', './dist/media');
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://minimalistdjango.com/',
  output: 'server',
  adapter: cloudflare({
    routes: {
      extend: {
        include: [
          // Deprecated URLs from middleware - need to route through SSR for 410 responses
          { pattern: '/databases/2024/03/10/postgres' },
          { pattern: '/frontend/2023/09/19/tailwindcss.html' },
          { pattern: '/frontend/2023/09/07/alpine-js-0.1.0' },
          { pattern: '/running in production/2023/06/29/supervisor.html' },
          { pattern: '/TIL/tools/terraform' },
          { pattern: '/frontend/2023/10/26/floating-labels-for-select' },
          { pattern: '/running in production/2023/06/10/virtualbox' },
          { pattern: '/frontend/2023/09/06/django-htmx' },
          { pattern: '/frontend/2023/12/12/dynamic-formsets.html' },
          { pattern: '/know your tools/2023/09/11/debugging-in-vscode' },
          { pattern: '/tools/litestream' },
          { pattern: '/development/2023/06/14/set-up-a-django-project.html' },
          { pattern: '/tools/LLMs' },
          { pattern: '/security/2023/08/06/https.html' },
          { pattern: '/tags/' },
          { pattern: '/know your tools/2023/09/11/debugging-in-vscode.html' },
          { pattern: '/running in production/2023/06/23/gunicorn.html' },
          { pattern: '/snippets/.editorconfig' },
          { pattern: '/frontend/2023/09/20/dropdown.html' },
          { pattern: '/frontend/2023/09/06/django-htmx.html' },
          { pattern: '/frontend/2023/10/13/loading-spinners.html' },
          { pattern: '/categories/' },
          { pattern: '/tools/supabase' },
          { pattern: '/databases/2024/03/10/postgres.html' },
          { pattern: '/frontend/2023/10/26/floating-labels-for-select.html' },
          { pattern: '/running in production/2023/07/18/ansible.html' },
          { pattern: '/tools/postgres' },
          { pattern: '/development/2023/09/08/localstack-0.1.0.html' },
          { pattern: '/tools/systemd' },
          { pattern: '/databases/2023/06/18/sqlite.html' },
          { pattern: '/running in production/2023/06/10/virtualbox.html' },
          { pattern: '/TIL/tools/localstack' },
          { pattern: '/frontend/2023/09/07/alpine-js-0.1.0.html' },
          { pattern: '/running in production/2023/07/03/manual-deploy.html' },
        ],
      },
    },
  }),
  devToolbar: {
    enabled: true,
  },
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss(), copyMediaPlugin()],
  },

  markdown: {
    rehypePlugins: [
      () => (tree) => {
        visit(tree, 'element', (node, _index, _parent) => {
          if (
            node.tagName === 'a' &&
            String(node.properties.href).endsWith('.md')
          ) {
            node.properties.href = String(node.properties.href).replace(
              /\.md$/,
              '',
            );
          }
        });
      },
      rehypeAutolinkHeadings,
    ],
  },
});
