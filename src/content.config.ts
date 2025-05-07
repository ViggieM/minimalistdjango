// Import the glob loader
import { glob } from 'astro/loaders';
// Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// Define a `loader` and `schema` for each collection
const TIL = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './TIL' }),
  schema: z
    .object({
      title: z.string(),
      tags: z.array(z.string()),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      shortDescription: z.string(),
      image: z.optional(
        z.object({
          url: z.string(),
          alt: z.string(),
        }),
      ),
    })
    .transform((data) => ({
      ...data,
      type: 'TIL', // Add a default type value
    })),
});
const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './articles' }),
  schema: z
    .object({
      title: z.string(),
      tags: z.optional(z.array(z.string())),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      shortDescription: z.string(),
      image: z.optional(
        z.object({
          url: z.string(),
          alt: z.string(),
        }),
      ),
    })
    .transform((data) => ({
      ...data,
      type: 'Article', // Add a default type value
    })),
});
const snippets = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './snippets' }),
  schema: z
    .object({
      title: z.string(),
      tags: z.optional(z.array(z.string())),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      shortDescription: z.string(),
      image: z.optional(
        z.object({
          url: z.string(),
          alt: z.string(),
        }),
      ),
    })
    .transform((data) => ({
      ...data,
      type: 'Snippet', // Add a default type value
    })),
});
// Export a single `collections` object to register your collection(s)
export const collections = { TIL, articles, snippets };
