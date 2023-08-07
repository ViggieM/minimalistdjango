---
layout: page
title:  "Django Project Structure"
date:   2023-08-02
published: false
image: 
  path: /images/xkcd-standards.png
  thumbnail: /images/meme-project-structure.jpg
  caption: <a href="https://xkcd.com/927/" target="_blank">https://xkcd.com/927/</a>
---

Everyone has a different opinion on how to structure their Django projects. 
The thing is, in the end, it doesn't really matter.
You have to pick the one which is most comfortable for you.
But there are some common patterns that should be taken into consideration.

## Project structure

Everyone has a different opinion on how to structure their Django projects. 
The thing is, in the end, it doesn't really matter.
You have to pick the one which is most comfortable for you.
But there are some common patterns that should be taken into consideration

### The minimalist way

```init
.
├── manage.py
├── poetry.lock
├── pyproject.toml
├── .python-version
└── the_minimalist_way
    ├── asgi.py
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```
{:class.tree-content}

### The tidy way

```init
.
├── poetry.lock
├── pyproject.toml
├── .python-version
└── src
    ├── manage.py
    └── project
        ├── asgi.py
        ├── __init__.py
        ├── settings.py
        ├── urls.py
        └── wsgi.py
```
{:class.tree-content}

# requirements



# secrets 

```python
SECRET_KEY = os.environ["SECRET_KEY"]
DEBUG = int(os.environ.get("DEBUG", default=0))
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", default="localhost 127.0.0.1 0.0.0.0").split()
```

# git and gitignore, pre-commit

* poetry add -G dev pre-commit
* pre-commit autoupdate
* pre-commit install


```yaml
# See https://pre-commit.com for more information
# See https://pre-commit.com/hooks.html for more hooks
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
        name: isort (python)
        args: [ "--profile", "black", "--filter-files" ]
        exclude: ^.*\b(migrations)\b.*$
  - repo: https://github.com/psf/black
    rev: 23.7.0
    hooks:
      - id: black
        exclude: ^.*\b(migrations)\b.*$
```

# templates

# extensions

* bpython
* django-extensions
  * pycharm developer console
* django debug toolbar 
  * https://gist.github.com/movileanuv/a6e31cb31c2684883c75d89aeceba512

