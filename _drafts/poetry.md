What I like to do to start a django project from scratch is:
```shell
mkdir myproject
cd myproject
poetry init -n --dependency Django --dependency django-extensions
django-admin startproject project
mv project src
```
This way you get already a fine structure to push to your version control system.

[1]: https://realpython.com/dependency-management-python-poetry/
