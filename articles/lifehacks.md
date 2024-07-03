# Lifehacks

#### Highlight comments in red

I got this from the [Clean Code Lectures](https://www.youtube.com/watch?v=7EmboKQH8lM&list=PLmmYSbUCWJ4x1GO839azG_BBw8rkh-zOj) by *Uncle Bob*.
It forces you to keep your comments small, or make them obsolete, by making the code self-explanatory, or in case
a comment is appropriate, it highlights it as important.

#### "Hidden" GitHub VSCode editor

*GitHub* has a nice feature when inside a repository in the browser. Press the key `.` (period) on your keyboard, to open a VSCode editor of the project inside your browser.


#### Document code with ASCII Diagrams

Self documenting code is great. And having diagrams of your architecture, database schema, or processes directly next to your code can be sometimes very helpful.
[ASCIIFlow](https://asciiflow.com/) is a great tool for that.

#### Use strings as key for choices instead of integers

Avoid using integers as keys for model field [choices](https://docs.djangoproject.com/en/5.0/ref/models/fields/#choices) (or any other Enum).
They convey more information, without looking back at the code, in case you are required to work with them for example in templates, or in JavaScript.
