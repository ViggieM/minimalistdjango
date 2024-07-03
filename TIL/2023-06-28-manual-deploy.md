---
title: "Deploy a Django app on a VM (manually)"
date: 2023-07-03
published: true
author: victor
tags:
  - pyenv
  - pip
  - git
  - gunicorn
  - systemd
categories:
  - Running in Production
---

> If you don't know how to do it *without* Ansible, then Ansible won't help you either.

## Transfer your code to the VM

To transfer your code on the VM, you have two options: *a)* you clone it locally and copy it over with scp, or *b)* you clone the Git repository directly inside the VM.

### Copy with `scp`

*Scp* is a fundamental linux command that copies files between hosts on a network. The basic syntax for *scp* is:

```bash
scp -r -P <port> ./* <user>@<host>:/path/to/target/directory
```

This will copy all files and directories recursively (`-r` flag) from your current directory to the remote host (your VM).
**The downside is that your project's directory might include files that are only supposed to be for local usage**, like `.env` files, static files, build output, etc.
Therefore you might want to check out your repository into a separate directory first and then copy the files from there to the remote host.

### Clone from the VCS

You need to install [git](https://github.com/git-guides/install-git) on your VM and get your code from *GitHub* to the remote machine.
If your GitHub repository is **public**, you can access it from the VM without any problems.
But in case your repository is **private**, you have two options:

1. You generate an **ssh private key** on your VM and [add it to the accepted SSH Keys in your GitHub Account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
2. You generate an **access token** in your GitHub Account for the repository

The downside of the first approach is that this key will have access to all of your GitHub repositories.
The second approach requires to go through a bit of documentation, but it is probably the safer method.

#### Generate an access token for a repository

1. Go to [Settings > Personal Access Tokens](https://github.com/settings/tokens){:target="_blank"}
2. Generate a **personal access token (classic)** with repo scope enabled.
  ![Select the checkbox 'repo' to create an access token with 'read' rights]({% static 'images/github-access-token.png' %})


Now you can clone the repository to the remote host like this:

```bash
git clone --branch <branch or tag> --depth 1 https://MY_TOKEN@github.com/user-or-org/repo
```

## Set up the python environment

We set up a python environment with pyenv inside the VM:

```bash
pyenv install 3.11.3
pyenv virtualenv 3.11.3 <name of virtual environment>
pyenv activate <name of virtual environment>
pip install -r requirements.txt
```

This will create a new python environment inside `$PYENV_ROOT/versions/3.11.3/envs/<name of virtual environment>` with your application's requirements.
I would suggest to set the name of the virtual environment to the git commit hash that is being deployed [^deployment-done-right].
You can get the git hash by running `git rev-parse HEAD` inside your repo.

The advantage of this approach is that you always keep a backup of your dependencies, in case that something goes wrong during the deployment, and you can always return to a previous version of your app.
The downside is that you have to reinstall the packages every time, for every deploy.

## Configure and deploy with Systemd

Now inside your app's directory `/srv/my_app/` you will need following files:

```
/srv/<app name>/
├── gunicorn.conf.py
├── run
└── .env
```


If gunicorn is executed from inside the `/srv/<app name>/` directory, it picks up the `gunicorn.conf.py` file.

```python
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
bind = "<ip address>:80"
```

The `run` file is a bash script that executes gunicorn.
If the environment variable `PYTHONPATH` points to your application's directory, you can specify the path to your `wsgi.py` as a python module path.

```bash
#! /bin/bash

export PYTHONPATH="/patho/to/repo/src:$PYTHONPATH"
export VIRTUAL_ENV="/path/to/virtualenv"

exec $VIRTUAL_ENV/bin/gunicorn project.wsgi
```

The `.env` file holds the application's environment variables.

```
SECRET_KEY=...
```

Now we create a `<app name>.service` file inside `/etc/systemd/system/` that uses the ".env" and "run" file to launch the application.
Make sure to change the values accordingly where the exclamation marks are (❗)

```
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
EnvironmentFile=/srv/❗<app name>/.env
WorkingDirectory=/srv/❗<app name>/
ExecStart=/srv/❗<app name>/run
AmbientCapabilities=CAP_NET_BIND_SERVICE
User=❗app_user
Group=❗app_group

[Install]
WantedBy=multi-user.target
```


Now you can execute the following two commands in your shell:

* `sudo systemctl enable <app name>`: This will start your application on boot.
* `sudo systemctl start <app name>`: This will launch your application.

If you have done everything correctly, your application will now be running on port 80 on your VM.
In case you encounter any issues, you can view the logs with `journalctl -u <app name>`.
After fixing any potential errors, you can restart the app with `sudo systemctl restart <app name>`.

[^deployment-done-right]: I got this from this **Django Con talk in 2015** called [*Django Deployments Done Right*](https://www.youtube.com/watch?v=SUczHTa7WmQ)
