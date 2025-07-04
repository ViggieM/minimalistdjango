---
title: Django Development FAQs
pubDate: 2024-06-20
updatedDate: 2024-10-15
shortDescription: "Common questions and answers about Django development, covering views, project structure, hosting options, and database choices."
tags:
  - Django
keywords: django, class-based views, function-based views, project structure, hosting, database choice, sqlite, postgres
image:
    url: "/media/it-are-a-fact.jpg"
    alt: "It are a fact. I know because of my learnings."
---

## Should I use class based views or function based views?

Class based views in Django might seem sexy on first impression, because they are so slim and resemble the basic CRUD operations.
And I believe they should be used for simple views.

But as soon as the view becomes more complex, for example with multiple forms, it becomes harder to follow the flow of the logic.
Besides, it is tempting to create a lot of mixins and overuse inheritance, which can be very dangerous for growing projects.

> You can make classes, but you can only ever make one instance of them. This shouldn't affect how most object-oriented programmers work.
>
> -- *[DreamBerd, the perfect programming language](https://github.com/TodePond/DreamBerd?tab=readme-ov-file#classes)*

## How should I structure my Django project?

This is a difficult question, and I have thought about it for a long time.
I have come to the conclusion that thinking about it too much is a mistake.
The goal is that it should be easy to change and adapt to a growing project, as well as easy to navigate.

So, in my opinion, this is the project structure I use for every new project that I set up:

```
├── app
│   ├── models.py
│   ├── ...
│   └── views.py
├── config
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── gunicorn.conf.py
├── manage.py
└── run.sh
```

And here is why:
* I use only one **app folder**, because at the beginning I don't know where the models will live and how they will be connected.
  Besides, I don't have to think about how to name the app, where to place it, etc. The goal is to build a prototype, make it work, and not worry about the details.
  Artificially placing models in separate apps makes it more complicated to refactor, and most of the time the models are related by foreign keys to each other anyway.
* I place all the configuration stuff inside a **config folder** (I used to call it *project* before, but I think *config* is more appropriate)
* The `gunicorn.conf.py` is just a thought. Why not keep the configuration inside the project?
* The `run.sh` is a shell script that would run the application in "production" mode (i.e. with gunicorn).
  This makes the setup for [Systemd](/tools/systemd.md) easier.


Here are some more resources that talk about (Django) Project structures:
* [Structuring Your Project — The Hitchhiker's Guide to Python](https://docs.python-guide.org/writing/structure/)
* [Sensemaking: Django for Startup Founders: A better software architecture for SaaS startups and consumer apps](https://alexkrupp.typepad.com/sensemaking/2021/06/django-for-startup-founders-a-better-software-architecture-for-saas-startups-and-consumer-apps.html?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_158)
* [Two Scoops of Django 3.x](https://www.feldroy.com/two-scoops-press)


## Where should I host my Django application?

The short answer: [fly.io](https://fly.io/).

But the long answer is: it depends.
There are a lot of hosting providers that offer good options. Take a look at https://awesomedjango.org/#hosting.

## What database should I pick?

[Picking a database should be simple](https://changelog.com/friends/56), but it's not.
There are a lot of different databases to choose from, and they all handle ACID transactions and data storage differently, depending on their use case.
Check out the website [Database of Databases](https://dbdb.io/), where you can read about different databases and their implementation details.
The choice of the database can be crucial for your application's performance.

In case your application does mostly reads, and there are not many users that write concurrently to your database, it is safe to use [SQLite](/tools/sqlite.md), since you will not have to deal with setting up an additional host, and backing it up with [Litestream](/tools/litestream.md) is very easy.
In case you _do_ have a lot of concurrent reads, [Postgres](/tools/postgres.md) probably offers the most features and flexibility.
You can do full text search, store json and vector embeddings for [LLMs](/tools/LLMs.md), row level security and so on.
Django also offers some [utilities](https://docs.djangoproject.com/en/dev/ref/contrib/postgres/) when used with a Postgres database backend.
If you go with Postgres, you should probably also take a look at [Supabase](/tools/supabase.md) at some point, which is a great platform built on top of Postgres and with a lot of additional features.

In the end, it depends on your level of expertise, personal preference, and your application requirements.
Don't overthink it. KISS.
