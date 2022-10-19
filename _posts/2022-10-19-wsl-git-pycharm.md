---
layout: post
title:  "Troubles with line breaks on WSL"
date:   2022-10-19
published: true
---

When your source code lies in a WSL* directory but your code editor (e.g. Pycharm) runs on Windows, you might run into a problem worded something like: "unrecognized character \r\n".
This is a trouble caused by files that were created or opened in your code editor.
You can fix this by running: `git config --global core.autocrlf input`

\* WSL = Windows-Subsystem for Linux
