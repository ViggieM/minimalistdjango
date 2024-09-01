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

### Concurrent writes

To enable concurrent writes, you need to activate the Write Ahead Log on database creation:

```bash
sqlite3 db.sqlite3 'PRAGMA journal_mode=wal; PRAGMA busy_timeout = 5000;'
```

### Faster writes

The PRAGMA synchronous setting is applied on the [database connection](https://stackoverflow.com/questions/36308801/sqlite3-pragma-synchronous-not-persistent).
Therefore, you need to register it as a Django signal:

```python
from django.db.backends.signals import connection_created

def activate_foreign_keys(sender, connection, **kwargs):
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        cursor.execute('PRAGMA synchronous=1;')

connection_created.connect(activate_foreign_keys)
```

Source: [Place to set SQLite PRAGMA option in Django project - Stack Overflow](https://stackoverflow.com/questions/4534992/place-to-set-sqlite-pragma-option-in-django-project/6843199#6843199)

## References

* [Sqlite in Production](/TIL/2023-06-18-sqlite-in-production.md) (TIL)
* [Litestream](/tools/litestream.md)
* [Django SQLite Production Config](https://blog.pecar.me/sqlite-django-config?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_238)
* [Django SQLite Benchmark](https://blog.pecar.me/django-sqlite-benchmark?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_219)
* [A database for 2022](https://tailscale.com/blog/database-for-2022)
* [Optimizing SQLite for servers](https://kerkour.com/sqlite-for-servers?utm_source=changelog-news)
* [Weeknotes: DjangoCon, SQLite in Django, datasette-gunicorn](https://simonwillison.net/2022/Oct/23/datasette-gunicorn/)
* [Optimizing SQLite for servers](https://kerkour.com/sqlite-for-servers?utm_source=changelog-news): Super nice read, with more details on parameters you can adjust in SQLite to run in production.
* [Django, SQLite, and the Database is Locked Error](https://blog.pecar.me/django-sqlite-dblock?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_215)
