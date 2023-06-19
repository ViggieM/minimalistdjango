---
layout: post
title: "Set up a VirtualBox VM"
date: 2023-06-10
published: true
author: victor
tags:
  - VirtualBox
  - ansible
  - advanced
categories:
  - Production deployment
---

Having a virtual machine (VM) locally is extremely useful to test provisioning your remote host.
This can be really useful when you plan to host your application on an external provider like [DigitalOcean](https://m.do.co/c/c40e38c3b079).
Together with ansible it will help you learn how to automate your deployment.

## Setup VirtualBox

1. Download a Ubuntu iso image and use it to set up a VM.
2. Install [VirtualBox](https://www.virtualbox.org/).
   - **Create a virtual machine**. It is important to **select "Bridged Adapter" in the Network options**. This will allow your host to communicate with the VM via TCP/IP. Configure other options (memory, disk size, etc.) as desired.
   - Optionally, I would suggest to **install the Guest Additions**. This allows you to resize the screen to the window size. First, select from the menu "Insert Guest Additions CD", then after mounting it you need to execute `autorun.sh`. After reboot you can activate from the menu "View > Autoresize Guest Display"
   - Optionally, I would also activate the **bidirectional Drag and Drop** from the menu.
3. Next, you need to **add your user to the sudoers group**, which is not done by default on installation. For this, you need to follow [these instructions](https://superuser.com/questions/1623376/how-can-i-make-my-own-account-a-sudoers-on-virtualbox/1755286#1755286):
   ```
   su -
   sudo adduser <username> sudo
   ```
   The root password is the same password as the one you selected for your user in the installation step.
4. Next, you need to allow the VM user to execute `sudo` without being prompted for a password. 
   This will allow the execution of the **ansible** tasks that require superuser privilges, without being prompted for a password.
   For this, on your VM, create a new file `/etc/sudoers.d/<username>` inside the `/etc/sudoers.d` directory with following content:
   ```
   <username> ALL=(ALL) NOPASSWD:ALL
   ```
   This is not really safe, and you could be more specific with the permissions (e.g. `ALL = NOPASSWD: /bin/apt, /bin/apt-get` ...), but we don't want to mess around with security at this point.
5. Next, you want to install an ssh server on your machine, so you can access it from your client via ssh. 
   For this, execute the following commands:
   ```
   sudo apt-get install openssh-server
   sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bck
   egrep -v "^$|^#" /etc/ssh/sshd_config | sudo tee /etc/ssh/sshd_config
   echo "Port 22" | sudo tee -a /etc/ssh/sshd_config
   sudo systemctl enable ssh --now
   ```
   Explanation:
   * The first line installs the ssh server
   * The second one copies the default configuration of the ssh server to a separate file as a backup and for later reference
   * The third line only extracts the lines in the original file that are not blank lines or comments, so we can only see the configured variables at one glance
   * The fourth line opens port 22 for ssh connections. For security reasons you could change this to any other port between 1024 and 65536, so attackers have a harder time to guess the correct port
   * The last line finally starts the ssh server and enables it to launch on startup
6. Next, you need to generate an ssh key on your host, and copy it to the VM with
   ```
   ssh-copy-id -i ~/.ssh/id_ed25519.pub <username>@<VM IP Address> -p 22
   ```

## Setup Ansible

1. [Install Ansible](https://www.google.com/search?q=install+ansible){:target="_blank"}
2. Here is a simple ansible playbook inspired by [Sample Ansible setup](https://docs.ansible.com/ansible/latest/tips_tricks/sample_setup.html#sample-setup) that installs `pyenv` in the `/opt` directory:
    <script src="https://gist.github.com/movileanuv/835a2c5e287dd1ce5b192da7f503dd3b.js"></script>

> ## 🥳 
> Now you can execute `ansible-playbook -i development site.yml` to install *pyenv* via ansible on your VM!

## Further reading:

* [Resize the Virtual Drive of a VM](https://forums.virtualbox.org/viewtopic.php?f=35&t=50661): 
  `VBoxManage modifyhd <absolute path including the name and extension> --resize 20480`


<a href="https://www.digitalocean.com/?refcode=c40e38c3b079&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"><img src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg" alt="DigitalOcean Referral Badge" /></a>