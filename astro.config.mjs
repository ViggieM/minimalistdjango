// @ts-check
import { defineConfig } from 'astro/config';
import { visit } from 'unist-util-visit';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

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

      copyDir('./media', './dist/client/media');
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://minimalistdjango.com/',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  devToolbar: {
    enabled: true,
  },

  vite: {
    plugins: [tailwindcss(), copyMediaPlugin()],
  },

  markdown: {
    rehypePlugins: [
      () => (tree) => {
        visit(tree, 'element', function (node, _index, _parent) {
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
