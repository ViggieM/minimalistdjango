# Databases

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


## References

* [JSON Schema validation for columns - Database Tip](https://sqlfordevs.com/json-schema-validation)
* [Fill Tables With Large Amounts Of Test Data - Database Tip](https://sqlfordevs.com/fill-table-test-data?ref=Newsletter)
