# VirtualBox

VirtualBox allows you to spin up virtual hosts on your local computer.
This can be useful to test how to provision and deploy your application to a remote host,
for example a Droplet on DigitalOcean.

## Install

Installation instructions can be found on the official website, [virtualbox.org](https://www.virtualbox.org/).
Ubuntu iso images can be downloaded from [ubuntu.com](https://ubuntu.com/download).

## Cheatsheet

* Select **"Bridged Adapter" in the Network options** to communicate with the VM via TCP/IP, so you can ssh into it, or access it by its IP Address.
* Install the **Guest Additions**. This allows you to resize the VM screen to the window size. Steps:
  * Select from the menu "Insert Guest Additions CD"
  * execute `autorun.sh`
  * After reboot, activate from the menu "View > Autoresize Guest Display"
* activate the **bidirectional Drag and Drop** from the menu. This allows you to easily copy files from the host to the VM and back.


### Add User to sudoers group

```bash
su -  # The root password is the same password as the one as the one selected for the user in the installation step of Ubuntu.
sudo adduser <username> sudo
```
Source: [How can I make my own account a sudoers on VirtualBox?](https://superuser.com/questions/1623376/how-can-i-make-my-own-account-a-sudoers-on-virtualbox/1755286#1755286)

Next, I usually allow the VM user to execute `sudo` without being prompted for a password.
This enables the execution of Ansible tasks that require superuser privileges, without being prompted for a password.
For this, on the VM, I create a new file `/etc/sudoers.d/<username>` inside the `/etc/sudoers.d` directory with following content:

```
<username> ALL=(ALL) NOPASSWD:ALL
```


### Resize the virtual disk size

```bash
VBoxManage modifyhd <absolute path including the name and extension> --resize 20480
```
Source: [Resize the Virtual Drive of a VM](https://forums.virtualbox.org/viewtopic.php?f=35&t=50661)
