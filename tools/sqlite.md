# SQLite

> SQLite is a database engine written in the C programming language.
> It is not a standalone app; rather, it is a library that software developers embed in their apps.
> As such, it belongs to the family of embedded databases.
> It is the most widely deployed database engine, as it is used by several of the top web browsers, operating systems, mobile phones, and other embedded systems.
> <br>
> -- [SQLite - Wikipedia](https://en.wikipedia.org/wiki/SQLite)

## Pros

- no need to configure extra host
- no performance loss because of network latency
- no N + 1 Query problems
- fast reads
- supports a significant amount of concurrent writes per second
- easy to back up and restore

## Cons

- not suitable for more workload heavy applications where writing occurs a lot

## Cheatsheet

### Settings on database initialization

```bash
sqlite3 db.sqlite3 'PRAGMA journal_mode=wal; PRAGMA busy_timeout = 5000;'
```

#### Journal mode (WAL)

The journal mode determines how changes are written to the database.
By default, SQLite blocks readers while writing changes to the database.
This behaviour can be changed, by setting the journal mode to WAL (Write Ahead Log).
Changes will be written to a separate WAL file, before being commited to the main database file,
which does not block readers while another process is writing.

#### Timeout

SQLite allows only one writer to the database at the same time.
If a process is writing to the database, a second one will wait and retry for the specified amount of time, before it throws a `SQLITE_BUSY` error.

As far as my research goes, the busy_timeout setting is by default 0 (see SQLite Forum discussion: [SQLite Forum: Why is PRAGMA busy\_timeout per default 0?](https://sqlite.org/forum/info/7e456bf5544ab128)).
Something above 0 is definitely reasonable.

The `busy_timeout` setting can be managed by Django's [database options](https://docs.djangoproject.com/en/5.1/ref/databases/#database-is-locked-errors),
or set on creation of the Database.

### Connection settings

These are settings that need to be applied on every connection and cannot be set on database creation.
**I need to give credit to [this blog article](https://blog.pecar.me/sqlite-django-config)**, since I believe it is a beautiful implementation with a wrapper class:

```python
# config/sqlite3.py
from sqlite3 import dbapi2 as Database

from django.db.backends.sqlite3 import base
from django.db.backends.sqlite3._functions import register as register_functions
from django.utils.asyncio import async_unsafe


class DatabaseWrapper(base.DatabaseWrapper):
    def _start_transaction_under_autocommit(self):
        # Acquire a write lock immediately for transactions
        self.cursor().execute("BEGIN IMMEDIATE")

    @async_unsafe
    def get_new_connection(self, conn_params):
        conn = Database.connect(**conn_params)
        register_functions(conn)
        # sync less often to the disc
        conn.execute("PRAGMA synchronous = NORMAL")
        # keep temporary tables and indices in memory (file by default)
        conn.execute("PRAGMA temp_store = MEMORY")
        # increase amount of pages kept in memory
        conn.execute("PRAGMA cache_size = 1000000000")
        # enforce foreign key constraints
        conn.execute("PRAGMA foreign_keys = ON")
        return conn
```

In Django 5.1 it is possible to specify these in the DATABASES setting:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
        "OPTIONS": {
            "transaction_mode": "IMMEDIATE",
            "init_command": (
                "PRAGMA synchronous = NORMAL;"
                "PRAGMA temp_store = MEMORY;"
                "PRAGMA mmap_size = 2048000000;"  # set it bigger than your database
                "PRAGMA cache_size = -2000;"  # default, but safe to increase
                "PRAGMA foreign_keys=ON;"
                "PRAGMA journal_mode = WAL;"
                "PRAGMA busy_timeout = 5000;"
            ),
        },
    },
}
```

#### IMMEDIATE transactions

By default, SQLite starts transactions in `DEFFERED` mode that are considered read only.
When a write query occurs within a transaction, it is upgraded to a write transaction.
Meanwhile, another transaction might have acquired a lock ob the database.
In that case, the first transaction throws immediately a `SQLITE_BUSY` error, without respecting the `busy_timeout` setting.

To avoid this situation, we start all transactions in `IMMEDIATE` mode, which locks the tables from the beginning.
This implies that you should avoid long-running queries, which is also the reason why you should avoid using
[`ATOMIC_REQUESTS`](https://docs.djangoproject.com/en/5.1/ref/settings/#atomic-requests) with sqlite,
since requests would lock the database for an extended period of time.

#### Fewer syncs to disc

The [PRAGMA synchronous](https://www.sqlite.org/pragma.html#pragma_synchronous) setting determines the frequency with which changes are persisted on disk.
The default setting `FULL` ensures that every successful transaction is also persisted to disk before continuing, which ensures that operating system crashes or power failure will not corrupt the database.
This comes at the cost of slower wries.

The `NORMAL` mode has the same reliability as `FULL` mode in WAL mode and allows simultaneously for faster writes.
The synchronous setting needs to be specified on connection level.

#### Keep temporary tables and indices in memory

By default, SQLite stores [temporary tables](https://www.sqlite.org/inmemorydb.html#temp_db) and indices in a file.
Keeping them in memory gives another performance boost.

#### Cache size

The [PRAGMA cache_size](https://www.sqlite.org/pragma.html#pragma_cache_size) setting determines "the maximum number of database disk pages that SQLite will hold in memory at once per open database file".
This setting, in combination with [mmap_size](https://www.sqlite.org/pragma.html#pragma_mmap_size) setting can have big effects on your query performance.
It is a combination of these two values that will make for the best outcome, and they depend on your use case.
[This article](https://oldmoe.blog/2024/02/03/turn-on-mmap-support-for-your-sqlite-connections/) describes the details on how they are connected.

In applications where there is only one database connection, it is safe to increase the cache size to include the entire database.
That's because there will be no issue with cache invalidation when other connections are writing to the database.
You can leave the `mmap_size` at the default value of 0, since it will have no effect.

For most use cases, where multiple connections are reading and writing to the database, the OS is more efficient in handling cache invalidation, therefore it is better to increase the mmap size instead of the cache size.
A cache is still required for caching pages within transactions, but the default cache size of -2000 kibibytes (=2048000 bytes) or something higher would be fine.
A `cache_size` value that is too big, would use a lot more memory and would not necessarily lead to performance improvements.

#### Enforce foreign keys

By default, for historical reasons, SQLite does not enforce foreign key constraints.
It is a good idea to enable them.

```python
conn.execute("PRAGMA foreign_keys = ON")
```

#### STRICT tables

> By default, SQLite is "weakly typed": it will not complain and totally accept inserting a string into an INT column.
> -- [Optimizing SQLite for servers](https://kerkour.com/sqlite-for-servers)

This is only applied on creation of tables, and I can't find whether Django applies this by default, but I will do some more research.

## References

* [Sqlite in Production](/TIL/2023-06-18-sqlite-in-production.md) (TIL)
* [Litestream](/tools/litestream.md): stream Database changes in sqlite to an S3 bucket for backups
* [Django documentation](https://docs.djangoproject.com/en/5.1/ref/databases/#sqlite-notes): see SQLite notes
* [Django SQLite Production Config](https://blog.pecar.me/sqlite-django-config?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_238)
* [Django SQLite Benchmark](https://blog.pecar.me/django-sqlite-benchmark?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_219)
* [Optimizing SQLite for servers](https://kerkour.com/sqlite-for-servers): Super nice read, with more details on parameters you can adjust in SQLite to run in production
* [Optimal SQLite settings for Django](https://gcollazo.com/optimal-sqlite-settings-for-django/)
* [A database for 2022](https://tailscale.com/blog/database-for-2022)
* [Weeknotes: DjangoCon, SQLite in Django, datasette-gunicorn](https://simonwillison.net/2022/Oct/23/datasette-gunicorn/)
* [Django, SQLite, and the Database is Locked Error](https://blog.pecar.me/django-sqlite-dblock?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_215)
* [A comprehensive guide to SQLite's journal modes, including WAL, DELETE, TRUNCATE, PERSIST, MEMORY, and OFF. Understand the differences, use cases, and how to switch modes to optimize your SQLite database for performance, concurrency, and reliability.](https://gist.github.com/promto-c/531e3d3321f1c2fa66487054b2e040c2)
* [Turn on mmap support for your SQLite connections – Oldmoe's blog](https://oldmoe.blog/2024/02/03/turn-on-mmap-support-for-your-sqlite-connections/)
