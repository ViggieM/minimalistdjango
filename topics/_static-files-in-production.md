---
tags:
  - css
  - javascript
  - fonts
---

# Serving static files in production

Static files are JavaScript, CSS, fonts, images, etc. that are served by your web server and are not HTML.

During development, the `runserver` command takes care of serving them, as long as `staticfiles` is in your INSTALLED_APPS.
In the console we can see how the individual files are accessed.
Sometimes it's totally fine to use "runserver" to serve your application, in case you have low traffic,
and the application is not publicly accessible, so you are not concerned with security.

But in most cases, some WSGI server (e.g. gunicorn) will run the application,
and we need to find out a method to serve the media and static files on our own.

### Whitenoise

This can be feasible for small scale applications without a lot of traffic. But it is also scalable with a caching solution such as Cloudflare. This way, your web server is only hit once, to initially fetch the resource, and any further requests will hit the cache.

### Web Server (e.g. Nginx)

This requires you to set up a Nginx server, which is not without its caveats.
I would suggest this approach, only if the first one hits some performance issues.

### Cloud storage (e.g. S3)

You could do this, but I wouldn't recommend to do it without caching, through a service such as Cloudfront or Cloudflare for example.
S3 Buckets have fast response times only when requested from the same region, and when there are not many requests.
But every request costs money, so you might be surprised by a huge bill at the end of the month.

So:

Use a Cloud storage only in combination with a CDN!
