---
title: Pre-commit hooks
---

# Pre-commit hooks

Pre-commit hooks are, as the name says, scripts that are executed, before files are commited to Git.
They can be useful for executing linters and code formatters before you commit.

* See https://pre-commit.com for more information
* See https://pre-commit.com/hooks.html for more hooks


## Cheatsheet

This is a minimal configuration I like to use for my django projects: [.pre-commit-config.yaml](/snippets/.pre-commit-config.yaml).

### Isort

```yaml
repos:
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        name: isort (python)
        args: [ "--profile", "black", "--filter-files" ]
        exclude: ^.*\b(migrations)\b.*$
```

### Black

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.3.0
    hooks:
      - id: black
        exclude: ^.*\b(migrations)\b.*$
```

### Export requirements.txt

This can be useful in case you are installing packages with pip, and don't want to forget to update your requirements.txt in your repo when you add new dependencies.

```yaml
repos:
  - repo: local
    hooks:
      - id: generate-requirements
        name: Generate requirements.txt
        entry: bash -c 'pip freeze > requirements.txt'
        language: system
        stages: [pre-commit]
```
