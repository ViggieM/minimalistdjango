---
title: "Understanding Gunicorn"
tags:
  - gunicorn
---

When you create a new *Django* project with `django-admin startproject`, it automatically creates a `wsgi.py` file for you.
This is a module containing a WSGI application object called `application` that can be called by any type of WSGI server.
Here is how this works.

## The simplest WSGI application

*WSGI*: stands for *Web Server Gateway Interface*. It is an interface specification by which server and application communicate.
The application provides a function which the server calls for each request:

```python
def application(environ, start_response):
    ...
```

* `environ` is a Python dictionary containing the CGI-defined environment variables plus a few extras.
* `start_response` is a callback by which the application returns the HTTP headers.

        start_response(status, response_headers)

* `status` is an HTTP status string (e.g., "200 OK")
* `response_headers` is a list of 2-tuples, the HTTP headers in key-value format

The application function then returns an iterable of body chunks, that need to be bytes, e.g. `[b"<html>Hello, world!</html>"]`.
So the simplest WSGI application can be:

```python
def application(environ, start_response):
    start_response("200 OK", [])
    return [b"<html>Hello, world!</html>"]
```

## Gunicorn

Normally during development you use `python manage.py runserver` to start a web server, but it is not the recommended way in production<sup>[[1](https://docs.djangoproject.com/en/dev/ref/django-admin/#runserver)]</sup>.
Basically it is also a WSGI application that has some additional features such as reloading on code changes, but it has not gone through security audits or performance tests.

Gunicorn stands for **‘Green Unicorn’** and is a Python WSGI HTTP Server for UNIX.
It has no dependencies and can be installed with pip:

```bash
pip install gunicorn
```

Assuming you placed the previous function _application_ in a file called `main.py`, you can launch the application with:

```bash
gunicorn main:application
```

and gunicorn will spawn two processes that you can see when you call `ps aux | grep gunicorn`.
One of them is the parent process that controls all the workers, the other one is the process for the worker.
By default, it will only spawn one worker and listen to HTTP requests on `127.0.0.1:8000`.

## Configure Gunicorn

Gunicorn detects if there is any file called `gunicorn.conf.py` inside the directory where it is executed, or you can specify a different path with the `-c` flag.
Say you can spawn multiple gunicorn processes that will serve your application to make use of the computing power of your server, based on the number of CPUs the machine has.
To find out the number of processors on your UNIX machine, you can execute [`grep -c ^processor /proc/cpuinfo`](https://stackoverflow.com/questions/6481005/how-to-obtain-the-number-of-cpus-cores-in-linux-from-the-command-line).
[The Gunicorn documentation](https://docs.gunicorn.org/en/stable/settings.html#workers) suggests to run `2-4 x $(NUM_CORES)` of workers.
The reasoning behind it is that, while one of the processes is occupied with handling I/O or waiting for a response from the database, the other one can take over and handle a new request.

Here is how the `gunicorn.conf.py` file might look like:

```python
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
```

### Listen to different IPs

By default, the Gunicorn process will listen for http request on `127.0.0.1:8000`.
You can configure Gunicorn to listen to different ports, or even to a public IP address.
You can easily test this by finding out your computer's IP address inside your local network with `ifconfig`  and set the bind address in the `gunicorn.conf.py` file like this:

```python
bind = "192.168.x.y:8000"
```

and navigate e.g. from your phone to your computer with this address.
Ports smaller than 1024 require additional configuration.

In case you plan to use a proxy server like Nginx on the same machine, you might consider using a socket for proxying requests to your Gunicorn server.

```python
bind = "unix:/path/to/myproject.sock"
```

This has slight performance advantages, since they can avoid some checks and operations (like routing)<sup>[[3](https://serverfault.com/questions/124517/what-is-the-difference-between-unix-sockets-and-tcp-ip-sockets/124518#124518)]</sup>.

### https://

Gunicorn is capable of serving requests over HTTPS too.
This way, you wouldn't even need a web server like nginx. And if you use Whitenoise to serve your static files, you would be good to go!

### Run Gunicorn as a background process

To run the Gunicorn process(es) in the background, you need to configure *Supervisor* or *Systemd*.
There are plenty articles online that explain how to configure both of them with Gunicorn, but after doing some research, here is my takeaway:
* *Supervisor* is more versatile and simpler to configure, but you can't use ports smaller than 1024
* *Systemd* looks a bit more complex at first site, but it is probably already installed on your Linux distribution

## References
* [docs.gunicorn.org][gunicorn]: *Gunicorn* documentation
* [WSGI Servers][fullstackpython]: A more detailed explanation on WSGI servers and other Gunicorn alternatives
* More WSGI learning resources: [wsgi.readthedocs.io][wsgi]
* [Running Gunicorn — Gunicorn 22.0.0 documentation](https://docs.gunicorn.org/en/latest/run.html)

[wsgi]: https://wsgi.readthedocs.io/en/latest/
[gunicorn]: https://docs.gunicorn.org/en/stable/index.html
[fullstackpython]: https://www.fullstackpython.com/wsgi-servers.html
