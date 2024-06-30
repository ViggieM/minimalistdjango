# Performance

## References

* [Performance and optimization | Django documentation | Django](https://docs.djangoproject.com/en/5.0/topics/performance/)
* [High Performance Django](https://lincolnloop.com/high-performance-django/frontmatter.html): Great book on perfomance in Django. The knowledge can be applied in other programming languages and frameworks too.
* [Django performance tips - Jacob Kaplan-Moss](https://jacobian.org/2005/dec/12/django-performance-tips/): Blog article with some outdated links, but still quite good first start

## TODO

It seems like testing the performance of a website is not trivial.
The behaviour of the user is hard to replicate.
The test environment is highly dependent on the hardware you are running on and maybe also external factors, therefore they must be highly isolated.
And even then, the results might correlate with the real world, but do not provide absolute values.

For testing the performance of a website you can use different tools like Locust and k6.
There are various other tools, but for now I will focus only on those two.
The basic principle is that you have your app running in some kind of environment, and a tool like k6 or Locust fires predefined requests on your application and gathers metrics on response time.
Things like number of concurrent users can be configured.
Interpreting the results of a loadtest is not easy.
Locust provides a metric called RPS (requests per second), which correlates with the page response time.

There are also different types of performance testing.
Frontend performance testing and Backend performance.
For the frontend performance testing you can use google's Lighthouse, which gives you suggestions on how to improve your page speed.

How does the website work?
Well let's say i have a django web application that returns a simple "hello world".
Every request in python is handled syncronously, so for every request, one worker is entirely ocupied with processing the response until it is finished.
Assuming the gunicorn has multiple workers for every CPU, this will not have any performance increase, since there is no I/O involved, so the parallelization can have an effect.

To create a higher amount of requests with locust, you can spawn multiple workers with docker compose:

```yaml
version: '3'

services:
  master:
    image: locustio/locust
    ports:
     - "8089:8089"
     - "5557:5557"
    volumes:
      - ./:/mnt/locust
    command: -f /mnt/locust/locustfile.py --master -H http://master:8089

  worker:
    image: locustio/locust
    volumes:
      - ./:/mnt/locust
    command: -f /mnt/locust/locustfile.py --worker
    network_mode: "host"
```

You can execute then with: `docker compose up --scale worker=4`

How do you isolate test enviroments since every computer hardware is different?
How does docker utilize CPUs?
Why is python so slow?

- https://k6.io/docs/testing-guides/load-testing-websites/
- https://medium.com/@Sudarsan_M/performance-testing-using-locust-with-parallel-requests-1f51a2065be4
- https://docs.locust.io/en/stable/quickstart.html
- https://adamj.eu/tech/2023/03/02/django-profile-and-improve-import-time/
- django debug toolbar
