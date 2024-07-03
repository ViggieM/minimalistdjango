Setting up a python environment can be confusing at the beginning, since there are so many options of installing or using python on your machine:
- system python
- virtual environments
- conda

Not to mention Windows which is a totally different domain to Linux and Mac.

Here are some guidelines that you should consider when installing python:
- do not use the system python. this is required for your system, and messing around with dependencies can cause you big trouble at some point in the future.
- do not use sudo to install python. You should not be required to use sudo to set up your python environment.

The easiest way to use python in my opinion is to use Pyenv. It is easy to install and set up different python versions a per-user basis.
It allows you to switch between python versions easily, install the newest python versions and set python versions on a per-project basis.


## Related Tools
- Pyenv
- pipx
- Django
- Poetry


# Footnotes / abbreviations
WSL: Windows subsystem for linux
Windows: In Windows, it is recommended to use WSL2 for using Python, as of 2024.
