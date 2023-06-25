---
layout: page
title:  "Why Django?"
date:   2023-05-03 12:00:00 +0200
published: true
image: 
  path: /images/tim-berners-lee.jpg
  thumbnail: /images/meme-django.jpg
  caption: Tim Berners Lee starting his first Django project in 1989
---

*Django* is not the only web framework out there. 
There are dozens of web frameworks, but as a beginner you will probably make the wrong choice anyway.

## Applications on the Web

The web got a long way [since it's invention in 1989](https://home.cern/science/computing/birth-web/short-history-web).
It is part of our daily lives, and we became so dependent on it, that our society will probably break down into chaos if the internet will shut down from one day to the other.
As web developers, we are are confronted with four different kinds of websites:
* **Static websites** are designed to provide information or content for people to read. However, they do not allow for user interaction, such as commenting or content creation.
* **Dynamic websites** are web pages generated on the server-side and display content that is pulled from a database or other sources. The content on a dynamic website can change based on user interactions or other variables, and they typically offer more interactivity than static websites.
* **Web applications** are designed to perform specific tasks and offer a more interactive and personalized user experience than dynamic websites.
* **Web services** are a type of application programming interface (API) that provides structured information in a machine-readable format, intended for consumption by other software applications rather than humans.

## Django's role in the Web

Django can handle any type of those applications, even though not especially good at any of those. 
Here is my personal opinion on how good Django can handle the different
* static websites 👎️: there have been several attempts to transform Django projects into static sites, but none of those have been particularly successful.
  You would probably be better off writing your own static site generator for Django, if you really want to press your Django project into static HTML.
* web applications 🤔: The smooth experience that frontend frameworks like *React*, *Vue* or *Svelte* offer, probably cannot be replicated with Django as easily. 
  But if it can, then it is probably in combination with [HTMX](https://htmx.org/) and [alpine.js](https://alpinejs.dev/) [^django-con-sass].
* web services 🙂: "Django REST Framework" has gained considerable popularity for providing an effortless method to expose REST APIs that can be utilized for building web and mobile applications or delivering web services.
* dynamic websites 🤩: Django's ORM and Model concept greatly simplifies database access, and is one of the main strengths of Django. 
  The built in templating system makes it easy to render information on a web page. And the forms API takes care of safe interaction with user input.

If you want good reasons why *not* to use Django, you can [ask ChatGPT](https://chat.openai.com/share/0ad187e8-b683-4fe4-bbc3-f57ab75b9894).
But here are some other **good reasons why Django is a good choice**:

* its built-in authentication mechanism, which is highly extendable and customizable, makes it suitable for a wide range of applications
* it takes care of many security best practices
* third-party packages available on https://djangopackages.org/ provide a plethora of additional functionality, further enhancing Django's capabilities
* Django's use of Python makes it incredibly fast to develop new applications, find online resources
* great community

Furthermore, learning Django also provides a good entry point for exploring other technologies such as databases, web servers, and frontend development.
Ultimately, the decision to use Django or any other web framework should be based on the specific needs and requirements of the project at hand.


[^django-con-sass]: [This video]((https://youtu.be/3GObi93tjZI)) shows how *Django* in combination with *HTMX* are capable of replacing a React application 
