---
layout: post
title:  "Dependency Management"
date:   2022-09-08 16:47:00 +0200
published: true
---

## Why you need dependency management

Since you are on a blog about Django, you probably want to install "Django", and maybe some third party libraries too.
Libraries change over time.
New features are built, performance improves, security vulnerabilities are fixed.
But these changes might be incompatible with your application or with other third party libraries.
Therefore every external dependency that your app relies on needs to be pinned to a specific version.
Otherwise, simply installing the newest version of your dependency, might crash your application.

On the other hand, having multiple applications that are running in the same development enviroment leads to avoidable dependency issues.
Updating a package in one application might change the version of another package, that your other application relies on.
You want to keep your applications as isolated as possible.
So unless you use Docker to develop and deploy your application, you need to keep your application isolated and pin its deependencies (even though there is [a case][venv-in-docker]{:target="_blank"} for it too).

## How to manage your applications dependencies

The default tools for installing third party libraries and isolating your dependencies are "pip" and "venv" respectively.
[This article][2]{:target="_blank"} describes some general guidelines for working with these tools, like:
* pin your dependencies in a requirements file
* create a `requirements/` directory to separate development, test and production requirements
* specify a hash for each of your dependencies

Poetry takes care of all of this and pins your dependencies, creates a virtual enviroment, and provides an simple cli to manage your project dependencies.

With `poetry init` you can create a new pyproject.toml file inside the current directory, which specifies the projects dependencies.
You can use `poetry add <package-name>` to add a new package to your pyproject.toml and immediatly install it.

## How to update your applications dependencies
Updating dependencies is not an easy task since this might break your currently running code.
You should do this regularly and maybe even profit from tools like github's **Dependabot** to make sure your packages are up to date.
This way you can avoid the error prone task of bulk updating your dependencies and always profit from the latest security fixes.

Minor updates should not introduce any breaking changes and can therefore be executed without concern.
Major updates require you to read the changelog and release notes of the new package version since api changes might be involved.
Your application needs to be tested, either manually or automatically, after each major update.
So make sure to write tests for all essential parts of your code in case you want your application to live for a long time.


## TL;DR

1. [Install poetry][install-poetry]{:target="_blank"}
2. Create or `cd` into your project's directory
3. Set up *poetry* for your project
    ```shell
    poetry init -n  # the '-n' avoids unnecessary questions
    poetry add Django  #  installs the latest Django version
    ```
4. Start a new Django project
    ```shell
    poetry shell  # use `exit` to leave this shell
    django-admin startproject project .
    python manage.py runserver
    ```


[1]: https://realpython.com/dependency-management-python-poetry/
[2]: https://www.b-list.org/weblog/2022/may/13/boring-python-dependencies/
[install-poetry]: https://python-poetry.org/docs/#installation
[venv-in-docker]: https://www.b-list.org/weblog/2022/may/13/boring-python-dependencies/#:~:text=And%20even%20if%20you%E2%80%99re%20deploying%20in%20a%20container%20which%20you%20know%20has%20only%20one%20Python%20interpreter%20in%20it%2C%20I%20still%20urge%20you%20to%20create%20a%20virtual%20environment%20inside%20it%20anyway
