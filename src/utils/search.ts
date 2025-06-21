import Fuse from 'fuse.js';

export interface SearchPost {
  id: string;
  title: string;
  type: string;
  shortDescription: string;
  tags: string[];
  keywords: string[];
  pubDate: string;
  updatedDate?: string;
  url: string;
}

export interface SearchOptions {
  threshold?: number;
  keys?: Array<{ name: string; weight: number }>;
}

export class SearchEngine {
  private fuse: Fuse<SearchPost>;
  private posts: SearchPost[];

  constructor(posts: SearchPost[], options: SearchOptions = {}) {
    this.posts = posts;
    
    const defaultOptions = {
      threshold: 0.3,
      keys: [
        { name: 'title', weight: 1.0 },
        { name: 'shortDescription', weight: 0.7 },
        { name: 'tags', weight: 0.5 },
        { name: 'keywords', weight: 0.4 },
      ],
    };

    const fuseOptions = { ...defaultOptions, ...options };
    this.fuse = new Fuse(posts, fuseOptions);
  }

  search(query: string): SearchPost[] {
    if (!query.trim()) {
      return [];
    }

    const results = this.fuse.search(query);
    return results.map(result => result.item);
  }

  getAllPosts(): SearchPost[] {
    return this.posts;
  }
}

export async function createSearchEngine(): Promise<SearchEngine> {
  const response = await fetch('/all-content.json');
  const { posts } = await response.json();
  return new SearchEngine(posts);
}