---
title: "Postgres"
tags:
  - postgres
  - databases
categories:
  - Databases
---

Postgres is just an amazing database, and it has a lot of features, such as fulltext search, which is well [integrated with Django](https://docs.djangoproject.com/en/dev/ref/contrib/postgres/search/).
There are also amazing django packages that are built around Postgres features such as "LISTEN/NOTIFY",
that allow you to dispatch events from the database to the application, and can replace the need for a message broker like RabbitMQ or Redis. [^listennotify]
Platforms like [Supabase](https://supabase.com/) and [Crunchy Data](https://www.crunchydata.com/) are built around Postgres and provide a lot of additional features and services, and almost every PaaS provider has a Postgres offering.

Having said that, it is also a good idea to use SQLite for regular projects, because it is easy to sync its content and backup (to aws, etc.).

## Getting started with Postgres in Django

The easiest way to get started with Postgres is to spin up a local database with [Docker](https://docs.docker.com/get-docker/):

```shell
docker run -d -p 5432:5432 \
  -v $HOME/data:/var/lib/postgresql/data \
  --name postgres_container \
  -e POSTGRES_PASSWORD=password \
  postgres
```

This command pulls the latest docker image of postgres and runs it in a container.

* `--name postgres_container` sets the name of the container to `postgres_container` to make it easier to reference it later.
* `-v $HOME/data:/var/lib/postgresql/data` mounts the directory `$HOME/data` inside the container, so data can be persisted during container recreations.
* `-e POSTGRES_PASSWORD=password` flag is used to set the password of the postgres root user to "password". The name of the root user is "postgres", but can also be changed with the environment variable `POSTGRES_USER`.

### Create a database

Postgres, like other databases, comes with psql, a command line tool to interact with the database.
You can use it to create a database like this:

```shell
docker exec -it postgres_container psql -U postgres
```

This command opens a psql shell inside the container and connects to the database with the user `postgres`.
Then you can create a database like this:

```sql
CREATE DATABASE my_awesome_project;
```

There is also a command line tool called `createdb` that does the same thing:

```shell
docker exec -it postgres_container createdb -U postgres my_awesome_project
```

### Connect to your database in your django app

In order to connect to your database in django, you need to install the [psycopg2](https://pypi.org/project/psycopg2/) package, which is a PostgreSQL adapter for Python.
In your django app you can then specify your database settings like this:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "my_awesome_project",
        "USER": "postgres",
        "PASSWORD": "password",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
```

Or you can use the [dj-database-url](https://pypi.org/project/dj-database-url/) package to configure your `DATABASES` setting with the `DATABASE_URL` environment variable like this:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/my_awesome_project"
```

This is a very common pattern inspired from [12 factor apps](https://12factor.net/), which is to store the configuration in environment variables.
This pattern is also present in SASS platforms such as Heroku, Fly.io, etc.

## Docker compose

Here is a configuration example for docker compose, if you wish to integrate it in your development environment:

```yml
version: '3.8'
services:
  db:
    container_name: postgres_container
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: my_awesome_project
    ports:
      - "5432:5432"
```

## PGAdmin

Sometimes it is really helpful to do stuff in the database, without the command line, such as looking at the raw data, removing columns, etc.
PGAdmin gives you a graphical UI to your Postgres Database, and you can easily integrate it inside your Docker Compose:

```
version: '3.8'
services:
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

Then you can configure your connection to the Database like in the image:

![pgadmin](../images/pgadmin.png)

## References

* [Playing with Postgres NOTIFY/LISTEN using Python asyncio and psycopg2 | The-Fonz blog](https://the-fonz.gitlab.io/posts/postgres-notify/)


[^listennotify]: Here is an example of a package that uses this feature, and can replace the need of a package like Celery: [PaulGilmartin/django-pgpubsub: A distributed task processing framework for Django built on top of the Postgres NOTIFY/LISTEN protocol.](https://github.com/PaulGilmartin/django-pgpubsub)
