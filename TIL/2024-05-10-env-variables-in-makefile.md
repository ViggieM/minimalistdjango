---
title: Define environment variables in a Makefile
pubDate: 2024-05-10
tags:
  - Developer Experience
keywords: makefile, environment variables, build automation, deployment, eval
shortDescription: Learn how to dynamically define environment variables in a Makefile using $(eval) when the variable value depends on files that don't exist yet during Makefile parsing.
---


I had to adapt a Makefile of a project.
Inside this Makefile, there is a command called deploy.
It clones the repository in a new folder inside the `/tmp` directory, installs the node dependencies and executes an ansible playbook that copies the code from the temporary folder to the remote host and starts the application.

```makefile
source_dir := $(shell mktemp -d -t jobs-XXXXXX)

deploy:
    git clone --depth 1 --branch $(TAG) <repo url> $(source_dir)
    npm ci --prefix $(source_dir)
    npm run build --prefix $(source_dir)
    ansible-playbook <playbook.yml>
```

It can be executed with `make deploy TAG=1.0.0`.

The challenge I faced was that I had to install a python package on the remote host, that can only be downloaded from a private python package repository.
So my idea was to download the python package also into the "tmp" folder:

```bash
pip download --dest $(target_dir) --no-deps <private-package-name>==$(VERSION)
```

and later install it with the argument `--find-links` on the remote host:

```bash
pip install --find-links /path/to/private-package-name/
```

`target_dir` is defined in the Makefile as:

```makefile
target_dir := $(source_dir)/private-package-name/
```

For a specific TAG specified, I need to read the version of the python package from the pyproject.toml, and download it into the temporary directory.
The version number can be read from the pyproject.toml file for example with `grep`:

```bash
grep private-package-name pyproject.toml | cut -d' ' -f3
```

The problem is that I can't define "VERSION" the same way as I define "target_dir", because at the moment the variable is defined, the temporary folder doesn't exist yet since it was not yet cloned.
So we need to define the variable inside the "deploy" command.
After a few trials, I came up with this solution:

```makefile
deploy:
    ...
    $(eval VERSION := $(shell grep private-package-name pyproject.toml | cut -d' ' -f3))
    pip download --dest $(target_dir) --no-deps <private-package-name>==$(VERSION)
    ...
```

And now this works like a charm.
I know, it feels a little bit hacky, but I don't mind. There is only one point where it could break, and that's in the Makefile.
