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

```bash
$ tree -L 1
.
├── gunicorn.conf.py
├── manage.py
├── config
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── run
```
