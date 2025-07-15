import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
  // retrieve all data sources
  const allTIL = await getCollection('TIL');
  const allArticles = await getCollection('articles');
  const allSnippets = await getCollection('snippets');

  // merge and sort
  const allPosts = [...allTIL, ...allArticles, ...allSnippets].sort(
    (a, b) =>
      (b.data.updatedDate || b.data.pubDate).getTime() -
      (a.data.updatedDate || a.data.pubDate).getTime(),
  );

  const urlPrefixMap = {
    TIL: '/TIL',
    Article: '/articles',
    Snippet: '/snippets',
  };

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: allPosts.map((post) => ({
      ...post.data,
      link: `${urlPrefixMap[post.data.type]}/${post.id}/`,
    })),
  });
}
