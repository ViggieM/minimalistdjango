---
title: Developer Productivity Tips and Programming Lifehacks
pubDate: 2024-07-08
shortDescription: A collection of practical programming tips and development shortcuts to improve your coding workflow.
tags:
  - Developer Experience
keywords: productivity, vscode, github tricks, ascii diagrams, console debugging, mobile debugging, choices
---

#### Highlight comments in red

I got this from the [Clean Code Lectures](https://www.youtube.com/watch?v=7EmboKQH8lM&list=PLmmYSbUCWJ4x1GO839azG_BBw8rkh-zOj) by *Uncle Bob*.
It forces you to keep your comments small, or make them obsolete, by making the code self-explanatory, or in case
a comment is appropriate, it highlights it as important.

#### "Hidden" GitHub VSCode editor

*GitHub* has a nice feature when inside a repository in the browser. Press the key `.` (period) on your keyboard, to open a VSCode editor of the project inside your browser.

#### Make ASCII Diagrams

Documentation directly next to your code is great.
With [ASCIIFlow](https://asciiflow.com/) you can easily draw schemas of your architecture, database, or processes to explain your code better.
But keep in mind that documentation easily goes out of date.

#### Use strings as key for choices instead of integers

Avoid using integers as keys for model field [choices](https://docs.djangoproject.com/en/5.0/ref/models/fields/#choices) (or any other Enum).
They convey more information, without looking back at the code, in case you are required to work with them for example in templates, or in JavaScript.

#### Console for Mobile Browsers

Sometimes you need to debug something that works on your desktop, but not on mobile.
[Eruda](https://github.com/liriliri/eruda) is a console for mobile browsers.
Keep a javascript snippet saved as a bookmark, visit the site you want to inspect, then select the bookmark in the address bar.
This gives you an icon on the bottom right, that opens a console on your phone.

#### Reffer to the Currently Inspected Element with `$0` in the Console (JavaScript)

Instead of using `document.querySelector` to reference an HTML Element in the Console, you can inspect the HTML in the browser, select the desired element with the inspect tool, and use `$0` to reference it in the console.
