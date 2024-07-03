* [create a django project](/articles/create-a-django-project.md)
  - `django-extensions` never miss in my django projects
  - set up Logging
  - create a requirements.txt
* environment variables
  * [Python Project-Local Virtualenv Management Redux](https://hynek.me/articles/python-virtualenv-redux/?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_226)
- dependency management with Poetry
- static files
- [tips and tricks]()
  - simple project structure
  - split installed apps
  - add comments to your settings file
  -
- umbenennen zu lifehacks
- faq: how should I structure my Django project? 

## Supervisor setup

```bash
$ sudo apt-get -y install supervisor
$ sudo systemctl enable supervisor
$ sudo systemctl start supervisor
```

1. Place your *Django* application under `/srv` [^srv] inside a directory called **`my_awesome_project`**.
2. Create your virtual environment inside the same directory in a directory called **`.venv`**.
3. Now you can create a new file inside `/etc/supervisor/conf.d/` called `my_awesome_project.conf`:

```init
[program:my_awesome_project]
directory=/srv/%(program_name)s
command=/srv/%(program_name)s/run
environment=/srv/%(program_name)s/.venv
stderr_logfile=/var/log/supervisor/%(program_name)s_stderr.log
stdout_logfile=/var/log/supervisor/%(program_name)s_stdout.log
```

After you saved the file, you need to tell *Supervisor* to reload the configuration:

```bash
$ sudo supervisorctl reread
$ sudo supervisorctl update
```

[^srv]: This is the recommended location, according to the [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)
