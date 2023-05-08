---
layout: post
title: "Database choice"
date: 2023-05-09
published: true
author: victor
tags:
  - databases
  - docker
  - postgres
  - sqlite
categories:
  - Development setup
---

* Use SQLite for small projects. You can easily sync it's content and backup (to aws, etc.)
* Use Postgres for projects with many users and lots of data
* Choose another database only if you have very good reasons
<!--why is it good to run sqlite over postgres in a django project?-->

# SQLite

```
DATABASE_URL=sqlite:///path/to/your/database/file.sqlite3
```

# Docker

Here is how you can set up a postgres database with [Docker](https://docs.docker.com/get-docker/):
```
docker run -d -p 5432:5432 -v $HOME/data:/var/lib/postgresql/data --name postgres_container -e POSTGRES_PASSWORD=password postgres
docker run -d -p 80:80 --name pgadmin_container -e PGADMIN_DEFAULT_EMAIL=youremail@example.com -e PGADMIN_DEFAULT_PASSWORD=password -e PGADMIN_LISTEN_PORT=80 --link postgres_container:postgres dpage/pgadmin4
docker exec -it postgres_container createdb -U postgres project_alpha
```

Configure the postgres server inside your pgadmin running on [http://localhost](http://localhost):

![pgadmin](/images/pgadmin.png)

and change your django settings like this:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/project_alpha"
```

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

<!--
Running SQLite over PostgreSQL in a Django project can have certain advantages in specific scenarios, but it ultimately depends on the requirements and constraints of your project. Here are some reasons why one might choose SQLite over PostgreSQL in certain cases:

1. Simplicity and Lightweight: SQLite is a file-based database system, meaning it doesn't require a separate database server process like PostgreSQL. This simplicity makes it easy to set up and use, especially for small projects or development environments. It is also lightweight and has minimal resource requirements.

2. Development Convenience: SQLite is the default database backend in Django, so it requires minimal configuration to get started. It allows developers to quickly iterate and prototype their applications without the need for complex database setup.

3. Portability: Since SQLite is a single file-based database, it can be easily moved and shared across different environments. This can be useful in cases where you need to distribute your Django project with its database bundled together or when you want to seamlessly switch between development machines.

4. Testing: SQLite is often used for running tests in Django due to its speed and convenience. It allows for fast test execution and can easily recreate the database state for each test case, leading to efficient and isolated testing.

Despite these advantages, it's important to consider the limitations of SQLite compared to PostgreSQL:

1. Scalability: SQLite may not be suitable for high-traffic or large-scale applications due to its limited concurrency and write-locking mechanisms. PostgreSQL is designed to handle complex and heavy workloads, providing better scalability and performance optimizations.

2. Advanced Features: PostgreSQL offers a wide range of advanced features, such as support for advanced SQL queries, JSONB data type, full-text search capabilities, and various indexing options. If your project requires advanced database functionality, PostgreSQL may be a better choice.

3. Production Environment Considerations: In a production environment, where data integrity, reliability, and security are critical, PostgreSQL provides more robust features, transactional support, and better data consistency guarantees compared to SQLite.

In summary, running SQLite over PostgreSQL in a Django project can be beneficial for small-scale projects, development environments, prototyping, and testing purposes. However, for larger and more demanding applications with higher concurrency, scalability, and advanced database requirements, PostgreSQL is generally recommended.
-->