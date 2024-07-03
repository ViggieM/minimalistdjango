
* See https://pre-commit.com for more information
* See https://pre-commit.com/hooks.html for more hooks


## Minimal configuration for Django projects

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        name: isort (python)
        args: [ "--profile", "black", "--filter-files" ]
        exclude: ^.*\b(migrations)\b.*$
  - repo: https://github.com/psf/black
    rev: 24.3.0
    hooks:
      - id: black
        exclude: ^.*\b(migrations)\b.*$
```

## Extras

These are some additional pre-commit hooks that might be useful, depending on the complexity of the project and use case.

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
