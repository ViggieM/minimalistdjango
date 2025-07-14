---
title: "Clean Code"
pubDate: 2025-07-09
shortDescription: "Learn how to maintain clean, consistent code with formatting and linting tools"
tags:
  - Developer Experience
keywords: clean code, linting, formatting, eslint, prettier, biome, code quality
---

Whether you like tabs over spaces or single quotes over double quotes, it really doesn't matter.
Consistent code style is not about personal preference, but about avoiding unnecessary discussions within teams.
A clear and consistent structure makes the code easier to read.
Clean code, whether it is written by AI, your colleagues, or yourself, is easier to read if it follows some rules.

Most things you can do automatically to maintain a clean codebase is:
- **formatting**: handles quotation, indentation, spacing between class and method definitions
- **linting**: avoids common pitfalls or antipatterns
- **typing**: type annotate parameters to avoid bugs

I won't focus too much on typing since this is very language specific, and I myself am not a big advocate since I prefer to focus more on readable code than on strict typing, and type hints sometimes just disturb my reading flow, but that's probably just a skill issue.
But it does help a lot, and I have prevented a lot of errors by usage of types.

To ensure this, you can either:
- integrate in your IDE
- run formatters/ linters on save
- use pre-commit hooks



There are several philosophical camps and options regarding code style:
- **Strict linting** is mostly adopted by big companies that want to enforce a corporate style guide for team consistency.
This can feel bureaucratic or overly restrictive, especially for smaller teams.
- **Some linting** done by opinionated tools, such as black. This

## Python

Prior to ruff, there were several tools used as a linter and formatter in the Python ecosystem:

- Flake8: linting
- Black: formatting
- isort: Import sorting
- Bandit: Security checks, replaced partially
- pylint: linting, replaced partially

Ruff quite successfuly replaces all these and provides great value, with minimal configuration.
Prior to ruff, I was using only black.

Ruff can be easily added to the project with uv [^1]: if you haven't heard about uv, check out ...

```bash
uv add --dev ruff
```


Ruff comes with some predeifined configurations, and can be run without a configuration file, similar to Black.
If you want to extend the settings, you can place them in a `pyproject.toml`, `ruff.toml`, or `.ruff.toml` file.
See [Configuring Ruff](https://docs.astral.sh/ruff/configuration/) on how to customize Ruff.


Probably i would adjust the Python version and add following rules for a Django project:

```conf
# Python Version 3.11
target-version = "py311"

[lint]
select = [
  "E4",  # default
  "E7",  # default
  "E9",  # default
  "F",  # default
  "I",  # https://docs.astral.sh/ruff/rules/#isort-i
  "B",  # https://docs.astral.sh/ruff/rules/#flake8-bugbear-b
  "DJ",  # https://docs.astral.sh/ruff/rules/#flake8-django-dj
]
```



## Javascript

In the Javascript ecosystem, there are two main tools for formatting / linting:
- **ESLint + Prettier**: Most widely used. Highly configurable but more complex
- **Biome**: A modern tool for formatting and linting in one

### ESlint + Prettier

ESLint is widely adopted across major frameworks such as React, Next.js, Vue, Svelte, etc.
A minimalist ESLint setup would be to let Prettier handle formatting, and ESLint focus on real bugs and developer mistakes, not style.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ViggieM/sandbox/tree/main/eslint)

Typical files used to configure are:
* `eslint.config.js`
* `.prettierrc`
* `.prettierignore`

You can install eslint and prettier with pnpm like this:  [^2]: Another way to be less messy with Javascript is to use `pnpm` instead of `npm`.
<!-- todo: add a why -->

```bash
pnpm install --save-dev eslint prettier eslint-config-prettier
```

The `eslint-config-prettier` plugin is required to turn off rules that conflict with Prettier.

You can now [browse existing eslint configurations](https://github.com/dustinspecker/awesome-eslint) and install them or write your own `eslint.config.js` like this:

```javascript
import prettier from "eslint-config-prettier";

export default [
  {
    rules: {
      "no-unused-vars": "error",
      "no-console": "warn",
      "eqeqeq": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "double"]
    }
  },
  prettier
];
```

An even easier approach would be to install the `@eslint/js` extension, that comes with some default configurations.

```bash
pnpm install --save-dev @eslint/js
```

Then your `eslint.config.js` file would look like this:

```javascript
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [js.configs.recommended, prettier];
```

#### Override ESLint and Prettier rules

One rule I specifically like to override is 'no-unused-vars'.
Sometimes I like to keep function parameters visible, even though they might not be used inside the function, for documentation purposes so I can remember at a later point in time, in case I want to extend the function, what parameters are available.
This is especially useful for callback functions.

In ESLint, this can be accomplished by overriding the rule's default to:

```
'no-unused-vars': [
  'error',
  {
    argsIgnorePattern: '^_',
  },
],
```

So unused variables that start with an underscore are ignored during linting.
Ruff and Biome have this pattern enabled by default.
Self documenting code is the best!

### Biome

[Biome](https://biomejs.dev/) replaces ESLint and Prettier, similar as ruff does to the mentioned python tools.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ViggieM/sandbox/tree/main/biome)


It is easily installable with

```bash
pnpm add -D -E @biomejs/biome
```

This adds it to the dev dependencies and pins it.

Even without a configuration file, Biome comes with a set of preconfigured defaults that you can override in the `biome.json` file, e.g.:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.1.1/schema.json",
  "formatter": {
    "indentStyle": "space"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

You can format, lint and organize imports with one command:

```bash
pnpm exec biome check --write
```

## Editorconfig

## Misc

### Pre-commit hooks

Biome and ruff have excelent integration with pre-commit hooks:

```yaml
repos:
  - repo: https://github.com/biomejs/pre-commit
    rev: "v2.0.6"  # Use latest version
    hooks:
      - id: biome-check
        additional_dependencies: [ "@biomejs/biome@2.1.1" ]
```

```yaml
repos:
  # ...
  - repo: https://github.com/astral-sh/ruff-pre-commit
    # Ruff version.
    rev: v0.12.2
    hooks:
      # Run the linter.
      - id: ruff
      # Run the formatter.
      - id: ruff-format
```

### Typing

I am not a big fan of typing. But I acknowledge the benefits.
For me personally, I like to be free and experiment with how I split my functions, and don't want to think too much about typing.
Maybe this is just a skill issue.


### Code style

Everyone has his own prefered code style.
Some people love classes and services.
I personally prefer functions in modules (in Python).
Here is some general advice that is aplicable:
- reduce the levels of indentation
- Write self documenting code. Avoid comments. They become deprecated, faster than the code and might be misleading. Favor writing more concise and self documenting code and using descriptive variable method names
Tip: mark comments as red.
- keep it simple. Avoid complex code, that you can't understand. If you can't understand your own code, imagine how someone else will see it.

There is no right and wrong when it comes to code style.
Sometimes it is OK to have more than 3 levels of indentation (a struggle in Javascript).
Sometimes a multi line comment is helpful.
And sometimes the function _is_ complex.
So take every advice on coding style with caution, and don't hold too tightly on your presumptions.


Further reading:

- [</> htmx \~ Codin' Dirty](https://htmx.org/essays/codin-dirty/)
- Clean code (youtube)
- [Refactoring](https://martinfowler.com/books/refactoring.html)
