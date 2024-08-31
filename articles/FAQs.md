# FAQs

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
