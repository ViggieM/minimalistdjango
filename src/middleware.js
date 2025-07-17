import { defineMiddleware } from 'astro:middleware';

// Extract deprecated URLs from CSV analysis
const deprecatedUrls = [
  '/databases/2024/03/10/postgres',
  '/frontend/2023/09/19/tailwindcss.html',
  '/frontend/2023/09/07/alpine-js-0.1.0',
  '/running in production/2023/06/29/supervisor.html',
  '/TIL/tools/terraform',
  '/frontend/2023/10/26/floating-labels-for-select',
  '/running in production/2023/06/10/virtualbox',
  '/frontend/2023/09/06/django-htmx',
  '/frontend/2023/12/12/dynamic-formsets.html',
  '/know your tools/2023/09/11/debugging-in-vscode',
  '/tools/litestream',
  '/development/2023/06/14/set-up-a-django-project.html',
  '/tools/LLMs',
  '/security/2023/08/06/https.html',
  '/tags/',
  '/know your tools/2023/09/11/debugging-in-vscode.html',
  '/running in production/2023/06/23/gunicorn.html',
  '/snippets/.editorconfig',
  '/frontend/2023/09/20/dropdown.html',
  '/frontend/2023/09/06/django-htmx.html',
  '/frontend/2023/10/13/loading-spinners.html',
  '/categories/',
  '/tools/supabase',
  '/databases/2024/03/10/postgres.html',
  '/frontend/2023/10/26/floating-labels-for-select.html',
  '/running in production/2023/07/18/ansible.html',
  '/tools/postgres',
  '/development/2023/09/08/localstack-0.1.0.html',
  '/tools/systemd',
  '/databases/2023/06/18/sqlite.html',
  '/running in production/2023/06/10/virtualbox.html',
  '/TIL/tools/localstack',
  '/frontend/2023/09/07/alpine-js-0.1.0.html',
  '/running in production/2023/07/03/manual-deploy.html',
];

// Pattern matchers for old Jekyll-style URLs
const deprecatedPatterns = [
  // Jekyll-style URLs: /category/YYYY/MM/DD/slug or /category/YYYY/MM/DD/slug.html
  /^\/[^/]+\/\d{4}\/\d{2}\/\d{2}\/[^/]+(?:\.html)?$/,
  // Tool URLs: /tools/toolname
  /^\/tools\/[^/]+$/,
  // TIL URLs: /TIL/category/slug
  /^\/TIL\/[^/]+\/[^/]+$/,
  // Snippet files: /snippets/filename
  /^\/snippets\/[^/]+$/,
  // Category and tag pages
  /^\/(?:tags|categories)\/$/,
];

function isDeprecatedUrl(pathname) {
  // Check exact matches first
  if (deprecatedUrls.includes(pathname)) {
    return true;
  }

  // Check pattern matches
  return deprecatedPatterns.some((pattern) => pattern.test(pathname));
}

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  console.log(context);

  if (isDeprecatedUrl(pathname)) {
    // Return 410 Gone response
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>410 - Page Gone</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
        .error-code { font-size: 3rem; font-weight: bold; color: #dc2626; margin-bottom: 1rem; }
        .error-message { font-size: 1.5rem; margin-bottom: 2rem; }
        .description { margin-bottom: 2rem; line-height: 1.6; }
        .actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn { padding: 0.75rem 1.5rem; background: #2563eb; color: white; text-decoration: none; border-radius: 0.5rem; }
        .btn:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="error-code">410</div>
    <div class="error-message">This page is no longer available</div>
    <div class="description">
        <p>The content you're looking for has been permanently removed from this site. This was likely an old blog post or page that has been restructured or discontinued.</p>
    </div>
    <div class="actions">
        <a href="/" class="btn">Go to Homepage</a>
    </div>
</body>
</html>`,
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      },
    );
  }

  return next();
});
