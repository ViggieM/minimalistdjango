# Postgres

Postgres is just an amazing database, and it has a lot of features, such as fulltext search, which is well [integrated with Django](https://docs.djangoproject.com/en/dev/ref/contrib/postgres/search/).
There are also amazing django packages that are built around Postgres features such as "LISTEN/NOTIFY",
that allow you to dispatch events from the database to the application, and can replace the need for a message broker like RabbitMQ or Redis. [^listennotify]
Platforms like [Supabase](https://supabase.com/) and [Crunchy Data](https://www.crunchydata.com/) are built around Postgres and provide a lot of additional features and services, and almost every PaaS provider has a Postgres offering.

### Pros

* [Full text search](https://docs.djangoproject.com/en/dev/ref/contrib/postgres/search/)
* "LISTEN/NOTIFY"

### Cons

* Setup, maintenance and backup is more complicated, compared to [SQLite](/tools/sqlite.md)

## Cheatsheet

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


## References

* [Playing with Postgres NOTIFY/LISTEN using Python asyncio and psycopg2 | The-Fonz blog](https://the-fonz.gitlab.io/posts/postgres-notify/)
* [DjangoCon Europe 2023 | Tuning PostgreSQL to work even better - YouTube](https://www.youtube.com/watch?v=7CnqVoMxoeo)
  * [Postgres Tips | Crunchy Data](https://www.crunchydata.com/postgres-tips)
* [Postgres Views in Django](https://pganalyze.com/blog/postgresql-views-django-python)
* [Using database triggers to reliably track model history with Wes Kendall - YouTube](https://www.youtube.com/watch?v=LFIAqFt9z2s)

[^listennotify]: Here is an example of a package that uses this feature, and can replace the need of a package like Celery: [PaulGilmartin/django-pgpubsub: A distributed task processing framework for Django built on top of the Postgres NOTIFY/LISTEN protocol.](https://github.com/PaulGilmartin/django-pgpubsub)
