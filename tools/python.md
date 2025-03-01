---
title: Python
---

# Python

I don't think I have to say much about this, since you are already on a blog about Django.
But here are some thoughts and resources on Python that I have stumbled upon during my learning path that you might find useful.

## Set up a python environment

Setting up a python environment can be confusing at the beginning, since there are so many options of installing or using python on your machine:
- system python
- virtual environments
- conda

Not to mention Windows which is a totally different domain to Linux and Mac.
In Windows, it is recommended to use WSL2 (Windows subsystem for linux) for using Python, as of 2024.
And I don't use Mac, so I have no thoughts on that.

Here are some guidelines that you should consider when installing python:
- do not use the system python. this is required for your system, and messing around with dependencies can cause you big trouble at some point in the future.
- do not use sudo to install python. You should not be required to use sudo to set up your python environment.

The easiest way to use python in my opinion is to use Pyenv. It is easy to install and set up different python versions a per-user basis.
It allows you to switch between python versions easily, install the newest python versions and set python versions on a per-project basis.

Source:
- [Talk - Calvin Hendryx-Parker: Bootstrapping Your Local Python Environment - YouTube](https://www.youtube.com/watch?v=-YEUFGFHWgQ&t=7s)

## Related Tools
- [Pyenv](https://github.com/pyenv/pyenv): Python version management
- [pipx](https://github.com/pypa/pipx): Installs python packages in dedicated virtual environments, outside your system-wide Python interpreter or even activated virtual environments
- [Poetry](https://github.com/python-poetry/poetry): A dependency management tool written in Python
- [uv](https://github.com/astral-sh/uv): A dependency management tool written in Rust

## Resources

* [The Hitchhiker’s Guide to Python! — The Hitchhiker's Guide to Python](https://docs.python-guide.org/)
* [Python Tutorials – Real Python](https://realpython.com/)
