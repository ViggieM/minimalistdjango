# Docker

> Docker virtualizes the operating system of the computer on which it is installed and running.
> It provides the ability to package and run an application in a loosely isolated environment called a container.
> A container is a runnable instance of a docker image.
> You can create, start, stop, move, or delete a container using the Docker API or CLI.
> You can connect a container to one or more networks, attach storage to it, or even create a new docker image based on its current state.
> <br>
> [How to Deploy Django Application on AWS using ECS and ECR? | by SHUBHAM KAUSHIK | Dev Genius](https://blog.devgenius.io/how-to-deploy-django-application-on-aws-using-ecs-and-ecr-aab9ab003a85)

A Docker container doesn’t have any operating system installed and running on it.
But it would have a virtual copy of the process table, network interface(s), and the file system mount point(s).
These have been inherited from the operating system of the host on which the container is hosted and running.
