# Makefile

Make is a command-line tool that performs actions as defined in a configuration file called `Makefile`.
Originally it was created for build automation, but it can perform any shell operation.
Which is why it is useful in some cases to create a command palette that might be useful for your project.

## Cheatsheet

### Conditionals

```makefile
# Check for dependencies
install:
    @which localstack || pip install localstack
    @which awslocal || pip install awscli-local

# Check for a File
check_file:
	@ [ -f /path/to/file ] && echo "File exists" || echo "File does not exist"

# Check for a directory
check_dir:
	@ [ -d /path/to/directory ] && echo "Directory exists" || echo "Directory does not exist"

# Check for a variable
check_var:
	@ [ -n "$(MY_VAR)" ] && echo "MY_VAR is set" || echo "MY_VAR is not set"

# Check command output
check_command_output:
	@ if [ `uname` = "Linux" ]; then echo "Running on Linux"; else echo "Not running on Linux"; fi

# Check if package is installed
install_package:
	@ dpkg -l | grep -q package_name || sudo apt-get install package_name

# Check if current directory is a Git repository
check_git:
	@ git rev-parse --is-inside-work-tree > /dev/null 2>&1 && echo "Inside a Git repository" || echo "Not a Git repository"
```
