# Postgres

### Pros

* [Full text search](https://docs.djangoproject.com/en/dev/ref/contrib/postgres/search/)
* "LISTEN/NOTIFY"

### Cons

<!--
Postgres is just an amazing database, and it has a lot of features, such as fulltext search, which is well [integrated with Django](https://docs.djangoproject.com/en/dev/ref/contrib/postgres/search/).
There are also amazing django packages that are built around Postgres features such as "LISTEN/NOTIFY",
that allow you to dispatch events from the database to the application, and can replace the need for a message broker like RabbitMQ or Redis. [^listennotify]
Platforms like [Supabase](https://supabase.com/) and [Crunchy Data](https://www.crunchydata.com/) are built around Postgres and provide a lot of additional features and services, and almost every PaaS provider has a Postgres offering.

Having said that, it is also a good idea to use SQLite for regular projects, because it is easy to sync its content and backup (to aws, etc.).
-->


## References

* [Playing with Postgres NOTIFY/LISTEN using Python asyncio and psycopg2 | The-Fonz blog](https://the-fonz.gitlab.io/posts/postgres-notify/)
* [DjangoCon Europe 2023 | Tuning PostgreSQL to work even better - YouTube](https://www.youtube.com/watch?v=7CnqVoMxoeo)
  * [Postgres Tips | Crunchy Data](https://www.crunchydata.com/postgres-tips)
* [Postgres Views in Django](https://pganalyze.com/blog/postgresql-views-django-python)
* [Using database triggers to reliably track model history with Wes Kendall - YouTube](https://www.youtube.com/watch?v=LFIAqFt9z2s)

[^listennotify]: Here is an example of a package that uses this feature, and can replace the need of a package like Celery: [PaulGilmartin/django-pgpubsub: A distributed task processing framework for Django built on top of the Postgres NOTIFY/LISTEN protocol.](https://github.com/PaulGilmartin/django-pgpubsub)
