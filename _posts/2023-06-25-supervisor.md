---
title: "Manage background processes with Supervisor or Systemd"
date: 2023-06-29
published: true
author: victor
tags:
  - supervisor
  - systemd
  - gunicorn
categories:
  - Running in Production
excerpt: "How to run your Django application as a background process"
---

## Create a bash script that executes your django app

The nice thing aboout a bash script is that you can easily extend it to more than just executing your WSGI application with *Gunicorn*, for example to provide additional environment variables. Besides, it keeps things together in one place and you can execute it without any arguments.

Let's create a `run` file inside our project `src/` directory:

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
{: .terminal-content}

and make it executable with `chmod +x run`.

Now the contents of the file can be reduced to following elements:
* the *shebang* `#!` and the interpreter (`/bin/bash` or `/usr/bin/env bash`)
* some instructions to load environment variables from a file [^envfile]
* the command that executes your WSGI application

```bash
#! /bin/bash

set -a
. .env
set +a

exec $VIRTUAL_ENV/bin/gunicorn project.wsgi
```
{: .file-content}

The nice thing about the usage of the `$VIRTUAL_ENV` environment variable is that **it is automatically set when you activate your virtual environment** [^virtualenv], or you can set it externally with *Supervisor* or *Systemd*.

Another tiny, but important thing to notice, that might be easily overlooked is **the usage of `exec`**. Why not simply call `$VIRTUAL_ENV/bin/gunicorn project.wsgi`? Well, I had to do the mistake miself before I found out why my *Gunicorn* processes were still running after stoping the *Supervisor* service. The reason is that *Supervisor* requires that programs it is configured to run don't daemonize themselves [^exec]. `exec` will replace the current shell with the command, so any instructions after that will never be executed.

Now you can execute `./run` in your shell, with your virtual environment activated, and voilá, you have your *Django* app executed via a bash script.

## Supervisor

The nice thing about *Supervisor* is that it is easy to configure and it provides some nice additional features such as **log rotation** [^logrotate].

To install *Supervisor* you need to execute

```bash
$ sudo apt-get -y install supervisor
$ sudo systemctl enable supervisor
$ sudo systemctl start supervisor
```
{: .terminal-content}

Place your *Django* application under `/srv` [^srv] inside a directory called **`my_app`**.
Create your virtual environment inside the same directory in a directory called **`.venv`**.
Now you can create a new file inside `/etc/supervisor/conf.d/` called `my_app.conf`:

```init
[program:my_app]
directory=/srv/%(program_name)s
command=/srv/%(program_name)s/run
environment=/srv/%(program_name)s/.venv
stderr_logfile=/var/log/supervisor/%(program_name)s_stderr.log
stdout_logfile=/var/log/supervisor/%(program_name)s_stdout.log
```
{: .file-content}

After you saved the file, you can instruct *Supervisor* to reload the configuration:

```bash
$ sudo supervisorctl reread
$ sudo supervisorctl update
```
{: .terminal-content}

Now your app is up and running on the port specified by the *Gunicorn* **bind** address inside the **`gunicorn.conf.py`** file.

> ## 🤫 Tip
> *Supervisor* comes with an HTTP server to monitor your services. You can enable it by specifying the [[inet_http_server]](http://supervisord.org/configuration.html#inet-http-server-section-values) setting inside `/etc/supervisor/supervisord.conf`:
> ```
> [inet_http_server]
> port = 9001
> ```
> and restarting the service with `sudo supervisorctl reload`. It's a nice gimmick, you shouldn't expose it on the internet though.
{: .tip-content}

## Systemd

The downside of *Supervisor* is that there is no way you can bind your application to any **privileged ports < 1024**.
*Systemd* allows you to do that with the `AmbientCapabilities=CAP_NET_BIND_SERVICE` setting.
You can also specify **an environment file** for your application, instead of loading them inside of the `run` script.
Here is how your service configuration file would look like:

```
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
EnvironmentFile=/srv/my_app/.env
WorkingDirectory=/srv/my_app/
ExecStart=/srv/my_app/run
AmbientCapabilities=CAP_NET_BIND_SERVICE
User=victor
Group=victor

[Install]
WantedBy=multi-user.target
```
{: .file-content}

* The `[Unit]` section is used to specify metadata and dependencies. It has a description and an instruction to start after the [network is up](https://www.freedesktop.org/wiki/Software/systemd/NetworkTarget/).
* The `[Service]` section specifies your service configuration. The values are self explanatory and the user is set to me, to demonstrate that *Gunicorn* application can bind to port 80.
* The `[Install]` section tells *Systemd* at which moment during the boot process this service should be started.

Create this file inside `/etc/systemd/system/my_app.service` and create a file `/srv/my_app/.env` to store the `$VIRTUAL_ENV` environment variable [^virtualenv]:

```
VIRTUAL_ENV=/path/to/your/virtualenv
```
{: .file-content}

In the `gunicorn.conf.py` file, change the bind to the address to `127.0.0.1:80`. Start the service with `sudo systemctl start my_app`. To enable it to run on boot, you have to execute `sudo systemctl enable my_app`. Now, if you go to your browser and type in `127.0.0.1`, you will se your *Django* application running on port 80. To see the logs of your service, you can run `journalctl -u my_app`.

The downsides of *Systemd* is that it is a little bit more complicated to configure, and it does not have some convenient features such as automatic log rotation.
On the other hand, it is much more powerful than *Supervisor*, more widespreaded and better maintained. I found [this nice post on *Hacker News*](https://news.ycombinator.com/item?id=18324295) that brags a bit about the many capabilities of *Systemd*, but you should go ahead and make your own opinion which one is best fit for you.


## Further Reading
* [Digitalocean][digitalocean]{:target="_blank"}: Comprehensive tutorial on how to set up a *Django* application with *Gunicorn* and *Nginx*
* [simpleisbetterthancomplex.com][simpleisbetterthancomplex]{:target="_blank"}: Last step of an overall great Django tutorial, that also shows how to configure Gunicorn and Nginx for production deployment
* [Understanding systemd at startup on Linux](https://opensource.com/article/20/5/systemd-startup): More on *Systemd*


[^envfile]: See [this post on *stackoverflow*](https://stackoverflow.com/questions/19331497/set-environment-variables-from-file-of-key-value-pairs) for different alternatives on how to read environment variables from a file. Note that variables with space will not be exported, so you have to put them in quotes.
[^exec]: [How to propagate SIGTERM to a child process in a Bash script](http://veithen.io/2014/11/16/sigterm-propagation.html)
[^logrotate]: By default, *Supervisor* rotates your log files, but you can also configure it to run with [*Logrotate*](https://medium.com/@doodyp/easy-logging-with-logrotate-and-supervisord-16b72b79ded0).
[^srv]: This is the recommended location, according to the [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)
[^virtualenv]: In [this article]({% link _posts/2023-06-14-set-up-a-django-project.md %})  I describe how to generally set up a virtual environment for your *Django* project. It is not the same way as you would do it on a remote host, which will be described in a later post.
[digitalocean]: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04
[simpleisbetterthancomplex]: https://simpleisbetterthancomplex.com/series/2017/10/16/a-complete-beginners-guide-to-django-part-7.html
