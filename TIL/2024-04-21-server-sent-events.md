---
title: Server Sent Events
pubDate: 2024-04-21
tags:
  - Backend
  - Frontend
shortDescription: A practical exploration of implementing Server Sent Events in Django, including challenges with async servers, event stream formatting, and connection handling.
---


I stumbled upon [this video on YouTube](https://youtu.be/MziqE_2Euss?si=6VKstGB2EXUqSEyu) on [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
with Django's StreamingHttpResponse and HTMX and I decided to give it a try to implement it myself.

I wanted to print 10 cowsay quotes on the screen, and then stop. Here is the code:

```python
import asyncio
from django.http.response import StreamingHttpResponse

cowsay_quotes = [
    "I'm a moo-dern programmer.",
    "Stay udderly fantastic!",
    "Moo may represent an idea, but only the cow knows.",
    "I've got the mooves like Jagger.",
    "It's pasture bedtime!",
    "Don’t follow your dreams; follow my Twitter @theCoolCow.",
    "Holy cow! That’s udderly amazing!",
    "Remember to always hoof it over to the sunny side!",
    "Sometimes I'm outstanding in my field, sometimes I'm just standing.",
    "Cowabunga dude, let’s surf the net!"
]

async def stream(request):
    counter = 0
    while counter < 10:
        cow_says = cowsay_quotes[counter]
        counter += 1
        await asyncio.sleep(1)
        yield f"data: <div>{cow_says}</div>\n\n"


async def events(request):
    return StreamingHttpResponse(
        streaming_content=stream(request),
        content_type="text/event-stream"
    )
```

The implementation was not without its surprises.

## Django's "runserver" is threaded

First I wanted to see if it is also possible without an asynchronous server.
The first thing I tried to do, was to see if "runserver" truly handles only one request at once.
To my surprise, multiple requests fired with curl to my local server on a view that slept for 5 seconds were processed simultaneously.
This is how I did it:

```bash
curl "http://127.0.0.1:8000/" & curl  "http://127.0.0.1:8000/"
```

I expected that only one request would be handled at a time.
Until I found out, by asking ChatGPT, that "runserver" actually runs in a threaded mode, which can actually be disabled by starting the command with the `--nothreading` option:

```bash
python manage.py runserver --nothreading
```

Now, the synchronous server would work, if we would define our views as synchronous views, but since every connection would completely occupy a thread, it is not really an option for an application with possibly more than one user.

To set up an asynchronous server, I followed the example in the Django Documentation on [How to use Django with Daphne](https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/daphne/).

## New line characters required

I tried to follow the video, but something did not work.
So I decided to fall back to plain JavaScript implementation of connecting to an EventSource, to take HTMX out of the equation while debugging.

```html
<script>
  const eventSource = new EventSource("/events/")
  eventSource.onmessage = (event) => {
    console.log(event)
  }
</script>
```

For some reason, this still didn't work.
After some long debugging, and going through each character line by line, I realized that the "yield" line was missing two new line characters at the end:

```python
yield f"data: <div>{cow_says}</div>"
yield f"data: <div>{cow_says}</div>\n\n"
```

This small "typo" took me a while to notice, and it is part of the specification for an event stream format, that [require two "\n" characters to end the stream](https://web.dev/articles/eventsource-basics#event_stream_format).

## Events won't stop after 10 iterations

I thought I was smart, and by adding `while counter < 10` to the loop, would only yield 10 items, and the stream would stop.
What happened was that after something more than one second, the loop started again from the beginning.
After some research (I asked ChatGPT), I found out, that the reason for that is that after the event source disconnects, the browser tries to reconnect again to it, and does so successfully.

To avoid that, I had to extend both the client, and the server side code, to respond by closing the EventSource when the event "closeStream" is received by the client:

```python
async def stream(request):
    counter = 0
    while counter < 10:
        ...
        yield f"data: <div>{cow_says}</div>\n\n"
    yield "event: closeStream\ndata: \n\n"
```

```html
<script>
  ...
  eventSource.addEventListener('closeStream', function (e) {
    eventSource.close();
  });
</script>
```

That did the trick, and now I get only 10 messages!

## Key Takeaways

* Server sent events can be pretty neat
* Asynchronous request handling is a must for SSEs
* You need to be careful when you use SSEs [in combination with HTTP/1](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#sect1).
 You need to make sure that you use Django with HTTP/2.
