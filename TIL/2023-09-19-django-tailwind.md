---
title: Include Tailwind CSS in a Django Project with django-tailwind
pubDate: 2023-09-19
tags:
  - Frontend
keywords: tailwind css, django-tailwind, css framework, hot reload, pm2
shortDescription: A guide to integrating Tailwind CSS into Django projects using django-tailwind, including development setup with hot reload and process management using PM2.
---


## Why django-tailwind?

Tailwindcss has become my goto Framework for Frontend development and there are [very good reasons why](https://blog.matt-rickard.com/p/why-tailwind-css-won).
But as always, there is no straightforward way to include javascript libraries into a Django project. [^1]
After some research, I found that *django-tailwind* is a very good and straightforward start to set up Tailwindcss inside a Django project.
And it comes additionally with instructions on how to set up browser reload, so your styles get automatically updated during development, which gives it a very close feel like developing on a frontend framework like Svelte.

## Installation

The instructions on how to set up [django-tailwind](https://django-tailwind.readthedocs.io/en/latest/installation.html) are pretty straightforward.
I would like to add that with poetry, in order to install the browser reload only for dev requirements, you need to do this:

```bash
poetry add django-tailwind  # installs it to the prod requirements
poetry add -G dev django-tailwind --extras reload  # installs browser reload only for dev requirements
```

After following the installation instructions, everything works out of the box.
I added following settings to my project structure, so statics and templates are found during development:

```python
TEMPLATES = [
    {
        ...
        "DIRS": [BASE_DIR / "templates", BASE_DIR / "theme" / "templates"],
        ...
    },
]
STATICFILES_DIRS = [BASE_DIR / "static", BASE_DIR / "theme" / "static"]
```

## Thoughts

I like the separation of the templates and frontend into a separate app called "theme".
Nothing that django-tailwind does is magic and you could create the same project structure and build scripts manually.
But it's a nice automation for normally very tedious setup of the `package.json` file.

## Extra

Every time you run your development server, you need to make sure to run both `python manage.py tailwind start` and `python manage.py runserver`.
There is a nice npm package called [PM2](https://pm2.keymetrics.io/), that can manage multiple processes and run them in parallel.
You can integrate it in your `Makefile` or for your Docker entrypoint. Here is an example for the `Makefile`:

```makefile
runserver:
    npm i -g pm2
    pm2-runtime ecosystem.config.js
```

Your "ecosystem.config.js" file can look like this:

```javascript
module.exports = {
  apps: [
    {
      name: "npm-dev",
      cwd: "./src/theme/static_src/",
      script: "npm",
      args: "run start",  // this is essentially the same as "python manage.py tailwind start"
      watch: true
    },
    {
      name: "django-runserver",
      cwd: "./src/",
      script: "python",
      args: "manage.py runserver",
      watch: true
    },
  ],
};
```

[^1]: Here is another nice blog on how to handle Django and Javascript together: [Modern JavaScript for Django Developers](https://www.saaspegasus.com/guides/modern-javascript-for-django-developers/)
