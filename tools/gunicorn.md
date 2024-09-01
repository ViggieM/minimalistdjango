# Gunicorn

Gunicorn stands for **‘Green Unicorn’** and is a Python WSGI HTTP Server for UNIX.
It has no dependencies and can be installed with pip:

```bash
pip install gunicorn
```

## Cheatsheet

### Sample configuration

Here is a sample `gunicorn.conf.py`:

```python
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1

# bind to a socket
bind = "unix:/path/to/myproject.sock"
# or to an IP address
bind = "192.168.x.y:8000"
```

## References

* [Understanding Gunicorn](/TIL/2023-06-23-understanding-gunicorn.md)
* [docs.gunicorn.org][https://docs.gunicorn.org/en/stable/index.html]: *Gunicorn* documentation
