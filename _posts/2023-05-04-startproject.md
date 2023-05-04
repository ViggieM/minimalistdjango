---
layout: post
title:  "Start a new Django project"
date:   2023-05-04 00:00:00 +0200
published: true
author: victor
tags:
  - Django
  - poetry
categories:
  - Development setup
---

<script src="https://gist.github.com/movileanuv/56fcce4d2351ab096cbd10e97211782f.js"></script>

Dependency management is important because external libraries can change over time, and upgrading them without proper management can potentially crash your application.
Properly managing dependencies by pinning versions and keeping applications isolated can ensure that they function properly and securely.

The default tools for installing third party libraries and isolating your dependencies are "pip" and "venv" respectively.
[This article][2]{:target="_blank"} describes some general guidelines for working with these tools, like:

* pin your dependencies in a requirements file
* create a `requirements/` directory to separate development, test and production requirements
* specify a hash for each of your dependencies

[Poetry][poetry-install]{:target="_blank"} incorporates everything you need to isolate your project and mange your dependencies.

1. With [`poetry init`][poetry-init]{:target="_blank"} you can easily create a new pyproject.toml file inside the current directory, that keeps track of the project dependencies
2. With [`poetry add <package-name>`][poetry-add]{:target="_blank"} you can add a new package to your pyproject.toml and immediatly install it
3. With [`poetry shell`][poetry-shell]{:target="_blank"} you activate your virtual environment and run it isolated from other projects
4. With [`poetry export`][poetry-export]{:target="_blank"} you can write your dependencies in a format that can be easily installed with [pip][pip]

# Tips:
* use pyenv 
* use virtual environments [even inside Docker containers][venv-in-docker]{:target="_blank"}
* profit from tools like github's **Dependabot** to make sure your packages are up to date
* write tests for your application's core features, to ensure that updating your dependencies does not crash your application

# Further Reading
* [RealPython][1]
* [Boring Python: dependency management][2]


[pyenv]: {% post_url 2023-05-04-pyenv %}

[1]: https://realpython.com/dependency-management-python-poetry/
[2]: https://www.b-list.org/weblog/2022/may/13/boring-python-dependencies/

[pip]: https://pip.pypa.io/en/stable/installation/

[poetry-install]: https://python-poetry.org/docs/#installation
[poetry-init]: https://python-poetry.org/docs/cli/#init
[poetry-add]: https://python-poetry.org/docs/cli/#add
[poetry-shell]: https://python-poetry.org/docs/cli/#shell
[poetry-export]: https://python-poetry.org/docs/cli/#export

[venv-in-docker]: https://www.b-list.org/weblog/2022/may/13/boring-python-dependencies/#:~:text=And%20even%20if%20you%E2%80%99re%20deploying%20in%20a%20container%20which%20you%20know%20has%20only%20one%20Python%20interpreter%20in%20it%2C%20I%20still%20urge%20you%20to%20create%20a%20virtual%20environment%20inside%20it%20anyway
