# SQLite

### Pros

- no need to configure extra host
- no performance loss because of network latency
- no N + 1 Query problems
- fast reads
- supports a significant amount of concurrent writes per second
- easy to back up and restore

### Cons

- not suitable for more workload heavy applications where writing occurs a lot

### References

* [TIL - Sqlite in Production](/TIL/2023-06-18-sqlite-in-production.md)
* [Django SQLite Production Config](https://blog.pecar.me/sqlite-django-config?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_238)
* [Django SQLite Benchmark](https://blog.pecar.me/django-sqlite-benchmark?utm_campaign=Django%2BNewsletter&utm_medium=email&utm_source=Django_Newsletter_219)
* [A database for 2022](https://tailscale.com/blog/database-for-2022)
* [Optimizing SQLite for servers](https://kerkour.com/sqlite-for-servers?utm_source=changelog-news)
* [Weeknotes: DjangoCon, SQLite in Django, datasette-gunicorn](https://simonwillison.net/2022/Oct/23/datasette-gunicorn/)
* [Optimizing SQLite for servers](https://kerkour.com/sqlite-for-servers?utm_source=changelog-news): Super nice read, with more details on parameters you can adjust in SQLite to run in production.
