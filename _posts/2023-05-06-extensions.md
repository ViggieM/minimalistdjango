---
layout: post
title: "3rd party packages"
date: 2023-05-06
published: true
author: victor
categories:
  - Development setup
---

* [Django Extensions](https://github.com/django-extensions/django-extensions): `shell_plus` is an incredibly useful enhancement of your django shell
* [bpython](https://github.com/bpython/bpython): pretty enhancement of your python shell, with code suggestions and a more colorful prompt
* [pre-commit hooks](https://pre-commit.com/): don't waste time on formatting your code manually. Format it automatically before every commit!

These are in my opinion the 3 things every django project should have. You can install them in your virtual environment with:
```
poetry add django-extenstions
poetry add bpython
poetry add with -dev pre-commit
pre-commit install
```

Here is a good starting point for your pre-commit file (called `.pre-commit-config.yaml`):
<script src="https://gist.github.com/movileanuv/d70e4c00d61acc51646e23423a4c797b.js"></script>

# More Resources to choose from
* [Django Packages](https://djangopackages.org/)
* [Top 10 Django Third-Party Packages](https://learndjango.com/tutorials/essential-django-3rd-party-packages)
* Django Forum: [Top 5 3rd party packages][django-forum-dicussion]

[django-forum-dicussion]: https://forum.djangoproject.com/t/top-5-3rd-party-packages/391/17
