---
title: "Set up a VirtualBox VM"
tags:
  - VirtualBox
categories:
  - Running in Production
---

Having a virtual machine (VM) locally can be useful to test how to provision and deploy your application to a remote host,
for example a Droplet on DigitalOcean.

## Install Ubuntu

I downloaded the Ubuntu iso image from [ubuntu.com](https://ubuntu.com/download).
Then I followed the instructions on how to install [VirtualBox](https://www.virtualbox.org/).
I customized following settings after the installation:

I selected **"Bridged Adapter" in the Network options**. This allows my host to communicate with the VM via TCP/IP, so I can ssh into it, or access it by its IP Address.

I configured some of the other options, like memory, disk size, etc. The disk size was particularly unintuitive, and I had to look it up on Google how it works.
  I found following Question in the VirtualBox forum: [Resize the Virtual Drive of a VM](https://forums.virtualbox.org/viewtopic.php?f=35&t=50661), which boils down to this command:

```bash
VBoxManage modifyhd <absolute path including the name and extension> --resize 20480
```

I installed the **Guest Additions**. This allows me to resize the VM screen to the window size. I selected from the menu "Insert Guest Additions CD", then after mounting it I had to execute `autorun.sh`. After reboot, I could activate it from the menu "View > Autoresize Guest Display"

I activated the **bidirectional Drag and Drop** from the menu, to allow me to easily copy files from the host to the VM and back.

## Configure SSH Server

Next, I installed an ssh server on the client, so I can access it from my host via ssh.
For this, I had to execute the following commands:

```bash
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

Then, on my host, I copied my ssh key to the VM with

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub <username>@<VM IP Address> -p 22
```

Now, I can connect to my VM via SSH with

```bash
ssh <username>@<VM IP Address>
```
