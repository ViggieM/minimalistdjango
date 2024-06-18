# Supervisor

> Supervisor is a client/server system that allows its users to monitor and control a number of processes on UNIX-like operating systems.
> -- <cite><a target="blank" href="http://supervisord.org/">Supervisor: A Process Control System — Supervisor 4.2.5 documentation</a></cite>

### Pros

* HTTP server to monitor your services. It can be enabled by specifying the [[inet_http_server]](http://supervisord.org/configuration.html#inet-http-server-section-values) setting inside `/etc/supervisor/supervisord.conf`.
  It shouldn't be exposed on the internet though.
* Easy to set up log rotation. It can also be configured with [*Logrotate*](https://medium.com/@doodyp/easy-logging-with-logrotate-and-supervisord-16b72b79ded0).

### Cons

* needs additional installation, in contrast to Systemd, that comes pre-installed on most linux distributions
* can not bind to privileged ports, smaller than 1024


## Setup

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
