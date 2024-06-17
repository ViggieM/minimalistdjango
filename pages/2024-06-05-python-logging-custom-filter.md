# Create a custom logging filter to  

Django's `django.http.response.Http404` exception can be used to easily return a 404 in a view. 
The downside is that a log entry is created every time the Http404 Exception is raised.
This can overpollute your logs.

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
        "verbose2": {
            "format": "%(asctime)s %(levelname)-8s %(name)-15s %(message)s",
        },
    },
    "filters": {
        "filter_http_404": {
            "()": "custom_logging.Http404Filter",
            'url_patterns': [
                r'^/(de|en)/jobs/.+$',
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
        "console2": {
            "class": "logging.StreamHandler",
            "formatter": "verbose2",
            "filters": ["filter_http_404"],
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console2"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "WARNING"),
            "propagate": False,
        },
    },
}
```
