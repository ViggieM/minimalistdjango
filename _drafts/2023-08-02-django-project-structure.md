---
layout: page
title:  "Django Project Structure"
date:   2023-08-02
published: true
# image: 
#   path: /images/tim-berners-lee-django.jpg
#   thumbnail: /images/meme-django.jpg
#   caption: Tim Berners Lee starting his first Django project in 1989
---

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

