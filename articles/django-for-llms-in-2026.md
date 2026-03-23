---
title: "Django Project Setup for LLMs"
pubDate: 2026-03-22
shortDescription: "A practical guide to setting up a Django project with the right tools, best practices, and MCP servers for working effectively with AI coding agents."
tags:
  - Developer Experience
keywords: django, python, uv, llm, coding agents, claude code, mcp servers, ruff, mypy, pre-commit, type checking, debugging, git worktrees
---

AI coding agents have changed the pace at which software gets written, and the temptation to move faster and faster has never been greater.
But the faster you move, the better brakes you need in case something goes wrong.
Foundations matter more than ever and the once appealing task of writing code by hand is not justifiable anymore.
Even though abstract and boring to learn, they are applicable to every programming language.
By applying them intentionally, you will become a better software engineer in every environment.

This article walks through the tools, habits, MCP servers and resources that will help you build Django projects with the help of coding agents.


## Brace yourself for the ride: adopt best practices early on

So let's start with yourself, so you don't accidentally shoot yourself in the foot when coding with LLMs.

### Python environment

One of the biggest issues when working with python is managing the right python version and the different python environments.
You NEVER EVER want to install things on the system python environment, even though that might seem convenient.
If you are using Unix, Mac or WSL, you have several options at your disposal.
If you are using Windows, I feel sorry for you and you should install WSL.

A few years ago, Pyenv was the way to go for managing python versions and virtual environments, and poetry was used for installation of external packages.
Since then, uv has taken over the python community and has replaced both tools successfully, making it easy to do all three combined.
If you plan to manage multiple runtimes, like Node for building your React Frontend (🤢) or Go, you can use proto, but that would go beyond the scope of this article.
In short, we will stick with UV, since it is the easiest way to work with python and will prove useful along the way in different forms.

```bash
# Install the Python version you want (downloads pre-built binary, ~seconds)
uv python install 3.12
# Create the project — this also creates a virtual environment for your project (the .venv/ directory) and a .python-version file
uv init myproject
cd myproject

#  At this point your directory looks like:
#  myproject/
#  ├── .python-version    ← "3.12" — read by uv and pyenv alike
#  ├── .venv/             ← venv already created, no activate needed
#  ├── pyproject.toml     ← project metadata
#  └── main.py			  ← you can delete this


# Installs Django into .venv and updates pyproject.toml + uv.lock
uv add django

# Creates all django related project files in the src/ directory
uv run django-admin startproject config src

# Here are the usual commands you will run at the beginning
uv run python manage.py migrate
uv run python manage.py runserver
uv run python manage.py shell
uv run python manage.py createsuperuser
```

### Debugging

The next thing you need to set up for working with coding agents is a functioning debugging environment.
Most code editors provide useful online instructions on how to set up debugging, and you can probably ask your coding agent to set it up for you.
Learning how to work with a debugger is a particularly useful skill that is worth the effort.
Debugging skills are what separate juniors from senior developers.
And you will almost certainly need that at some point.

### Version control

If you initialized your django project with uv, you probably already have version control enabled.
Ask your coding agent to commit regularly, for example "Commit everything in logical chunks" or "Merge the feature branch into main and resolve merge conflicts. Make sure all tests pass".
Create your own git commit skill to format your messages properly.
[Here is an example of mine.](https://gist.github.com/ViggieM/ecd56c3ec01941e621fba66ff4d6b152)

### Logging

Finally, implement a logging strategy early on.
Logging is essential for you and the LLM to understand what is going on, locally and in production.
Logs work like a debugger for LLMs.
Ask a coding agent to insert log statements to investigate a problem, and it will happily add helpful logging messages wherever necessary.


## Equip your coding agent with the right tools

Until now, I have provided you with the safety gear before stepping into the car.
Now it's time to enhance the coding agent's capabilities.

### Typing

Typing is probably one of the most helpful things for an LLM.
Since Python is itself not typed and has no compilation step, one crucial element for ensuring that no broken code was written is falling away.
Types are like unit tests you don't have to write.
This makes Python not as solid a choice for programming with LLMs as other languages like Typescript, Go or [Elixir](https://dashbit.co/blog/why-elixir-best-language-for-ai).
But we sacrifice stability for development speed.

Written correctly, django is perfectly capable of handling high traffic.
Nonetheless, types are in my experience not the breaking point of the maintainability of an application.
Clean architecture and separation of concerns are the biggest contributors to a project that scales.
Also, avoiding overengineering and premature optimization is highly beneficial.
Constantly ask yourself "what is the easiest thing that would work?".

Astral's ty looks very promising for providing fast type checking in Python, but it does not yet support types in django.
Therefore [mypy](https://mypy-lang.org/) and django-stubs are the most common way to include type support for django code, followed by [Pyright](https://github.com/microsoft/pyright) if you are using VS Code.

### Linting & Formatting

Linting and formatting are another way to keep your projects clean and structured.
Since 2023, ruff has established itself in combination with uv as the go-to formatter and linter, with django linting rules included.
The setup is straightforward and it takes almost no time.

```bash
uv add --dev ruff
```

Additionally, you should add pre-commit hooks, to make sure everything you or the llm commits is checked.

```yaml
// .pre-commit-config.yaml
repos:
- repo: https://github.com/astral-sh/ruff-pre-commit
  rev: v0.15.7  # pin to latest stable
  hooks:
    - id: ruff-check
      args: [--fix]
      types_or: [python, pyi]
    - id: ruff-format
      types_or: [python, pyi]
```

```bash
uv add --dev pre-commit
uv run pre-commit install
```

### Documentation

Next thing in line is documentation.
Your project should have a [README](https://scribe.rip/ambient-innovation/docs-or-its-built-differenlty-priming-ai-with-atomic-docs-693e34206727) for you and a `CLAUDE.md`, `AGENTS.md` or whatever agent you are using to provide quick information for the agent to help itself.
Maintain a `docs/` folder both for you and the LLM.
The benefit of working in feature branches is that the coding agent can invoke a skill that checks and updates the documentation.
`CLAUDE.md` should contain the project structure, information about the tools and skills it can use in certain situations and a pointer to more documentation to help itself when necessary.
I have seen [huge CLAUDE.md](https://github.com/harperreed/dotfiles/blob/master/.claude/CLAUDE.md) files with tons of instruction, that were sometimes quite funny (like "call me 'Mr. BEEF' whenever you address me").
But keep in mind that every skill, MCP server, or rule you add pollutes the context.
That's why I personally believe that most rules, skills and mcp servers should be project specific.
This has two advantages: they are focused on the project itself, and they are committed with the code.

Read [Affan's shorthand guide to 'Everything Claude Code'](https://x.com/affaanmustafa/status/2012378465664745795) to acquaint yourself with all the features and skills [in the repo](https://github.com/affaan-m/everything-claude-code), but be cautious of adopting other people's skills blindly, as some of them might contain malicious instructions.
Think of them as a collection of best practices and a learning resource, and copy what resonates with you, rather than adopting development practices you are not familiar with.

### Tests

Tests are not only useful as proof that your code (still) works as intended, but also as documentation for business logic and edge cases.
It's not useful to write every possible test to improve code coverage.
Most of the code is glue code with no particular value.
Writing tests for that will increase the time spent on refactoring, and trust me, you will be refactoring.
Instead, focus on the critical parts of your application, that contain business logic.
Make sure validation is correct, your URL endpoints are properly tested, and permissions are enforced.
Writing testable code is far more important than writing tests.
The step from testable code to a test is very small.
Adopt a TDD practice, and [don't let AI blindly write your tests](https://diwank.space/field-notes-from-shipping-real-code-with-claude).
You will lose a lot of valuable experience that will help you architect your applications better.

### Tools

Finally, we have tools.
Coding agents are already equipped with a set of tools that will help them navigate the code and search for solutions online.
But like documentation, we can give them a hint where to look.
MCP servers were the hottest thing in 2025, but since the introduction of skills they have lost popularity.
However, there are still some MCP servers that will improve your agent's capabilities dramatically. Here are some of them:

**Official Documentation**: [context7](https://github.com/upstash/context7) is one of them. [Exa search](https://github.com/exa-labs/exa-mcp-server) is a more context-efficient, paid alternative (with a free tier).

**Frontend**: If you are doing frontend, the [Playwright](https://github.com/microsoft/playwright-mcp) or [Puppeteer](https://github.com/jaenster/puppeteer-mcp-claude) MCP servers, or the [Chrome DevTools MCP server](https://github.com/ChromeDevTools/chrome-devtools-mcp) would dramatically improve your agent's debugging capabilities.

**Deployment**: Most hosters provide MCP servers that will help you with the deployment of your application, once you have signed in to their platform.

**Code search**: `grep` only works well for specific queries. Alternatives like [mgrep](https://github.com/mixedbread-ai/mgrep) allow for natural language queries like "where do we set up auth?", use fewer tokens, and return better results.

Beyond the MCP servers mentioned here, there are [many](https://batsov.com/articles/2026/02/17/supercharging-claude-code-with-the-right-tools/) [more](https://github.com/hesreallyhim/awesome-claude-code) [useful](https://github.com/jj-vcs/jj) CLI tools worth exploring. If you can't find what you need for your specific task, you can always write your own.

*Pro tip: You should definitely install the [Peon MCP server](https://www.peonping.com/), no questions asked. It makes you so much more productive - or at least a bit more fun when digging through messy AI-generated code.*

## Final Thoughts

Don't let AI agents take your opportunities to learn.
If you don't know how to code the solution yourself, discuss with the LLM different approaches and their trade-offs.
You might find better solutions than you initially thought.
And avoid working on [multiple things at once](https://thoughtbot.com/blog/the-presidents-doctor).
Using [git worktrees](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees#git-worktrees-the-unsung-hero) to work on several features in parallel sounds fancy, but our attention is limited.
Pick one thing at a time and do it well. Build a solid foundation on which your projects can grow.

Happy Coding!
