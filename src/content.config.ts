// Import the glob loader
import { glob } from 'astro/loaders';
// Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

// Base schema with common fields
const baseContentSchema = z.object({
  title: z.string(),
  keywords: z.optional(
    z
      .string()
      .transform((str) => (str ? str.split(',').map((s) => s.trim()) : [])),
  ),
  pubDate: z.date(),
  updatedDate: z.date().optional(),
  shortDescription: z.string(),
  image: z.optional(
    z.object({
      url: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    }),
  ),
});

// Helper function to create collection schema with type transformation
const createCollectionSchema = (
  type: string,
  tagsRequired: boolean = false,
) => {
  const schema = baseContentSchema.extend({
    tags: tagsRequired ? z.array(z.string()) : z.optional(z.array(z.string())),
  });

  return schema.transform((data) => ({
    ...data,
    type,
  }));
};

// Define collections using the unified schema
const TIL = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './TIL' }),
  schema: createCollectionSchema('TIL', true), // TIL requires tags
});

const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './articles' }),
  schema: createCollectionSchema('Article'), // Articles has optional tags
});

const snippets = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './snippets' }),
  schema: createCollectionSchema('Snippet'), // Snippets has optional tags
});
// Export a single `collections` object to register your collection(s)
export const collections = { TIL, articles, snippets };
