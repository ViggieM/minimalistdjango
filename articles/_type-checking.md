---
title: "Type Checking Integration: mypy, Pyright, and TypeScript for Django Projects"
pubDate: 2025-07-15
shortDescription: "Integrate type checking seamlessly with your formatting and linting workflow. Learn mypy, Pyright, and TypeScript setup for robust Django development."
tags:
  - Developer Experience
keywords: type checking, mypy python, pyright typescript, django type hints, static analysis, developer productivity, code quality
---

Type checking is the **third pillar** of code quality, alongside formatting and linting. While formatting ensures consistent style and linting catches common errors, **type checking prevents runtime bugs** by verifying that your code uses the correct data types throughout your application.

## Quick Start

**Want to add type checking immediately?** Here are the minimal commands:

### For Python Projects
```bash
# Install mypy
uv add --dev mypy django-stubs

# Basic type check
mypy .
```

### For JavaScript Projects
```bash
# Install TypeScript
pnpm add -D typescript @types/node

# Initialize TypeScript
pnpm exec tsc --init

# Type check without compilation
pnpm exec tsc --noEmit
```

### For Django Projects
```bash
# Install Django-specific stubs
uv add --dev django-stubs mypy

# Create mypy configuration
echo "[tool.mypy]
python_version = \"3.11\"
plugins = [\"mypy_django_plugin.main\"]
strict = true

[tool.django-stubs]
django_settings_module = \"myproject.settings\"" >> pyproject.toml
```

That's it! These tools integrate seamlessly with your existing **Ruff** and **Biome** workflow.

## Why Type Checking Matters

Type checking provides several key benefits:

- **Early bug detection**: Catch type-related errors before runtime
- **Better IDE support**: Enhanced autocomplete and refactoring
- **Self-documenting code**: Types serve as inline documentation
- **Safer refactoring**: Change code with confidence
- **Team collaboration**: Clear interfaces between modules

Unlike formatting and linting, type checking is **optional** but increasingly valuable as projects grow in complexity.

## Python Type Checking

### mypy: The Standard Choice

[mypy](https://mypy-lang.org/) is the **most mature** and widely adopted type checker for Python. It works perfectly alongside Ruff for comprehensive code quality.

#### Installation and Setup

```bash
# Install mypy and Django stubs
uv add --dev mypy django-stubs

# Optional: Install stubs for other libraries
uv add --dev types-requests types-redis types-pillow
```

#### Configuration

Add to your `pyproject.toml`:

```toml
[tool.mypy]
python_version = "3.11"
plugins = ["mypy_django_plugin.main"]
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

# Django-specific settings
[tool.django-stubs]
django_settings_module = "myproject.settings"

# Per-module configuration
[[tool.mypy.overrides]]
module = "myproject.migrations.*"
ignore_errors = true
```

#### Basic Usage

```bash
# Check entire project
mypy .

# Check specific files
mypy myapp/models.py myapp/views.py

# Generate coverage report
mypy --html-report mypy-report .
```

### Pyright/Pylance: The Modern Alternative

[Pyright](https://github.com/microsoft/pyright) is Microsoft's **faster** type checker, built into VS Code as Pylance. It offers **better performance** and **enhanced Django support**.

#### Installation

```bash
# Install Pyright globally
npm install -g pyright

# Or use with VS Code (Pylance extension)
# No installation needed - built into Python extension
```

#### Configuration

Create `pyrightconfig.json`:

```json
{
  "pythonVersion": "3.11",
  "pythonPlatform": "Linux",
  "typeCheckingMode": "strict",
  "reportMissingImports": true,
  "reportMissingTypeStubs": false,
  "include": ["src", "myproject"],
  "exclude": ["**/migrations/**", "**/venv/**"],
  "stubPath": "typings"
}
```

#### Django Integration

Pyright has **better Django model inference** than mypy:

```python
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()

# Pyright automatically infers:
user = User.objects.get(id=1)
# user.name is str
# user.email is str
# user.id is int
```

## JavaScript/TypeScript Type Checking

### Full TypeScript Migration

For **new projects** or when ready for full type safety:

```bash
# Install TypeScript
pnpm add -D typescript @types/node

# Initialize configuration
pnpm exec tsc --init
```

#### TypeScript Configuration

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Integration with Biome

Biome handles formatting, TypeScript handles types:

```bash
# Format and lint with Biome
pnpm exec biome check --write .

# Type check with TypeScript
pnpm exec tsc --noEmit
```

### Gradual TypeScript with JSDoc

For **existing JavaScript projects**, use JSDoc for gradual type adoption:

```javascript
/**
 * @param {string} name - User's name
 * @param {number} age - User's age
 * @returns {Promise<User>} The created user
 */
async function createUser(name, age) {
  // Implementation
}

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} age
 * @property {string} email
 */
```

Enable type checking in VS Code:

```json
{
  "js/ts.implicitProjectConfig.checkJs": true,
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

## IDE Integration

### VS Code Setup

Update your `.vscode/settings.json`:

```json
{
  // Python type checking
  "python.analysis.typeCheckingMode": "strict",
  "python.analysis.autoImportCompletions": true,
  "python.linting.mypyEnabled": true,
  "python.linting.mypyArgs": ["--config-file", "pyproject.toml"],

  // TypeScript type checking
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true,

  // Combined workflow
  "python.formatting.provider": "none",
  "[python]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  }
}
```

### JetBrains IDEs

#### PyCharm Type Checking

1. **Settings** → **Editor** → **Inspections** → **Python**
2. Enable **Type checker** inspections
3. Configure **mypy** as external tool
4. Set up **File Watchers** for automatic checking

#### WebStorm Type Checking

1. **Settings** → **Languages & Frameworks** → **TypeScript**
2. Enable **TypeScript Language Service**
3. Configure **TypeScript compiler** options
4. Set up **automatic compilation** on save

## Django-Specific Type Checking

### Model Type Hints

```python
from django.db import models
from typing import Optional

class User(models.Model):
    name: str = models.CharField(max_length=100)
    email: str = models.EmailField()
    age: Optional[int] = models.IntegerField(null=True, blank=True)

    def get_display_name(self) -> str:
        return self.name.title()

    @classmethod
    def get_adult_users(cls) -> models.QuerySet['User']:
        return cls.objects.filter(age__gte=18)
```

### View Type Hints

```python
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from typing import Dict, Any

def user_profile(request: HttpRequest, user_id: int) -> HttpResponse:
    user = User.objects.get(id=user_id)
    context: Dict[str, Any] = {'user': user}
    return render(request, 'user_profile.html', context)

def api_user_data(request: HttpRequest, user_id: int) -> JsonResponse:
    user = User.objects.get(id=user_id)
    data: Dict[str, Any] = {
        'name': user.name,
        'email': user.email,
        'age': user.age
    }
    return JsonResponse(data)
```

### Settings Type Hints

```python
# settings.py
from typing import List, Dict, Any

DEBUG: bool = True
SECRET_KEY: str = "your-secret-key"
ALLOWED_HOSTS: List[str] = ['localhost', '127.0.0.1']

DATABASES: Dict[str, Dict[str, Any]] = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

## Workflow Integration

### Pre-commit Hooks

Add type checking to your `.pre-commit-config.yaml`:

```yaml
repos:
  # Formatting and linting
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.12.2
    hooks:
      - id: ruff
      - id: ruff-format

  # Type checking
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [django-stubs]
        args: [--config-file=pyproject.toml]

  # JavaScript/TypeScript
  - repo: https://github.com/biomejs/pre-commit
    rev: "v2.0.6"
    hooks:
      - id: biome-check
        additional_dependencies: ["@biomejs/biome@2.1.1"]
```

### CI/CD Integration

#### GitHub Actions

```yaml
name: Code Quality
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install uv
          uv sync

      - name: Format and lint
        run: |
          uv run ruff check .
          uv run ruff format --check .

      - name: Type check
        run: uv run mypy .

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Node dependencies
        run: pnpm install

      - name: Check JavaScript
        run: |
          pnpm exec biome check .
          pnpm exec tsc --noEmit
```

### Command Line Aliases

Add to your shell profile:

```bash
# Complete code quality check
alias check="ruff check . && ruff format --check . && mypy . && pnpm exec biome check . && pnpm exec tsc --noEmit"

# Fix formatting and linting
alias fix="ruff check --fix . && ruff format . && pnpm exec biome check --write ."

# Type check only
alias typecheck="mypy . && pnpm exec tsc --noEmit"
```

## Migration Strategy

### Adding Types to Existing Django Projects

1. **Start with configuration**: Set up mypy with lenient settings
2. **Add stubs**: Install django-stubs and common library stubs
3. **Type new code**: Require types for all new functions/classes
4. **Gradual migration**: Add types to existing code module by module
5. **Increase strictness**: Gradually enable stricter mypy settings

#### Gradual mypy Configuration

```toml
[tool.mypy]
python_version = "3.11"
plugins = ["mypy_django_plugin.main"]

# Start lenient
strict = false
warn_return_any = false
disallow_untyped_defs = false

# Gradually enable per module
[[tool.mypy.overrides]]
module = "myproject.new_app.*"
strict = true
disallow_untyped_defs = true
```

### JavaScript to TypeScript Migration

1. **Add TypeScript**: Install TypeScript and configure
2. **Rename files**: Change `.js` to `.ts` gradually
3. **Add basic types**: Start with function parameters and return types
4. **Enable strict mode**: Increase TypeScript strictness over time
5. **Remove any types**: Replace `any` with proper types

## Performance Considerations

### mypy Optimization

```toml
[tool.mypy]
# Speed up mypy
incremental = true
sqlite_cache = true
cache_dir = ".mypy_cache"
skip_version_check = true
```

### TypeScript Optimization

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    "skipLibCheck": true
  }
}
```

## Conclusion

Type checking complements formatting and linting to create a **comprehensive code quality workflow**. With proper integration:

- **Catch bugs early** with static analysis
- **Improve code documentation** through type annotations
- **Enhance IDE experience** with better autocomplete
- **Enable safer refactoring** with type-aware tools

### Key Takeaways

1. **Start gradually**: Add type checking to new code first
2. **Use modern tools**: mypy/Pyright for Python, TypeScript for JavaScript
3. **Integrate with existing workflow**: Combine with Ruff and Biome
4. **Configure your IDE**: Set up automatic type checking on save

### Next Steps

1. **Install type checkers** using the Quick Start commands
2. **Configure your IDE** for automatic type checking
3. **Add pre-commit hooks** for consistent team workflow
4. **Start typing new code** and gradually migrate existing code

Remember: **Type checking is a journey, not a destination**. Start simple and gradually increase type coverage as your team becomes comfortable with the workflow.

### Further Reading

- [mypy documentation](https://mypy.readthedocs.io/)
- [Pyright documentation](https://github.com/microsoft/pyright)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Django type hints best practices](https://django-stubs.readthedocs.io/)
