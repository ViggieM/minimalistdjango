---
title: How to implement search functionality for a static site
shortDescription: A guide on how to use Fuse.js to implement client side search for a static site
pubDate: 2025-05-07
tags:
  - Frontend
---

A search for a website can become very complicated.
The simplest search would be to look if the searched words are present in the document itself, kind of like pressing Ctrl+F in a browser.
If you want to do spellchecking or a fuzzy search, there are different libraries available in probably every programming language.
Some databases, like Postgres provide search capabilities that can be accessed in Django: [Full text search | Django documentation | Django](https://docs.djangoproject.com/en/5.2/ref/contrib/postgres/search/).
At some point you might want to use an external service like Elasticsearch or Solr to perform more complex indexing.

In the case of my static website, that was built with Astro.js and served on Netlify, there is no database that could perform the full text search, and there is no backend where I could implement a more complex search functionality[^1].
So the only option I am left with is basically client side.
The principle would be applicable for any website that provides a search, in case you want to reduce the load on your server.

## Research

I have basically found two articles on Google that did what I wanted:

### *How to Build Site Search with Astro, Qwik and Fuse.js - The New Stack*[^3]

The first one uses Quick, which is leaned to React, and I don't really like React[^2].
So I am thinking about using either Alpine.js or Svelte.
But what I really like about this approach is that the content is generated statically at build time and served at `/all-content.js`

```javascript
// src/pages/all-content.json.js

import { getCollection } from 'astro:content';

export const GET = async () => {
  const posts = await getCollection('posts');
  // ...
  return new Response(JSON.stringify({ posts }));
};
```

### *Powering Search With Astro Actions and Fuse.js | CSS-Tricks*[^4]

The second article actually uses Astro Actions to do the search on the server.
But I don't want that, so this article is basically just a different approach.
What I like about this article is that it shows how to build the Search component by using plain Javascript, instead Alpine.js or Svelte, so this is a great starting point for experimentation.

## Let's build it!

The first step is to create a static route `/all-content.json` as described in the first article.
One nice extra would be if this Response would be gzipped, to reduce network traffic.

```javascript
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
      data: { title, pubDate },
    } = data;

    return {
      date: pubDate,
      title: title,
      slug: filePath.slice(0, -3), // remove the .md ending
    };
  });

  return new Response(JSON.stringify({ posts }));
};
```

Then create a `Search.astro` component with plain javascript, as described in the second article, with a little bit of code from the first article.
In this case I used a regular `import` statement at the top of the `<script>` tag, and I initialized Fuse only once, after fetching the statically generated content json.

```html
<form id="searchForm" class="mx-auto mb-6 flex max-w-sm items-center">
  <label for="search" class="sr-only">Search</label>
  <div class="relative w-full">
    <input
      type="text"
      id="search"
      class="block w-full rounded-lg border"
      placeholder="Search"
      required
    />
  </div>
</form>

<script>
  import Fuse from 'fuse.js';
  const content = await fetch(`/all-content.json`);
  const { posts } = await content.json();

  const fuse = new Fuse(posts, {
    threshold: 0.3,
    keys: [{ name: 'title', weight: 1.0 }],
  });

  const form = document.getElementById('searchForm');
  const search = document.getElementById('search');
  const results = document.getElementById('results');

  form?.addEventListener('keyup', async (e) => {
    e.preventDefault();
    const query = search.value;

    const searchResults = fuse.search(query);
    console.log(searchResults);
  });
</script>
```

Now the question is, how do I render the search results?
The html representation of a post is already specified in a component called `Article.astro`.
The problem is that Astro components are rendered at build time on the server side.

Option 1: use a client-side framework component, like React or Svelte.
Option 2: duplicate the `Article.astro` code as JavaScript template strings.

I decided to go with Option 2, keeping it simple with vanilla JavaScript. This avoids adding another framework dependency and keeps the solution lightweight.

```javascript
function createArticleHTML(post) {
  return `
    <article class="post relative">
      <header>
        <h3 class="mb-2">
          <a href="${post.url}">
            <span class="absolute inset-0"></span>
            ${post.title}
          </a>
        </h3>
        <div class="mb-1 flex items-baseline gap-2">
          <span class="font-serif italic font-semibold text-sm">${post.type}</span>
          <span class="text-xs italic">posted on ${formatDate(post.pubDate)}</span>
        </div>
      </header>
      <div>${post.shortDescription}</div>
    </article>
  `;
}

form?.addEventListener('input', (e) => {
  const query = search.value.trim();
  
  if (query.length === 0) {
    // Show initial posts, hide search results
    document.getElementById('initial-posts').classList.remove('hidden');
    document.getElementById('search-results').classList.add('hidden');
  } else {
    // Hide initial posts, show search results
    document.getElementById('initial-posts').classList.add('hidden');
    document.getElementById('search-results').classList.remove('hidden');
    
    const results = fuse.search(query);
    const searchPosts = results.map(result => result.item);
    
    // Generate HTML for search results
    const html = searchPosts.map(post => createArticleHTML(post)).join('');
    document.getElementById('search-results-list').innerHTML = html;
  }
});
```

This approach keeps the solution simple and framework-free while avoiding code duplication between server and client rendering.


[^1]: It is not entirely true that I wouldn't be able to run any server side calculations on Netlify, since they offer the possibility to deploy edge functions, see [@astrojs/netlify | Docs](https://docs.astro.build/en/guides/integrations-guide/netlify/)
[^2]: React is not really the best option: [The self-fulfilling prophecy of React - Josh Collinsworth blog](https://joshcollinsworth.com/blog/self-fulfilling-prophecy-of-react)
[^3]: [How to Build Site Search with Astro, Qwik and Fuse.js - The New Stack](https://thenewstack.io/how-to-build-site-search-with-astro-qwik-and-fuse-js/)
[^4]: [Powering Search With Astro Actions and Fuse.js | CSS-Tricks](https://css-tricks.com/powering-search-with-astro-actions-and-fuse-js/)
