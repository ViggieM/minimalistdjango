---
title: "Clean Code: Automated Formatting and Linting for Python and JavaScript"
pubDate: 2025-07-15
shortDescription: "Master code consistency with modern tools like Ruff and Biome. Learn automated formatting, linting, and quality enforcement for Django projects."
tags:
  - Developer Experience
keywords: clean code, code formatting, linting tools, ruff python, biome javascript, eslint prettier, code quality automation, developer productivity
---

Whether you like tabs over spaces or single quotes over double quotes, it really doesn't matter.
**Consistent code style** is not about personal preference, but about avoiding unnecessary discussions within teams.
A clear and consistent structure makes the code overall **easier to read**, whether by AI, your colleagues, or yourself.

## Quick Start

**Want to get started immediately?** Here are the minimal commands to set up code quality tools:

### For Python Projects
```bash
# Install Ruff
uv add --dev ruff

# Format and lint in one command
ruff check --fix && ruff format
```

### For JavaScript Projects
```bash
# Install Biome
pnpm add -D -E @biomejs/biome

# Format, lint, and organize imports
pnpm exec biome check --write
```

### For Both (EditorConfig)
Create a `.editorconfig` file in your project root:
```editorconfig
root = true

[*]
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
insert_final_newline = true
charset = utf-8
end_of_line = lf

[*.py]
indent_size = 4
```

That's it! These tools work with **sensible defaults** and require minimal configuration.

## Why Code Quality Tools Matter

Here are some things you can do to **automatically maintain** a clean codebase:
- **Formatting**: handles quotation, indentation, spacing between class and method definitions
- **Linting**: avoids common pitfalls and programming anti-patterns
- **Typing**: type annotations prevent bugs and provide a clearer interface for classes and methods

I won't focus too much on typing since this is very **language specific**, and I myself am not a big advocate for typing, since I prefer to focus more on **readable code** than on strict typing early on in projects.
I have a feeling that type hints disturb my code reading flow, but that's probably just a skill issue.
The more **mature** a project is, the more I prefer to do **strong typing** to avoid bugs.

## The Modern Solution

There are various formatters and linters for every programming language. Here, I will focus on **Python** and **JavaScript**, since these are the two languages Django developers most frequently work with.
Each of them have a **clear winner** (**Ruff** for Python, **Biome** for JavaScript), but older projects might still use the other tools mentioned (black, eslint, prettier, ...).

Here is an overview over linters and formatters in Python and JavaScript:

| Tool             | Introduced | Focus                           | Language(s)          | Created By / Org           |
| ---------------- | ---------- | ------------------------------- | -------------------- | -------------------------- |
| **EditorConfig** | 2011       | Editor style consistency        | Any (editor-based)   | Nicolas Gallagher          |
| **ESLint**       | 2013       | Linting, code quality           | JavaScript, TS       | Nicholas C. Zakas          |
| **Prettier**     | 2017       | Code formatting                 | JS, TS, Python, etc. | James Long                 |
| **Biome**        | 2023       | Formatter + linter (Rust-based) | JS, TS, JSON         | Biome team (formerly Rome) |
| **Ruff**         | 2022       | Ultra-fast linter + formatter   | Python               | Charlie Marsh / Astral     |
| **Flake8**       | 2011       | Linting, PEP 8 enforcement      | Python               | Tarek Ziadé & community    |
| **Black**        | 2018       | Opinionated code formatter      | Python               | Łukasz Langa / PSF         |
| **isort**        | 2013       | Import sorting                  | Python               | Timothée Mazzucotelli      |
| **Bandit**       | 2014       | Security-focused linting        | Python               | OpenStack Security Project |
| **pylint**       | 2003       | Deep linting, style & errors    | Python               | Logilab                    |


## Python

Prior to [Ruff](https://docs.astral.sh/ruff/), there were several tools used as a linter and formatter in the Python ecosystem:

- **Flake8**: used for linting
- **Black**: used for formatting
- **isort**: used for sorting Imports
- **Bandit**: Security checks (replaced partially by Ruff)
- **pylint**: linting (replaced partially)

Ruff quite successfully **replaces all these tools** and provides great value, with **minimal configuration**.
It can be **easily added** to the project with [uv](https://docs.astral.sh/uv/):

```bash
uv add --dev ruff
```

Ruff comes with some **predefined configurations** that mirror Black's settings, and can be run even **without a configuration file**.
If you want to extend the settings, you can place them in a `pyproject.toml`, `ruff.toml`, or `.ruff.toml` file.
See [Configuring Ruff](https://docs.astral.sh/ruff/configuration/) on how to customize Ruff.


Probably I would adjust the Python version and add following rules for a Django project:

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

## JavaScript

In the JavaScript ecosystem, there are **two main tools** for formatting / linting:
- **ESLint + Prettier**: Most widely used. **Highly configurable** but more complex
- **Biome**: A **modern tool** for formatting and linting in one

### ESLint + Prettier

ESLint is **widely adopted** across major frameworks such as React, Next.js, Vue, Svelte, etc.
A **minimalist ESLint setup** would be to let Prettier handle formatting, and ESLint focus on **real bugs and developer mistakes**, not style.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ViggieM/sandbox/tree/main/eslint)

Typical files used to configure are:
* `eslint.config.js`
* `.prettierrc`
* `.prettierignore`

You can install eslint and prettier with pnpm[^pnpm] like this:

```bash
pnpm install --save-dev eslint prettier eslint-config-prettier
```

The `eslint-config-prettier` plugin is **required** to turn off rules that conflict with Prettier.

You can now [browse existing eslint configurations](https://github.com/dustinspecker/awesome-eslint) and install them, or write your own `eslint.config.js` like this:

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

One rule I specifically like to override is **'no-unused-vars'**.
Sometimes I like to keep function parameters visible, even though they might not be used inside the function, for **documentation purposes**, so I can remember at a later point in time, in case I want to extend the function, what parameters are available.
This is especially useful for **callback functions**.

In ESLint, this can be accomplished by overriding the rule's default to:

```json lines
'no-unused-vars': [
  'error',
  {
    argsIgnorePattern: '^_',
  },
],
```

So unused variables that start with an underscore are ignored during linting.
Ruff and Biome have this pattern **enabled by default**.
**Self documenting code** is the best!

### Biome

[Biome](https://biomejs.dev/) **replaces ESLint and Prettier**, similar as Ruff does to the mentioned python tools.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ViggieM/sandbox/tree/main/biome)


It is easily installable with

```bash
pnpm add -D -E @biomejs/biome
```

This adds it to the dev dependencies and **pins it**.

Even **without a configuration file**, Biome comes with a set of **preconfigured defaults** that you can override in the `biome.json` file, e.g.:

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

You can **format, lint and organize imports** with **one command**:

```bash
pnpm exec biome check --write
```

## Editorconfig

This is the **most basic way** to clean your code a bit.
[EditorConfig](https://editorconfig.org/) has been around since **2011**.

The configuration I use for most of my projects is:

```ini
# https://editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
insert_final_newline = true
charset = utf-8
end_of_line = lf

[*.py]
indent_size = 4

[Makefile]
indent_style = tab
```

## Misc

### Pre-commit hooks

Unlike other linters and formatters, Biome and Ruff have **excellent integration** with **pre-commit hooks**, which is why I prefer them over other tools:

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

### Code style

Everyone has his own **preferred code style**.
Some people love **classes and services**.
I personally prefer **functions in modules** (in Python).

Here is some **general advice** that is applicable:
- **Reduce the levels of indentation**: There is a famous saying by **Linus Torwalds**:
  > if you need more than 3 levels of indentation, you’re screwed anyway, and should fix your program.
- **Write self documenting code**: use **descriptive variable and method names** and avoid complexity.
- **Avoid comments**: They become deprecated faster than the code and might be misleading. If you need comments to explain your code, you should probably **rewrite it**.
**Tip**: mark comments as red. If they are important, you should read them. If not, you should delete them.

There is **no right and wrong** when it comes to code style.
Sometimes it is OK to have more than 3 levels of indentation (something I struggle with in JavaScript 🥴).
Sometimes a multi-line comment is helpful.
And sometimes the function _is_ **complex**.
So take every advice on coding style with **caution**, and learn **when to break the rules**.


## Conclusion

Maintaining clean, consistent code doesn't have to be a manual chore. With modern tools like **Ruff** for Python and **Biome** for JavaScript, you can:

- **Automate formatting** and linting with minimal setup
- **Reduce code review friction** by eliminating style discussions
- **Improve code quality** through consistent error detection
- **Save development time** with fast, integrated tooling

### Key Takeaways

1. **Start simple**: Use the Quick Start commands above to get immediate benefits
2. **Choose modern tools**: Ruff and Biome are faster and more comprehensive than their predecessors
3. **Automate everything**: Set up pre-commit hooks and CI/CD integration
4. **Focus on readability**: Tools should enhance, not hinder, code understanding

### Next Steps

1. **Install the tools** in your current project using the Quick Start guide
2. **Configure your IDE** to run these tools on save
3. **Set up pre-commit hooks** for your team
4. **Add CI/CD checks** to ensure code quality in your pipeline

Remember: **perfect code style is consistent code style**. The specific rules matter less than having everyone follow the same ones automatically.

### Further reading

- [</> htmx \~ Codin' Dirty](https://htmx.org/essays/codin-dirty/)
- [Clean Code - Uncle Bob / Lesson 1 - YouTube](https://www.youtube.com/watch?v=7EmboKQH8lM&list=PLmmYSbUCWJ4x1GO839azG_BBw8rkh-zOj)
- [Refactoring](https://martinfowler.com/books/refactoring.html): This book is really useful to learn when you should start cleaning your code

[^pnpm]: Another way to be less messy with JavaScript is to use [`pnpm`](https://pnpm.io/) instead of `npm`. This reduces writes on your SSD and improves installation speed for packages
