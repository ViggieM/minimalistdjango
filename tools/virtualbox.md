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


### Resize the virtual disk size

Source: [Resize the Virtual Drive of a VM](https://forums.virtualbox.org/viewtopic.php?f=35&t=50661)

```bash
VBoxManage modifyhd <absolute path including the name and extension> --resize 20480
```
