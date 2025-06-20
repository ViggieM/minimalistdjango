---
title: Use a Docker container for testing deployment scripts
pubDate: 2024-08-15
shortDescription: A guide on setting up a Docker container with SSH access for testing Ansible deployment scripts, including configuration steps and common troubleshooting.
tags:
  - DevOps
---

I thought it was funny to try and use a docker container instead of a VM for testing deployment scenarios.
The goal is to create and run a docker container, so I can ssh into it and test Ansible deployment scripts.

## Install ssh server

I created a Dockerfile that installs the ssh server, sets a root password and changes the configuration to allow root login via ssh:

```Dockerfile
FROM debian:11

RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:root123' | chpasswd
ARG USERNAME=alice
RUN useradd -m $USERNAME && echo "$USERNAME:password" | chpasswd && adduser $USERNAME sudo
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
```

To launch the container in the background I can execute:

```bash
docker build . -t ssh-container
docker run -d ssh-container
```

Now I can connect to the container with:

```bash
CONTAINER_ID=$(docker run -d ssh-container)
CONTAINER_IP_ADDR=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $CONTAINER_ID)
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@$CONTAINER_IP_ADDR
ssh root@$CONTAINER_IP_ADDR
```

You can see that the authorized key has been added to ``:

```bash
docker exec $CONTAINER_ID cat /root/.ssh/authorized_keys
```

Now I can run my ansible scripts on the container for testing.
And whenever I need a fresh start, I can remove the container with:

```bash
docker stop $CONTAINER_ID && docker remove $CONTAINER_ID
docker remove -f $CONTAINER_ID
```

There is just one issue, which is at the end of the Q&A section.

## Q&A

### Why don't I need to specify a port in the docker run command?

At first, it might seem necessary to specify the port when starting the container, so we can connect via ssh to it:

```bash
docker run -d -p 2222:22 ssh-container
```

The reason we don't need this is that we continue connecting to the container via it's internal IP address.
The ssh daemon naturally listens on port 22 at that IP Address.
Port 2222 is only relevant when we don't know the IP Address of the Docker container.
In that case, we could connect to it via:

```bash
ssh -p 2222 root@127.0.0.1
```

### What if my sshd listens on a different port than 22?

Then you need to bind the port correctly when you start the container.
Let's say your port number is 12321, then the correct docker run command would be:

```bash
docker run -d -p 2222:12321 ssh-container
```

### Why can't I use systemd inside my Docker container?

It is strongly advised not to try and use systemd inside Docker.
Attempts can lead to weird system behaviour.

Source: [boot - System has not been booted with systemd as init system (PID 1). Can't operate - Ask Ubuntu](https://askubuntu.com/questions/1379425/system-has-not-been-booted-with-systemd-as-init-system-pid-1-cant-operate)
