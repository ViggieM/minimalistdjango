---
title: Systemd
---
# Systemd

## Pros

- highly customizable
- ability to bind to ports smaller than 1024 with the `AmbientCapabilities=CAP_NET_BIND_SERVICE` setting
- [boring technology](https://mcfunley.com/choose-boring-technology)

## Cons

- less intuitive configuration than [Supervisor](/tools/supervisor.md)

## Cheatsheet

```bash
# start your application on boot
sudo systemctl enable ${appName}
# start your application
sudo systemctl start ${appName}
# restart application
sudo systemctl restart ${appName}
# view application logs
journalctl -u ${appName}
```

### A simple Systemd service file for a Django application

Create a `${appName}.service` file inside `/etc/systemd/system/` that uses the ".env" and "run" file to launch the application:

```
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
EnvironmentFile=/srv/${appName}/.env
WorkingDirectory=/srv/${appName}/
ExecStart=/srv/${appName}/run
AmbientCapabilities=CAP_NET_BIND_SERVICE
User=${appUser}
Group=${appGroup}

[Install]
WantedBy=multi-user.target
```

* The `[Unit]` section is used to specify metadata and dependencies. It has a description and an instruction to start after the [network is up](yhttps://www.freedesktop.org/wiki/Software/systemd/NetworkTarget/).
* The `[Service]` section specifies your service configuration.
  * `/srv` is the recommended location, according to the [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)
  * The `run` file is a bash script that executes gunicorn
  * AmbientCapabilities allows you to use ports below 1024
* The `[Install]` section tells *Systemd* at which moment during the boot process this service should be started.

I like the idea of creating a single executable file to keep all instructions for starting the application in one place.
Here is an example:

```bash
#! /bin/bash

set -a
source .env
set +a

export PYTHONPATH="/patho/to/repo/src:$PYTHONPATH"
export VIRTUAL_ENV="/path/to/virtualenv"

exec $VIRTUAL_ENV/bin/gunicorn project.wsgi
```

* `set -a`, `source .env`, `set +a` allows to read the environment variables from a .env file (see [StackOverflow](https://stackoverflow.com/a/45971167/5540654))
* By specifying the environment variable `PYTHONPATH` to point to the application's directory, you can specify the path to your `wsgi.py` as a python module path.
* The `$VIRTUAL_ENV` environment variable points to the folder where your python dependencies are installed
* `exec` is required, so the program does not daemonize itself. This implies that `exec` will replace the current shell with the command, so any instructions after that line will never be executed. Read [this post](http://veithen.io/2014/11/16/sigterm-propagation.html) for more information.

The `run` file needs to be marked as executable with:

```bash
chmod +x run
```

## References

- [Understanding systemd at startup on Linux](https://opensource.com/article/20/5/systemd-startup)
