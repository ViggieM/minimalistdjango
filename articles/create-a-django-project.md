# How to create a Django Project

<p align="center">
  <img src="/media/xkcd-startling.png" alt="Startling">
 <br>
  <a href="https://xkcd.com/354/">https://xkcd.com/354/</a>
</p>

Projects such as [django-cookiecutter](https://github.com/cookiecutter/cookiecutter-django) are useful, as long as you are comfortable with every single setting that is generated for you.
I find it particularly useful as a source of inspiration on how to structure your code.
At some point you might want to create your own cookiecutter template, or simply a GitHub repository that you can copy to get you started with a new project.

But using such templates provided by other people are only useful if you know every part of it, or you built it yourself.

Here I want to sum up the most essential steps (in my opinion) when creating a new Django project manually with `django-admin startproject`.

## TL;DR

Following shell commands will:

* create a virtual environment
* create a new Django project
* create a .env file where you can keep your secrets that should not be pushed to git
* create a `.editorconfig` for minimal code formatting
* initialize a git repository
* install pre-commit hooks for automatic code formatting
* generate the initial commit

```bash
PROJECT_NAME=my-awesome-project
cd $PROJECT_NAME
pyenv virtualenv 3.11.6 $PROJECT_NAME
pyenv local $PROJECT_NAME
pip install Django~=4.2
mkdir src
django-admin startproject config src
```

[Configure your project settings](#configure-project-settings) then continue:

```bash
# create .env file
touch src/.env
echo "DJANGO_SECRET_KEY='$(openssl rand -base64 35)'" >> src/.env
echo "DJANGO_DEBUG=1" >> src/.env

# .editorconfig
curl -O https://raw.githubusercontent.com/ViggieM/minimalistdjango/main/snippets/.editorconfig

# git
git init
curl -O https://raw.githubusercontent.com/ViggieM/minimalistdjango/main/snippets/.gitignore
git add -A

# pre-commit hooks
curl -O https://raw.githubusercontent.com/ViggieM/minimalistdjango/main/snippets/.pre-commit-config.yaml
pip install pre-commit
pre-commit autoupdate
pre-commit install
pre-commit run --all-files

git commit -m "Initial commit"
```

## Manual step-by-step guide

### Set up a virtual environment with Pyenv

My recommended way of setting up a Django project is to use [Pyenv](../tools/pyenv.md).
It has the advantage that it is easily recognized by your IDE and allows you to easily navigate the source code of Django and other third party packages.
It also creates a `.python-version` file in your project directory which is used by Pyenv, so every time you enter your project directory, the python environment ist automatically active, which I believe is a great feature.

Here is how you can set up a virtual environment with a specific python version with Pyenv:

```bash
pyenv virtualenv 3.11.6 my-awesome-project
pyenv local my-awesome-project
```

Now you can use pip to install Django and other dependencies for your project.
For more advanced projects, and by advanced I mean you already have a good picture what you would like to build, you might want to take a look at [Poetry]({% tool 'poetry' %}).
It allows you to separate between dev and production dependencies and gives you more flexibility than pip.
When it is not yet clear what the outcome of your project might be, you might want to keep it flexible and move fast.
You can switch to Poetry for dependency management at any point in time later (see optional section).


### Install Django

Now that we have our virtual environment set up, we can set up our Django project.
Let's install the current stable release[^1] of Django:

```bash
pip install Django~=4.2
```

Now you can use the `django-admin` command in your shell to create your new Django project.
But first let's think about the project structure.
A common pattern in project repositories is to have a `src/` folder that contains the project's source code.
On the top level we have the configuration files for the project, such as the python requirements file (or folder), the `.pre-commit-config.yml`, etc.
Inside the `src` folder resides your `manage.py` file and the Django project folders.

I like to have a structure independent of my project.
Therefore, I prefer to set up the project with

```bash
mkdir src
django-admin startproject config src
```

rather than `django-admin startproject <project-name>`.
This has the advantage that it creates the `manage.py` and the `config`[^2] folder directly in the `src/` folder.
This pattern can be used consistently across all your django projects, and has no downside.
You know exactly where to find the project urls and settings files in every project.

<h3 id='configure-project-settings'>Configure your project settings</h3>

This is an important step you should take care of quite early in your project, mostly because we want to put the project as early as possible under version control.

One setting is especially important to keep out of the version control because it can compromise the security of your application, and this is the [`SECRET_KEY`](https://docs.djangoproject.com/en/4.2/ref/settings/#std-setting-SECRET_KEY).
Also, to avoid any mistakes, the presence of the variable in the environment should be required in order to start the application.

```python
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
```

Since we are already at it, we can also take a look at the [`DEBUG`](https://docs.djangoproject.com/en/4.2/ref/settings/#debug) and [`ALLOWED_HOSTS`](https://docs.djangoproject.com/en/4.2/ref/settings/#allowed-hosts) setting.
We need to make sure that the application is not accidentally deployed with `DEBUG=True`, so we set it to False, if the `DJANGO_DEBUG` is not defined in the environment:

```python
DEBUG = int(os.environ.get("DJANGO_DEBUG", default=0))
```

We also want to constrain the origin of the requests our application accepts, so we restrict it to the list `['localhost', '127.0.0.1', '0.0.0.0']` by default, but keep it extendable via the environment variable `DJANGO_ALLOWED_HOSTS`:

```python
ALLOWED_HOSTS = os.environ.get(
    "DJANGO_ALLOWED_HOSTS", default="localhost 127.0.0.1 0.0.0.0"
).split()
```

#### Manage environment variables

Environment variables can be kept inside a `.env` file and be read at project startup with a package like `dotenv`.
Platforms like Heroku or Fly.io allow you to configure your environment variables from a dashboard or via command line on a per-project basis.
And with Docker you can specify them in the `docker-compose.yml`.

For now, the simplest method is to read environment variables from a file.
Create a `.env` file in your project's base directory (alongside `manage.py`) and insert a value for the `DJANGO_SECRET_KEY`:

```bash
touch src/.env
echo "DJANGO_SECRET_KEY='$(openssl rand -base64 35)'" >> src/.env
echo "DJANGO_DEBUG=1" >> src/.env
```

To read the variables from a file, install `dotenv` and read its contents inside your settings file:

```python
from dotenv import load_dotenv

load_dotenv(BASE_DIR / ".env")
```

Now you can access the environment variables as described in the previous section.


### Version control

Version control is one of the most important things to set up early.

```bash
git init
```

It helps a lot to work in incremental changes on your project, that are tracked by git commits, and focus on one thing at a time.
I sometimes disregard this advice myself, but any time I get too deep in the mud, I focus again on making incremental changes.

### `.gitignore`

You will also need to decide on a `.gitignore` at the beginning, to avoid committing certain files or folders to the VCS.
The Python default gitignore is a good starting point.
You can take a look at the django-cookiecutter gitignore for some more inspiration.
I will take my own `.gitignore` from one of my GitHub gists as an example[^3]:

```bash
curl -O https://raw.githubusercontent.com/ViggieM/minimalistdjango/main/snippets/.gitignore
```

Feel free to create your own `.gitignore` or extend existing ones as needed.

#### pre-commit hooks

Pre-commit hooks are executed, as the name says, before a commit is created.
If they fail, the changes are not committed.
This is useful, because you can run code formatters and other tools before you commit your code to VCS.
It helps to keep your project clean.

This step might be marked as optional, but I believe that having consistent code formatting is very important, and not having to consciously think about it while coding is a big relief.

To install pre-commit hooks you need to install `pre-commit` first:

```bash
pip install pre-commit
```

Next, you need a `.pre-commit-config.yaml` in your project's root directory.
Here is a minimal example:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        name: isort (python)
        args: [ "--profile", "black", "--filter-files" ]
        exclude: ^.*\b(migrations)\b.*$
  - repo: https://github.com/psf/black
    rev: 24.3.0
    hooks:
      - id: black
        exclude: ^.*\b(migrations)\b.*$
```

It does following things:

- trims whitespace at the end of each line
- ensures every file ends with a new line
- checks yaml file syntax
- makes sure that files above a certain size (500 kB by default) can not be committed by accident
- sorts imports with "isort"
- formats code consistently with "black"

You can check further options in the [GitHub repository](https://github.com/pre-commit/pre-commit-hooks).
The versions specified by "rev" might get outdated and incompatible with time but this is easy to fix automatically with

```bash
pre-commit autoupdate
```

Next thing you have to install and execute the pre-commit hooks.

```bash
pre-commit install
pre-commit run --all-files
```

And now we can make our first commit:

```bash
git add -A
git commit -m "Initial commit"
```

### EditorConfig

EditorConfig is another simple method to maintain consistent code formatting and is supported by various editors and IDEs.
It does not cost anything to set up, and it is a great addition to the pre-commit hooks.
[Here](/snippets/.editorconfig) is a minimal example of an `.editorconfig` file. 

I personally like to have my html and Javascript files indented by two spaces.

You can check [http://editorconfig.org](http://editorconfig.org) for more information.

## Further Reading

* [20 Django Packages That I Use in Every Project](https://learndjango.com/tutorials/20-django-packages-i-use-every-project?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_219)


[^1]: If you wish the latest version of Django in order to use the latest features, you can omit the `^=4.2`.
  Visit [https://www.djangoproject.com/download/](https://www.djangoproject.com/download/) to see available versions and how long they will be supported.
[^2]: I used to use the "project name" `project` before, but `config` feels slightly better right now. It's just a matter of taste.
[^3]: It is heavily inspired by the django-cookiecutter `.gitignore`, because it includes some PyCharm settings in the commits that are very useful for project setup.
