// Import the glob loader
import { glob } from 'astro/loaders';
// Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// Define a `loader` and `schema` for each collection
const TIL = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './TIL' }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.optional(
      z.object({
        url: z.string(),
        alt: z.string(),
      }),
    ),
  }),
});
const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './articles' }),
  schema: z.object({
    title: z.string(),
    tags: z.optional(z.array(z.string())),
    image: z.optional(
      z.object({
        url: z.string(),
        alt: z.string(),
      }),
    ),
  }),
});
const tools = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './tools' }),
  schema: z.object({
    title: z.string(),
    tags: z.optional(z.array(z.string())),
    image: z.optional(
      z.object({
        url: z.string(),
        alt: z.string(),
      }),
    ),
  }),
});
// Export a single `collections` object to register your collection(s)
export const collections = { TIL, articles, tools };
