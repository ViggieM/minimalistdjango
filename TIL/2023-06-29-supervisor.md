---
title: "Manage background processes with Systemd"
date: 2023-06-29
author: victor
tags:
  - systemd
  - gunicorn
categories:
  - Running in Production
---


## Enclose the django application inside a "run" script

The purpose of creating a single executable file, is to keep all instructions for starting the application in one place.
The contents of the file can be reduced to following elements:

* the *shebang* `#!` and the interpreter (`/bin/bash` or `/usr/bin/env bash`)
* some instructions to load environment variables from a file
* the command that executes the WSGI application

Let's create a file called "run" inside our project `src/` directory:

```bash
$ tree -L 1
.
├── gunicorn.conf.py
├── manage.py
├── project
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── run                 <--- create here
```

and make it executable with

```bash
chmod +x run
```

Here is how the contents of the "run" file can look like:

```bash
#! /bin/bash

set -a
source .env
set +a

exec $VIRTUAL_ENV/bin/gunicorn project.wsgi
```

Explanation:

* `set -a`, `source .env`, `set +a` allows to read the environment variables from a .env file (see [StackOverflow](https://stackoverflow.com/a/45971167/5540654))
* The `$VIRTUAL_ENV` environment variable points to the folder where your python dependencies are installed
* `exec` is required, so the program does not daemonize itself. This implies that `exec` will replace the current shell with the command, so any instructions after that line will never be executed. Read [this post][How to propagate SIGTERM to a child process in a Bash script] for more information.

Now you can execute `./run` in your shell, with your virtual environment activated, and voilá, you have your *Django* application is started via a bash script.


## Execute the application as a background process

### Configure Systemd to run a web application

*Systemd* allows you to bind to ports smaller than 1024 with the `AmbientCapabilities=CAP_NET_BIND_SERVICE` setting.
You can also specify **an environment file** for your application, instead of loading them inside the `run` script.
Here is how a simple service configuration file would look like:

```
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
EnvironmentFile=/srv/my_awesome_project/.env
WorkingDirectory=/srv/my_awesome_project/
ExecStart=/srv/my_awesome_project/run
AmbientCapabilities=CAP_NET_BIND_SERVICE
User=victor
Group=victor

[Install]
WantedBy=multi-user.target
```

Explanation:

* The `[Unit]` section is used to specify metadata and dependencies. It has a description and an instruction to start after the [network is up](yhttps://www.freedesktop.org/wiki/Software/systemd/NetworkTarget/).
* The `[Service]` section specifies your service configuration. The values are self-explanatory and the user is set to me, to demonstrate that *Gunicorn* application can bind to port 80.
* The `[Install]` section tells *Systemd* at which moment during the boot process this service should be started.
* `/srv` is the recommended location, according to the [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)

Create this file inside `/etc/systemd/system/my_awesome_project.service` and create a file `/srv/my_awesome_project/.env` that specifies at least the `$VIRTUAL_ENV` environment variable:

```
VIRTUAL_ENV=/path/to/your/virtualenv
```

In the `gunicorn.conf.py` file, change the bind to the address to `127.0.0.1:80`.
Start the service with `sudo systemctl start my_awesome_project`.
To enable it to run on boot, you have to execute `sudo systemctl enable my_awesome_project`.
Now, if you go to your browser and type in `127.0.0.1`, you will se your *Django* application running on port 80.
To see the logs of your service, you can run `journalctl -u my_awesome_project`.

### Supervisor vs. Systemd

The nice thing about *Supervisor* is that it is easy to configure, and it provides some nice additional features such as **log rotation** and an [HTTP Server](http://supervisord.org/configuration.html#inet-http-server-section-values) to monitor your services.
The downside of *Supervisor* is that there is no way you can bind your application to any **privileged ports < 1024**, which is why I don't see any good reason to use *Supervisor* for simple web applications.
Otherwise, you would have to configure a nginx server to proxy the incoming traffic on port 80 or 443 to your application.

*Systemd* allows you to bind to ports smaller than 1024 with the `AmbientCapabilities=CAP_NET_BIND_SERVICE` setting.
You can also specify **an environment file** for your application, instead of loading them inside the `run` script.

Overall, the configuration of *Systemd* is less intuitive than *Supervisor*, but it comes preinstalled on almost every linux distro, and is well maintained and super battle tested.
I guess it's worth the time understanding *Systemd* a little bit better, even though it is a [boring technology][boring technology].

## Further Reading

* [Digitalocean][digitalocean]{:target="_blank"}: Comprehensive tutorial on how to set up a *Django* application with *Gunicorn* and *Nginx*
* [simpleisbetterthancomplex.com][simpleisbetterthancomplex]{:target="_blank"}: Last step of an overall great Django tutorial, that also shows how to configure Gunicorn and Nginx for production deployment
* [Understanding systemd at startup on Linux](https://opensource.com/article/20/5/systemd-startup): More on *Systemd*
* [this is a nice post on *Hacker News*](https://news.ycombinator.com/item?id=18324295) that brags a bit about the many capabilities of *Systemd*


[digitalocean]: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04
[simpleisbetterthancomplex]: https://simpleisbetterthancomplex.com/series/2017/10/16/a-complete-beginners-guide-to-django-part-7.html
[How to propagate SIGTERM to a child process in a Bash script]: http://veithen.io/2014/11/16/sigterm-propagation.html
[boring technology]: https://mcfunley.com/choose-boring-technology
