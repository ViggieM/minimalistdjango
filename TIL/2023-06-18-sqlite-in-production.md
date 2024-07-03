# SQLite in Production

I was inspired by a talk at [_DjangoCon_][1] that I attended in 2023, so I decided to look a bit more into SQLite in combination with Django.

Here are the key points that were made in the YouTube video:

* SQLite is already in production. You can already see how many applications use SQLite on your computer with this command:
    ```bash
    find / \( -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3" \) -type f -exec file {} \; 2>/dev/null | grep SQLite
    ```
* [11:20](https://youtu.be/yTicYJDT1zE?t=682) it is a serverless database, which means you don't need to configure an extra host, manage access by your application server, etc.
* [14:25](https://youtu.be/yTicYJDT1zE?t=866) No performance loss because of network latency
* [15:31](https://youtu.be/yTicYJDT1zE?t=931) No N + 1 Query problems
* [17:31](https://youtu.be/yTicYJDT1zE?t=1051) Concurrent writes are not a problem if you turn [Write-Ahead Logging](https://www.sqlite.org/wal.html) for your SQLite database. For this, you can execute `sqlite3 db.sqlite3 'PRAGMA journal_mode=wal;'` in your shell.
* [19:02](https://youtu.be/yTicYJDT1zE?t=1142) Speed up writes even more by reducing the [synchronous level](https://www.sqlite.org/pragma.html#pragma_synchronous)
* [20:53](https://youtu.be/yTicYJDT1zE?t=1253) You can easily back up the SQLite database with [Litestream](https://litestream.io/)

## Set up Django with SQLite

When creating a new Django project, it comes with following default setting for `DATABASES`:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

Or you can use [`dj-database-url`](https://github.com/jazzband/dj-database-url/) to configure your `DATABASES` setting with a `DATABASE_URL`:

```
DATABASE_URL=sqlite:///path/to/your/database/file.sqlite3
```

## Activate Write Ahead Log

Now, before you start your django project for the first time, which automatically creates a SQLite database for you, you should create it yourself first, by running:

```bash
sqlite3 db.sqlite3 'PRAGMA journal_mode=wal; PRAGMA busy_timeout = 5000;'
```

## Reduce the synchronous level

The PRAGMA synchronous setting is a little bit more tricky, since it does not apply to the database, [but to the database connection](https://stackoverflow.com/questions/36308801/sqlite3-pragma-synchronous-not-persistent).
Hence, you have to change this setting [for all connections opened by the Django app](https://stackoverflow.com/a/6843199/5540654):

```python
from django.db.backends.signals import connection_created

def activate_foreign_keys(sender, connection, **kwargs):
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        cursor.execute('PRAGMA synchronous=1;')

connection_created.connect(activate_foreign_keys)
```


## Back up a SQLite Database with Litestream

The documentation is pretty straightforward, so I will link to the necessary steps on the official [litestream](https://litestream.io) web page.

* [Install](https://litestream.io/install/)
* [Replicating to Amazon S3](https://litestream.io/guides/s3/)
* [Running as a Systemd service](https://litestream.io/guides/systemd/)
* [Tips & Caveats](https://litestream.io/guides/systemd/)

If you wish to learn more about Litestream, there is an amazing episode on [_The Changelog_][2] podcast with the creator of litestream.

## Further reading

* [https://tailscale.com/blog/database-for-2022/](https://tailscale.com/blog/database-for-2022/)
* [https://blog.expensify.com/2018/01/08/scaling-sqlite-to-4m-qps-on-a-single-server/](https://blog.expensify.com/2018/01/08/scaling-sqlite-to-4m-qps-on-a-single-server/)
* [https://simonwillison.net/2022/Oct/23/datasette-gunicorn/](https://simonwillison.net/2022/Oct/23/datasette-gunicorn/)
* [https://github.com/tomdyson/django-sqlite-load-tests](https://github.com/tomdyson/django-sqlite-load-tests)
* [Optimizing SQLite for servers](https://kerkour.com/sqlite-for-servers?utm_source=changelog-news): Super nice read, with more details on parameters you can adjust in SQLite to run in production.

[1]: https://youtu.be/yTicYJDT1zE
[2]: https://changelog.com/podcast/433
