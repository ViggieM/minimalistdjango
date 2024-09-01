# Django in one file

This is a minimal script that will run Django.
This can be useful to test new libraries.

Create a `manage.py` file with the following content:

```python
import sys

from django.conf import settings
from django.core.wsgi import get_wsgi_application
from django.urls import path
from django.template.response import TemplateResponse


def index(request):
    return TemplateResponse(request, "index.html")


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
]

application = get_wsgi_application()

if __name__ == "__main__":
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
```

and a `index.html` file in the same folder:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Project</title>
</head>
<body>
    <h1>My Awesome Project</h1>
</body>
</html>
```

Run

```bash
python manage.py runserver
```

and voilá!