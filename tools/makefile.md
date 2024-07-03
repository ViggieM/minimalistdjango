# Makefile

## Conditionals

I got this one from
a [sample Makefile for Localstack](https://github.com/localstack-samples/sample-notes-app-dynamodb-lambda-apigateway/blob/main/Makefile),
and I thought I might need it some day:

```makefile
## Install dependencies
install:
    @which localstack || pip install localstack
    @which awslocal || pip install awscli-local
```

It checks whether localstack or awslocal is installed, and if not, it executes the pip install command.

This led me to ask ChatGPT for several other use cases, and this is what it came up with:

### Check for a File

```makefile
check_file:
	@ [ -f /path/to/file ] && echo "File exists" || echo "File does not exist"
```

### Check for a directory

```makefile
check_dir:
	@ [ -d /path/to/directory ] && echo "Directory exists" || echo "Directory does not exist"
```

### Check for a variable

```makefile
check_var:
	@ [ -n "$(MY_VAR)" ] && echo "MY_VAR is set" || echo "MY_VAR is not set"
```

### Check command output

```makefile
check_command_output:
	@ if [ `uname` = "Linux" ]; then echo "Running on Linux"; else echo "Not running on Linux"; fi
```

### Check if package is installed

```makefile
install_package:
	@ dpkg -l | grep -q package_name || sudo apt-get install package_name
```

### Check if current directory is a Git repository

```makefile
check_git:
	@ git rev-parse --is-inside-work-tree > /dev/null 2>&1 && echo "Inside a Git repository" || echo "Not a Git repository"
```
