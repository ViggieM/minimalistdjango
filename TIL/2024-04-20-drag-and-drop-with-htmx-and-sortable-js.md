---
title: Drag and Drop with HTMX and Sortable.js
pubDate: 2024-04-20
shortDescription: A tutorial on implementing drag-and-drop functionality in Django using HTMX and Sortable.js, featuring a simple single-file application example.
tags:
  - Frontend
---


![preview](/media/TIL/2024-04-20-drag-and-drop-with-htmx-and-sortable-js/drag-and-drop-with-htmx-and-sortable-js.png)

I was inspired by [this YouTube video](https://youtu.be/V-f_yYKUJo8?si=eYapxp6itu4fbCtz) to learn some new things about HTMX.
A sortable drag and drop is always a nice feature to have on your website, so why not get some insight on how it can be implemented in a Django application.

The key takeaways from the video (for me) were:

* We use [SortableJS](https://sortablejs.github.io/Sortable/) to implement the required JavaScript functionality.
* We follow the instructions in the [htmx Examples](https://htmx.org/examples/sortable/) on how to integrate with HTMX
* We write some simple backend code for the view, to keep track of the changes made in the frontend.

I decided to avoid the implementation with a Database, since it can be easily mocked with a list, stored as the variable `movies` in the global scope.
For this I generated a list with ChatGPT

```python
movies = [
    "The Shawshank Redemption",
    "Inception",
    "The Godfather",
    "Pulp Fiction",
    "Forrest Gump",
    "The Matrix",
    "Parasite",
    "Back to the Future",
    "The Dark Knight",
    "Avatar",
]
```

And implemented the "sort" view as follows:

```python
def sort(request):
    global movies

    new_order = request.POST.getlist("movie")
    new_list = [movies[int(i)] for i in new_order]
    movies = new_list
    return TemplateResponse(request, "_movies.html", context={"movies": movies})
```

The rest was just copy-paste from the [htmx Examples](https://htmx.org/examples/sortable/).

And I applied some styling with [Bulma](https://bulma.io/), to make it a bit prettier.

## One File Django Application

You can create these three files in a folder:

* `manage.py`
* `index.html`
* `_movies.html`

and execute:

```bash
python manage.py runserver
```

in a shell, to get the example running locally.

### `manage.py`

```python
import sys

from django.conf import settings
from django.core.wsgi import get_wsgi_application
from django.urls import path
from django.template.response import TemplateResponse


movies = [
    "The Shawshank Redemption",
    "Inception",
    "The Godfather",
    "Pulp Fiction",
    "Forrest Gump",
    "The Matrix",
    "Parasite",
    "Back to the Future",
    "The Dark Knight",
    "Avatar",
]


def index(request):
    return TemplateResponse(request, "index.html", context={"movies": movies})


def sort(request):
    global movies

    new_order = request.POST.getlist("movie")
    new_list = [movies[int(i)] for i in new_order]
    movies = new_list
    return TemplateResponse(request, "_movies.html", context={"movies": movies})


settings.configure(
    DEBUG=True,
    ROOT_URLCONF=__name__,
    SECRET_KEY="don't look me",
    ALLOWED_HOSTS=["*"],
    TEMPLATES=[
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": ["."],
        },
    ],
)

urlpatterns = [
    path("", index),
    path("sort/", sort),
]

application = get_wsgi_application()

if __name__ == "__main__":
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
```

### `index.html`


```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Django + HTMX + Sortable.js</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css">
    <!-- jsDelivr :: Sortable :: Latest (https://www.jsdelivr.com/package/npm/sortablejs) -->
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
    <script src="https://unpkg.com/htmx.org@1.9.12"
        integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2"
        crossorigin="anonymous"></script>
</head>

<body>
    <div class="container">
        <form class="sortable" hx-post="/sort/" hx-trigger="end">
            {% include "_movies.html" %}
        </form>
    </div>

    <script>
        htmx.onLoad(function (content) {
            var sortables = content.querySelectorAll(".sortable");
            for (var i = 0; i < sortables.length; i++) {
                var sortable = sortables[i];
                var sortableInstance = new Sortable(sortable, {
                    animation: 150,
                    ghostClass: 'blue-background-class',

                    // Make the `.htmx-indicator` unsortable
                    filter: ".htmx-indicator",
                    onMove: function (evt) {
                        return evt.related.className.indexOf('htmx-indicator') === -1;
                    },

                    // Disable sorting on the `end` event
                    onEnd: function (evt) {
                        this.option("disabled", true);
                    }
                });

                // Re-enable sorting on the `htmx:afterSwap` event
                sortable.addEventListener("htmx:afterSwap", function () {
                    sortableInstance.option("disabled", false);
                });
            }
        })
    </script>
</body>

</html>
```

### `_movies.html`

```html
<div class="htmx-indicator">Updating...</div>
{% for movie in movies %}
    <div class="box has-background-primary-{{ forloop.counter0 }}0 has-text-primary-{{ forloop.counter0 }}0-invert" style="cursor: pointer">
        <input type='hidden' name='movie' value='{{ forloop.counter0 }}' />
        {{ movie }}
    </div>
{% endfor %}
```
