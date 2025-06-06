// @ts-check
import { defineConfig } from 'astro/config';
import { visit } from 'unist-util-visit';

import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  site: 'https://minimalistdjango.com/',

  vite: {
    plugins: [tailwindcss()]
  },

  markdown: {
    rehypePlugins: [
      () => (tree) => {
        visit(tree, 'element', function(node, index, parent) {
          if (node.tagName === 'a' && String(node.properties.href).endsWith('.md')) {
            node.properties.href = String(node.properties.href).replace(/\.md$/, "")
          }
        });
      }
    ]
  }
});
