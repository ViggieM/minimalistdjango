# Supervisor

> Supervisor is a client/server system that allows its users to monitor and control a number of processes on UNIX-like operating systems.
>
> -- <i><a target="blank" href="http://supervisord.org/">Supervisor: A Process Control System — Supervisor 4.2.5 documentation</a></i>

### Pros

* HTTP server to monitor your services. It can be enabled by specifying the [[inet_http_server]](http://supervisord.org/configuration.html#inet-http-server-section-values) setting inside `/etc/supervisor/supervisord.conf`.
  It shouldn't be exposed on the internet though.
* Easy to set up log rotation. It can also be configured with [*Logrotate*](https://medium.com/@doodyp/easy-logging-with-logrotate-and-supervisord-16b72b79ded0).

### Cons

* needs additional installation, in contrast to Systemd, that comes pre-installed on most linux distributions
* can not bind to privileged ports, smaller than 1024.
  This might be ok if you don't need it, or you place a web server in front of your application, such as [nginx](/tools/nginx.md), but for a truly minimal set up, the *Systemd* "AmbientCapabilities" allows you to bind to port 80 or 443 directly.
