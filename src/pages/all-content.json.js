import { getCollection } from 'astro:content';

export const GET = async () => {
  const allTIL = await getCollection('TIL');
  const allArticles = await getCollection('articles');
  const allSnippets = await getCollection('snippets');
  const allPosts = [...allTIL, ...allArticles, ...allSnippets].sort(
    (a, b) =>
      (b.data.updatedDate || b.data.pubDate).getTime() -
      (a.data.updatedDate || a.data.pubDate).getTime(),
  );

  const posts = allPosts.map((data) => {
    const {
      id,
      filePath,
      data: { title, pubDate, updatedDate, shortDescription, tags, keywords, type },
    } = data;

    const url = {
      TIL: `/TIL/${id}/`,
      Article: `/articles/${id}/`,
      Snippet: `/snippets/${id}/`,
    }[type];

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
