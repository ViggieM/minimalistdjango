---
title: "Provision a Virtual Machine with Ansible"
tags:
  - VirtualBox
  - Ansible
categories:
  - Running in Production
---

The goal is to create an Ansible playbook and provision the Virtual Machine created in the [previous post]({% til 'virtualbox' %}) remotely, with:

```bash
ansible-playbook -i <inventory name> -e user=<remote username> playbook.yml
```

## Enable superuser privileges on remote host

First, I want to **add my remote user to the sudoers group**, to be able to install system packages on my remote host.
This is not done in VirtualBox by default on installation.
For this, I had to follow [these instructions](https://superuser.com/questions/1623376/how-can-i-make-my-own-account-a-sudoers-on-virtualbox/1755286#1755286) and execute following commands on my remote host:

```bash
su -
sudo adduser <username> sudo
```

The root password is the same password as the one as the one selected for the user in the installation step of Ubuntu.

Next, I allow the VM user to execute `sudo` without being prompted for a password.
This enables the execution of Ansible tasks that require superuser privileges, without being prompted for a password.
For this, on the VM, I created a new file `/etc/sudoers.d/<username>` inside the `/etc/sudoers.d` directory with following content[^1]:

```
<username> ALL=(ALL) NOPASSWD:ALL
```

## Install Ansible

I installed Ansible with "pipx".

## Create inventory file

The inventory file will specify the hosts the Playbook will be executed on.
For this I followed the simplest pattern, as suggested in the [Ansible Documentation](https://docs.ansible.com/ansible/latest/tips_tricks/sample_setup.html#sample-setup):

```bash
touch development
echo "vbox ansible_host=<IP Address of the VM> ansible_port=<SSH port of the VM> ansible_become=true" >> development
```

* **IP Address of the VM**: You can find out the IP Address of the VM by executing `ip a s`
* **SSH port of the VM**: The SSH port is 22 by default, but can be changed, to increase security
* **ansible_become**: this instructs ansible to become a specific user on the remote host during playbook execution. By default this is **root**. Since most of the commands require superuser privileges, I would rather specify it here than for each task repeatedly, and only in case I need less privileges to perform an action, I specify it per task level.


## Create playbook

I chose to create a playbook for installing Pyenv on my VM. I created a "playbook.yml" file with following content:

```yml
- name: Install pyenv
  hosts: vbox

  tasks:
    - name: Update apt cache (for Ubuntu)
      ansible.builtin.apt:
        update_cache: true

    - name: Pyenv | Install suggested packages for build environment # see https://github.com/pyenv/pyenv/wiki#suggested-build-environment
      ansible.builtin.apt:
        package:
          - curl
          - git
          - build-essential
          - zlib1g-dev
          - libssl-dev
          - libbz2-dev
          - libreadline-dev
          - libsqlite3-dev
          - libncursesw5-dev
          - xz-utils
          - tk-dev
          - libxml2-dev
          - libxmlsec1-dev
          - libffi-dev
          - liblzma-dev

    - name: Pyenv | Install from https://pyenv.run
      become: true
      become_user: "{{ user }}"
      ansible.builtin.shell:
        cmd: set -o pipefail && curl https://pyenv.run | PYENV_ROOT=$HOME/.pyenv bash
      args:
        executable: /usr/bin/bash
        creates: $HOME/.pyenv/bin/pyenv

    - name: Pyenv | Add pyenv to profile
      become: true
      become_user: "{{ user }}"
      ansible.builtin.blockinfile:
        path: $HOME/.profile
        block: |
          export PYENV_ROOT="$HOME/.pyenv"
          command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
          eval "$(pyenv init -)"
          eval "$(pyenv virtualenv-init -)"
```

The playbook goes through the installation process of pyenv step by step:

1. It uptates the apt packages list (for debian/ubuntu obviously)
2. It installs the packages required by *pyenv* for building
3. It installs *pyenv* via the official installation script
4. It updates the `.profile` of the user to initialize *pyenv* correctly.

I also made use of a mandatory environment variable `{{ user }}`, that can be specified with the flag `-e` on playbook execution.
It controls for which user *pyenv* should be installed.
Here is how you would execute the playbook:

```bash
ansible-playbook -i development -e user=victor playbook.yml
```

[^1]: Permissions could be more specific (e.g. `ALL = NOPASSWD: /bin/apt, /bin/apt-get` ...), but feel free to adapt as needed.
