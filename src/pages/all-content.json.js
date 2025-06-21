import { getCollection } from 'astro:content';

export const GET = async () => {
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

  const posts = allPosts.map((data) => {
    const {
      id,
      filePath,
      data: {
        title,
        pubDate,
        updatedDate,
        shortDescription,
        tags,
        keywords,
        type,
      },
    } = data;

    const urlPrefixMap = {
      TIL: '/TIL',
      Article: '/articles',
      Snippet: '/snippets',
    };
    const url = `${urlPrefixMap[type]}/${id}/`;

    return {
      id,
      title,
      type,
      shortDescription,
      tags: tags || [],
      keywords: keywords || [],
      pubDate,
      updatedDate,
      url,
      slug: filePath.slice(0, -3), // remove the .md ending
    };
  });

  return new Response(JSON.stringify({ posts }));
};
