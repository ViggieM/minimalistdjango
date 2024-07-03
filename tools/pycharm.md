# PyCharm

### Pros

* great code navigation and indexing
* great git tooling

### Cons

* not free
* sometimes slow project startup
* debugging is more difficult to set up than with [VSCode](vscode.md) in more complex docker-compose configurations

### References

* [42 Tips and Tricks - JetBrains Guide](https://www.jetbrains.com/guide/python/playlists/42/)


## Guides

### Django shell for PyCharm Python console

1. open Pycharm settings and go to: Build,Execution,Deployment -> Console -> Python Console
2. add the environment variable: `DJANGO_SETTINGS_MODULE=config.settings` (python module path to your settings.py)
3. paste the following code inside the "Starting script" section

```python
from django_extensions.management.shells import import_objects
from django.core.management.color import color_style

globals().update(import_objects({"dont_load": [], "quiet_load": False}, color_style()))
```
