---
title: Vagrant
---

# Vagrant

## Pros
* Simplifies the spin up of a Virtual Machine, resuming it to only `vagrant up`. No need for manual setup of VirtualBox instances.

## Cons
I can't come up with any right now. :)

## Guide

For installation, follow the instructions on [https://developer.hashicorp.com/vagrant/install](https://developer.hashicorp.com/vagrant/install)

### Cheatsheet

```bash
# spin up the VM
vagrant up
# ssh into the VM
vagrant ssh
```

#### SSH Agent forwarding

This can be useful to pull from the git repo inside the VM, so you can test deployment.

```bash
# save the ssh config to a file
vagrant ssh-config > vagrant-ssh.config
# run ssh with the file.
ssh -F vagrant-ssh.config default
```

Make sure you append following lines to the config file before:

```shell
Host default
   ForwardAgent yes
```

Sources:
* [shell - How to ssh to vagrant without actually running "vagrant ssh"? - Stack Overflow](https://stackoverflow.com/questions/10864372/how-to-ssh-to-vagrant-without-actually-running-vagrant-ssh)
* [Using SSH agent forwarding - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/using-ssh-agent-forwarding)

#### Sample Vagrant file (Ubuntu 20.04)

```Vagrantfile
Vagrant.configure("2") do |config|
    # Use Ubuntu 20.04 (Focal Fossa) minimal image
    config.vm.box = "ubuntu/focal64"

    # Set the hostname for the virtual machine
    config.vm.hostname = "ubuntu-minimal"

    # Forward SSH port 22 on the guest to port 2222 on the host
    config.vm.network "forwarded_port", guest: 22, host: 2222

    # Set the provider to VirtualBox
    config.vm.provider "virtualbox" do |vb|
        # Name the virtual machine
        vb.name = "UbuntuMinimalVM"

        # Allocate memory and CPUs (optional, can be customized)
        vb.memory = "1024"
        vb.cpus = 1
    end

    # Provisioning with a shell script to install basic packages (optional)
    config.vm.provision "shell", inline: <<-SHELL
        apt-get update
        apt-get upgrade -y
    SHELL
end
```
