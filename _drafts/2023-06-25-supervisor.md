---
layout: post
title: "Manage background processes with Supervisor or Systemd"
date: 2023-06-25
published: true
author: victor
tags:
  - supervisor
  - systemd
  - basics
categories:
  - Production deployment
---

In the previous post we explored how to serve your *Django* application through a WSGI server such as *Gunicorn*.
Now we will learn how to run this as a backgroud process.

## Create a bash script that executes your django app

The nice thing aboout a bash script is that you can easily extend it to more than just executing your WSGI application with Gunicorn, for example to provide additional environment variables. Besides, it keep things together in one place and you can execute it without any arguments.

Let's create a `run` file inside our project `src/` directory:

```
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
{:style="border: 1px solid black; line-height: 1.1"}

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

The nice thing about the usage of the `$VIRTUAL_ENV` environment variable is that **it is automatically set when you activate your virtual environment**, or you can set it externally with *Supervisor* or *Systemd*.

Another tiny, but important thing to notice, that might be easily overlooked is **the usage of `exec`**. Why not simply call `$VIRTUAL_ENV/bin/gunicorn project.wsgi`? Well, I had to do the mistake miself before I found out why my *Gunicorn* processes were still running after stoping the *Supervisor* service. The reason is that *Supervisor* requires that programs it is configured to run don't daemonize themselves [^exec]. `exec` will replace the current shell with the command, so any instructions after that will never be executed.

Now you can execute `./run` in your shell, with your virtual environment activated, and voilá, you have your *Django* app executed via a bash script.

## Supervisor

The nice thing about *Supervisor* is that it is easy to configure, and it provides some nice additional features such as **log rotation** [^logrotate].

To install *Supervisor* you need to execute

```bash
sudo apt-get -y install supervisor
sudo systemctl enable supervisor
sudo systemctl start supervisor
```

Now you can create a new file inside `/etc/supervisor/conf.d/` called `my_app.conf`:

```init
[program:my_app]
directory=/srv/%(program_name)s
command=/srv/%(program_name)s/run
stderr_logfile=/var/log/supervisor/%(program_name)s_stderr.log
stdout_logfile=/var/log/supervisor/%(program_name)s_stdout.log
```
{:class="file-content"}

After you saved the file, you can instruct *Supervisor* to reload the configuration:

```bash
sudo supervisorctl reread
sudo supervisorctl update
```

Now your app is up and running on the port specified by the *Gunicorn* **bind** address.

> ## 🤫 Tip
> *Supervisor* comes with an HTTP server to monitor your services. You can enable it by specifying the [[inet_http_server]](http://supervisord.org/configuration.html#inet-http-server-section-values) setting inside `/etc/supervisor/supervisord.conf`:
> ```
> [inet_http_server]
> port = 9001
> ```
> and restarting the service with `sudo supervisorctl reload`.

## Systemd


[^envfile]: See [this post on *stackoverflow*](https://stackoverflow.com/questions/19331497/set-environment-variables-from-file-of-key-value-pairs) for different alternatives on how to read environment variables from a file. Note that variables with space will not be exported, so you have to put them in quotes.
[^exec]: [How to propagate SIGTERM to a child process in a Bash script](http://veithen.io/2014/11/16/sigterm-propagation.html)
[^logrotate]: By default, *Supervisor* rotates your log files, but you can also configure it to run with [*Logrotate*](https://medium.com/@doodyp/easy-logging-with-logrotate-and-supervisord-16b72b79ded0).