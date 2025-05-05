---
title: Create a custom logging filter
pubDate: 2024-06-05
shortDescription: Learn how to create a custom logging filter in Django to exclude specific 404 error messages from your logs based on URL patterns.
tags:
  - Backend
---

# Create a custom logging filter

Django's `django.http.response.Http404` exception is a shortcut to return a 404 to the user if a page does not exist.

```python
from django.http.response import Http404

def test_view(request):
    raise Http404
```

but it creates a "WARNING" log message every time, which can pollute your logs in certain cases.
This is why I decided to create a custom log filter that can exclude some of these warnings bases on certain regex url patterns, for example:

```
r'^/(de|en)/some-sub-page/.+$'
```

## The custom logging filter

```python
import re
from logging import Filter


class Http404Filter(Filter):
    def __init__(self, url_patterns=None):
        super().__init__()
        self.url_patterns = url_patterns or []

    def filter(self, record):
        if not hasattr(record, "status_code"):
            return True
        if not record.status_code == 404:
            return True

        if not hasattr(record, "request"):
            return True
        request = record.request
        if not hasattr(request, "path"):
            return True

        for pattern in self.url_patterns:
            if re.match(pattern, request.path):
                return False

        return True

```

## The logging configuration

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {module} {message}",
            "style": "{",
        },
    },
    "filters": {
        "filter_http_404": {
            "()": "custom_logging.Http404Filter",
            'url_patterns': [
                r'^/(de|en)/some-sub-page/.+$',
                r'^/favicon\.ico$',
                r'^/robots\.txt$',
            ],
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
            "filters": ["filter_http_404"],
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "WARNING"),
            "propagate": False,
        },
    },
}
```
