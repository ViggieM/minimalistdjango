---
layout: post
title: "Database choice"
date: 2023-05-08
published: false
author: victor
tags:
  - databases
  - docker
  - postgres
  - sqlite
categories:
  - Development setup
---

* Use SQLite for regular projects. You can easily sync it's content and backup (to aws, etc.)
* Use Postgres for projects with **many** users and lots of data. But DO consider SQLite first!
* Only choose another relational DB like MySQL if you have a good reason, because Postgres can cover a lot of use cases (fulltext, json, etc.) and there is a big community building tools and packages around it.

# SQLite

```
DATABASE_URL=sqlite:///path/to/your/database/file.sqlite3
```

# Docker

## Spin up a local postgres database with Docker

Here is how you can set up a postgres database with [Docker](https://docs.docker.com/get-docker/):
```
docker run -d -p 5432:5432 -v $HOME/data:/var/lib/postgresql/data --name postgres_container -e POSTGRES_PASSWORD=password postgres
docker exec -it postgres_container createdb -U postgres project_alpha
```

Then you can specify your database settings for your django app like this:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/project_alpha"
```

## Attach PGAdmin to your local database

An admin interface for your database is incredibly useful for looking up specific data in your databse.
It is easy to spin up another container for PGAdmin and connect to your local database like this:

```
docker run -d -p 80:80 --name pgadmin_container -e PGADMIN_DEFAULT_EMAIL=youremail@example.com -e PGADMIN_DEFAULT_PASSWORD=password -e PGADMIN_LISTEN_PORT=80 --link postgres_container:postgres dpage/pgadmin4
```

PGAdmin is now running on [http://localhost](http://localhost) port 80 and you can configure it as follows:

![pgadmin](/images/pgadmin.png)

# Docker compose

```
version: '3.8'
services:
  db:
    container_name: pg_container
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: test_db
    ports:
      - "5432:5432"
  pgadmin:
    container_name: pgadmin4_container
    image: dpage/pgadmin4
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: root
    ports:
      - "5050:80"
```

Source: https://towardsdatascience.com/how-to-run-postgresql-and-pgadmin-using-docker-3a6a8ae918b5


# More Resources:
* [How To Install and Use Docker on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
