---
layout: post
title: "Debugging with VSCode"
date: 2023-09-11
published: true
author: victor
tags:
  - VSCode
  - debugging
categories:
  - Know your tools
excerpt: "How to debug a python application in VSCode"
---

The advantage of using **debugpy** and VSCode is the simplicity.
Whether you have your application locally or inside a Docker container, as long as you can reach the port exposed
by debugy, you can connect to it with VSCode.
I love PyCharm, but I have to admit that VSCode is simpler and more flexible in this regard.

## Install debugpy

To debug with VSCode, you need to add debugpy to your dev requirements with poetry:

```bash
poetry add -G dev debugpy
```

and start your django development server with:

```bash
python -m debugpy --listen 0.0.0.0:5678 src/manage.py runserver
```

## Configure VSCode

You can create a preconfigured "launch.json" file inside the `.vscode` directory, or press `F1` or `Ctrl + Shift + P` to open the command pallette and search for **"Debug: Add Configuration..."**. Here is how it would look like:

```json
{
    "configurations": [
        {
            "name": "Python: Remote Attach",
            "type": "python",
            "request": "attach",
            "host": "0.0.0.0",
            "port": 6793,
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}/src/",
                    "remoteRoot": "/web/app/src/"
                }
            ],
            "justMyCode": false,
            "django": true
        }
    ]
}
```

Some important parameters are:
* **justMyCode**: Set this to **false**, to also be able to debug code inside third party libraries
* **django**: This allows you to also debug templates, see [VSCode django tutorial](https://code.visualstudio.com/docs/python/tutorial-django)
* **pathMappings**: This maps the files from your VSCode **workspaceFolder** to the locations of the files on the remote host. In this case, for example, the source code was mounted with a volume under `/web/app`. This setting can also be used for [remote debugging](https://code.visualstudio.com/docs/python/debugging#_remote-script-debugging-with-ssh) on any remote server that has debugpy running on some port.
