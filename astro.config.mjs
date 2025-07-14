// @ts-check

import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import cloudflare from '@astrojs/cloudflare';
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

function copyAssetsIgnorePlugin() {
  return {
    name: 'copy-assetsignore',
    writeBundle() {
      try {
        copyFileSync('./.assetsignore', './dist/.assetsignore');
      } catch (err) {
        console.warn(
          'Could not copy .assetsignore file:',
          err instanceof Error ? err.message : String(err),
        );
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://minimalistdjango.com/',
  output: 'server',
  adapter: cloudflare(),
  devToolbar: {
    enabled: true,
  },

  vite: {
    plugins: [tailwindcss(), copyMediaPlugin(), copyAssetsIgnorePlugin()],
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
