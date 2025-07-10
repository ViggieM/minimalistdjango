---
title: "Clean Code"
pubDate: 2025-07-09
shortDescription: "Learn how to maintain clean, consistent code with formatting and linting tools"
tags:
  - Developer Experience
keywords: clean code, linting, formatting, eslint, prettier, biome, code quality
---

Whether you like tabs over spaces, single quotes over double quotes, it really doesn't matter.
Consistent code style is not about personal preference, but about avoiding unnecessary discussions within teams.
Clean code, whether it is written by AI, your colleagues, or yourself, is easier to read if it follows some rules.

There are several philosophical camps and options regarding code style:
- **Strict linting** is mostly adopted by big companies that want to enforce a corporate style guide for team consistency.
This can feel bureaucratic or overly restrictive, especially for smaller teams.
- **Some linting** done by opinionated tools, such as black. This

## Python

## Javascript

In the Javascript ecosystem, there are two main tools for formatting / linting:
- ESLint + Prettier: Most widely used. Highly configurable but more complex
- Biome: A modern tool for formatting and linting in one

Another way to be less messy with Javascript is to use `pnpm` instead of `npm`.
<!-- todo: add a why -->

### ESlint + Prettier

ESLint is widely adopted across major frameworks such as React, Next.js, Vue, Svelte, etc.
A minimalist ESLint setup would be to let Prettier handle formatting, and ESLint focus on real bugs and developer mistakes, not style.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ViggieM/sandbox/tree/main/eslint)

Typical files used to configure are:
* `eslint.config.js`
* `.prettierrc`
* `.prettierignore`

To install eslint and prettier, do:

```bash
pnpm install --save-dev eslint prettier eslint-config-prettier
```

The `eslint-config-prettier` plugin is required to turn off rules that conflict with Prettier.

You can now [use existing eslint configurations](https://github.com/dustinspecker/awesome-eslint) or write your own `eslint.config.js`:

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
This is probably a skill issue, but sometimes I like to keep function parameters, even though they might not be used inside the function.
This is especially useful for callback functions, so I can remember at a later point in time, in case I want to extend the function, what parameters are available.

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
Self documenting code is the best!

### Biome



## Editorconfig

## Misc

### Pre-commit hooks

Biome has excelent integration with pre-commit hooks:

```yaml
repos:
  - repo: https://github.com/biomejs/pre-commit
    rev: "v2.0.6"  # Use latest version
    hooks:
      - id: biome-check
        additional_dependencies: [ "@biomejs/biome@2.1.1" ]

```
