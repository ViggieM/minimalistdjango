// @ts-check
import { defineConfig } from 'astro/config';
import { visit } from 'unist-util-visit';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

import tailwindcss from '@tailwindcss/vite';

function copyMediaPlugin() {
  return {
    name: 'copy-media',
    writeBundle() {
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
          console.warn('Could not copy media files:', err.message);
        }
      };
      
      copyDir('./media', './dist/media');
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://minimalistdjango.com/',

  vite: {
    plugins: [tailwindcss(), copyMediaPlugin()]
  },

  markdown: {
    rehypePlugins: [
      () => (tree) => {
        visit(tree, 'element', function(node, index, parent) {
          if (node.tagName === 'a' && String(node.properties.href).endsWith('.md')) {
            node.properties.href = String(node.properties.href).replace(/\.md$/, "")
          }
        });
      },
      rehypeAutolinkHeadings
    ]
  }
});
