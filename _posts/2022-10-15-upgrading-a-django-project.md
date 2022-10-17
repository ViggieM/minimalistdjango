---
layout: post
title:  "Upgrading a Django Project to a new major version"
date:   2022-10-15
published: true
---

* make sure that your project is still running on the old version, or set up the project
* execute the `check`, `runserver` and `test` command with activated warning messages, i.e. `python -Wa manage.py check`.
  this gives you hints what parts of your code or your dependencies will be deprecated, and you can update those, before you upgrade Django.
  * check the release notes for the libraries you upgrade too
* read the Django release notes and search your code for occurences of deprecated libraries, methods, attributes, etc. Fix that first before you upgrade.
* upgrade Django
* run again the `check`, `runserver` and `test` commands to make sure that your code is still running

Caveats:
* change use zoneinfo.ZoneInfo("UTC") instead of pyty.UTC, see https://github.com/mozilla/ichnaea/issues/1440
* DetailView.delete() method has been removed

Optional:
* Install and run `django-upgrade`. This does not change any critical stuff, but it makes your code a bit cleaner
  ```
  python -m pip install django-upgrade
  git ls-files -- '*.py' | xargs django-upgrade --target-version 4.1
  ```
