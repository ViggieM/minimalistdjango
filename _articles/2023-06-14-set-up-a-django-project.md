---
layout: page
title:  "How to set up a Django Project"
date:   2023-06-14 12:00:00 +0200
published: true
image: 
  path: /images/DjangoRocket.gif
  thumbnail: /images/DjangoRocket.gif

---

Starting a new project is very exciting and you want to get it right from the start.

<style>
    header.masthead > div.wrap {
        display: none;
    }
</style>

## Choose your Python version with *pyenv*

[Pyenv][pyenv-install] allows you to easily manage multiple Python versions on your system, which is particularly useful when working with different Django projects that require specific versions of Python. 

You can easily install pyenv with curl:

```bash
curl https://pyenv.run | bash
```

Then add the following lines to your `.bashrc`:

```bash
export PYENV_ROOT="$HOME/.pyenv"
command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

To use a specific python version for your project, execute

```bash
pyenv install 3.11.3
pyenv local 3.11.3
```

This will create a `.python-version` file in your project's director, that specifies the currently used python version.
You can verify by executing `python --version`.

## Manage your dependencies with *poetry*

Dependency management is important because external libraries can change over time, and upgrading them without proper management can potentially crash your application.
[Poetry][poetry-install]{:target="_blank"} incorporates everything you need to isolate your project and manage your dependencies.

You can install poetry outside your project's directory with

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

Here are some useful commands that you will always come across:

1. With [`poetry init`][poetry-init]{:target="_blank"} you can easily generate a new `pyproject.toml` file inside the current directory, that keeps track of the project dependencies
2. With [`poetry add <package-name>`][poetry-add]{:target="_blank"} you can add a new package to your `pyproject.toml` file and immediately install it in your virtual environment
3. With [`poetry shell`][poetry-shell]{:target="_blank"} you activate your virtual environment and run it isolated from other projects
4. With [`poetry export`][poetry-export]{:target="_blank"} you can write your dependencies in a format that can be easily installed with [pip][pip]

> ## 🤫 Tip
> Create a `requirements/` directory to separate development, test and production requirements.

## Create a new Django project with *pyenv* and *poetry*

Here is a quick run-through on how to set up a new Django project after having successfully installed *pyenv* and *poetry*:

<script src="https://gist.github.com/movileanuv/56fcce4d2351ab096cbd10e97211782f.js"></script>



## Further Reading
* [RealPython][1]{:target="_blank"}: More details on how to work with poetry
* [Boring Python: dependency management][2]{:target="_blank"}: Great article that describes how to work with tools like "pip" and "venv" and what you have to look out for



[1]: https://realpython.com/dependency-management-python-poetry/
[2]: https://www.b-list.org/weblog/2022/may/13/boring-python-dependencies/
[pip]: https://pip.pypa.io/en/stable/installation/
[poetry-install]: https://python-poetry.org/docs/#installation
[poetry-init]: https://python-poetry.org/docs/cli/#init
[poetry-add]: https://python-poetry.org/docs/cli/#add
[poetry-shell]: https://python-poetry.org/docs/cli/#shell
[poetry-export]: https://python-poetry.org/docs/cli/#export
[venv-in-docker]: https://www.b-list.org/weblog/2022/may/13/boring-python-dependencies/#:~:text=And%20even%20if%20you%E2%80%99re%20deploying%20in%20a%20container%20which%20you%20know%20has%20only%20one%20Python%20interpreter%20in%20it%2C%20I%20still%20urge%20you%20to%20create%20a%20virtual%20environment%20inside%20it%20anyway
[pyenv-install]: https://github.com/pyenv/pyenv#installation
[pyenv-docs]: https://github.com/pyenv/pyenv
