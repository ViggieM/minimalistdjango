---
layout: post
title:  "Dependency Management"
date:   2022-08-08 12:00:00 +0200
published: true
---
# Dependency management

To build your application, you might not want to build everything from scratch.
You can do it, if you want to get a deep understanding of one topic.
But unless you want to spend one year to build your first web application, you should get familiar with dependency management in Python.

## Why you need dependency management

Since you are on a blog about django, you probably want to install "Django", and maybe some third party libraries too.
Libraries change over time.
New features are built, performance improves, security vulnerabilities are fixed.
But these changes might be incompatible with your application or with other third party libraries
Therefore every external dependency your app relies on needs to be pinned to a specific version.
Otherwise simply installing the newest version of your dependency might crash your application.

On the other hand, having multiple applications depend on the same development enviroment leads to avoidable dependency issues.
Updating a package in one application might change the version of another package your other application relies on.
You want to keep your applications as isolated as possible and not let other applications deliberately change your application's dependencies.
So unless you use Docker to develop and deploy your application, you need to keep your application isolated and its deependencies well defined.

## How to isolate your applications dependencies

The way it was done for several years was by using pip, ...
> dependency management artikel auf privaten folder

Poetry takes care of all of this and pins your dependencies, creates a virtual enviroment, and provides an simple cli to manage your project dependencies.

With `poetry init` you can create a new pyproject.toml file inside the current directory, which specifies the projects dependencies.
You can use `poetry add <package-name>` to add a new package to your pyproject.toml.
> and install?

Due to its simplicity it is the reason why poetry is (currently) the best choice for dependency management.

## How to update your applications dependencies
> todo:
Writing unit tests for your application is 
Reading the changelog and release notes of your application
(Yet another reason to [write tests][todo-testing], which gives you a little more security that your aplication still works after an update.)


## TL;DR

> install poetry
```shell
mkdir myproject
cd myproject
poetry init -n --dependency Django
poetry install
poetry shell
django-admin startproject project .
django manage.py runserver
```

[1]: https://realpython.com/dependency-management-python-poetry/
[todo-testing]: <>
