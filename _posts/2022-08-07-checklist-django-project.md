---
layout: post
title:  "Checklist Django Project"
date:   2022-08-07 10:25:00 +0200
published: true
---

## The _must_

Every web project, independently of whether it is written in Django or not, needs to take care of these basics:

1) **Dependency management**: 
Make sure all your installed third party library versions are pinned because of version incompatibilities between them or backwards incompatible versions.
Don't bother with `pip install` and `virtualenv venv` anymore.
Learn and use [poetry][poetry].

2) **Version control**: 
Use git, commit often and push your code to a remote repository like _GitHub_.
But be careful to not commit any sensitive information into your repository.
Use environment variables and access them in your code with `os.environ.get()`, `python-decouple` or any other similar library.

3) **Security**: 
Don't make your users vulnerable.
Treat them with respect.
Here are some [minimal best practices][todo-security] for security that will take you a long way.

4) **Deployment**: 
There are tons of platforms where you can deploy your code to.
The right choice depends on your skills and needs.
[In this article][todo-deployment] I describe some platforms and how to deploy your Django code on them.

5) **Error pages**: 
Even though your application is perfect, I know, your website might be a victim of cosmic rays that will generate 500 errors. 
Make sure to inform your users about the universe's shortcomings.
If you are really fancy, you can even build a maintainance mode page for your website, so you can take it offline while you are waiting for the cosmic rays to stop.

## The _might_

Some other optional topics you might come in touch with:
* **Static files**: 
These are static images on your website, stylesheets and script files.
You can use whitenoise, a web server like nginx or a content delivery network (CDN) like cloudflare.
([more][todo-staticfiles])
* **Media files**: 
These are images updloaded by the users.
([more][todo-mediafiles])
* **Release management**:
Run a clone of your application on a separate domain where you can test new features.
([more][todo-release-management])
* **Error monitoring**: 
Know when your users encounter errors on your website and get a detailed error report with error monitoring tools like [sentry][sentry] or [honeybadger][honeybadger]
* **Code formatting**: 
Unless nobody else should ever see your code and you want to work alone, you should use some popular code formatting tools like _black_, _isort_ and _flake8_


## TL;DR
Just read the words written in bold letters.

[todo-security]: <>
[poetry]: {% post_url 2022-09-08-poetry %}
[todo-error-pages]: <>
[todo-staticfiles]: <>
[todo-mediafiles]: <>
[todo-release-management]: <>
[todo-deployment]: <>
[sentry]: https://docs.sentry.io/platforms/python/guides/django/
[honeybadger]: https://www.honeybadger.io/for/django/
