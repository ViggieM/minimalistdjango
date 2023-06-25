---
layout: page
title:  "Deploy your app to a VM"
date:   2023-06-14 12:00:00 +0200
published: false
# image: 
#   path: /images/DjangoRocket.gif
#   thumbnail: /images/DjangoRocket.gif
---

* install new packages in /opt
* run your application in /srv
  * /srv/app
  * /srv/app/db.sqlite3
* systemd service for gunicorn, gunicorn.conf.py
* https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04
* https://unix.stackexchange.com/questions/487005/is-the-www-data-user-pre-configured-in-linux-and-unix-systems
  * general principle of configuration management — describe the situation you want the system to be in, not the steps to get there.
* supervisor: https://ege.dev/posts/systemd-vs-supervisor/
