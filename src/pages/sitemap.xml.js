import { getCollection } from 'astro:content';

const siteUrl = 'https://minimalistdjango.com';

// Helper function to format dates for sitemap
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Helper function to generate URL entry
const generateUrlEntry = (
  url,
  lastmod,
  changefreq = 'monthly',
  priority = '0.5',
) => {
  return `  <url>
    <loc>${siteUrl}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

export async function GET() {
  // Get all content collections
  const [tilPosts, articlePosts, snippetPosts] = await Promise.all([
    getCollection('TIL'),
    getCollection('articles'),
    getCollection('snippets'),
  ]);

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0', lastmod: new Date() },
    {
      url: '/about/',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: new Date(),
    },
    {
      url: '/TIL/',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: new Date(),
    },
    {
      url: '/articles/',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: new Date(),
    },
    {
      url: '/snippets/',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: new Date(),
    },
  ];

  // Generate URL entries for static pages
  const staticEntries = staticPages.map((page) =>
    generateUrlEntry(
      page.url,
      formatDate(page.lastmod),
      page.changefreq,
      page.priority,
    ),
  );

  // Generate URL entries for TIL posts
  const tilEntries = tilPosts.map((post) =>
    generateUrlEntry(
      `/TIL/${post.slug}/`,
      formatDate(post.data.updatedDate || post.data.pubDate),
      'monthly',
      '0.6',
    ),
  );

  // Generate URL entries for article posts
  const articleEntries = articlePosts.map((post) =>
    generateUrlEntry(
      `/articles/${post.slug}/`,
      formatDate(post.data.updatedDate || post.data.pubDate),
      'monthly',
      '0.7',
    ),
  );

  // Generate URL entries for snippet posts
  const snippetEntries = snippetPosts.map((post) =>
    generateUrlEntry(
      `/snippets/${post.slug}/`,
      formatDate(post.data.updatedDate || post.data.pubDate),
      'monthly',
      '0.6',
    ),
  );

  // Combine all entries
  const allEntries = [
    ...staticEntries,
    ...tilEntries,
    ...articleEntries,
    ...snippetEntries,
  ];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}
