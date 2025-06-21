export type ContentType = 'TIL' | 'Article' | 'Snippet';

export interface ContentTypeConfig {
  color: string;
  urlPrefix: string;
}

export const contentTypeConfigs: Record<ContentType, ContentTypeConfig> = {
  TIL: {
    color: 'text-purple-600',
    urlPrefix: '/TIL',
  },
  Article: {
    color: 'text-blue-700',
    urlPrefix: '/articles',
  },
  Snippet: {
    color: 'text-yellow-500',
    urlPrefix: '/snippets',
  },
};

export function getContentTypeConfig(type: ContentType): ContentTypeConfig {
  return contentTypeConfigs[type];
}

export function getContentUrl(type: ContentType, id: string): string {
  const config = getContentTypeConfig(type);
  return `${config.urlPrefix}/${id}/`;
}

export function getContentColor(type: ContentType): string {
  const config = getContentTypeConfig(type);
  return config.color;
}