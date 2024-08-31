# SSH

## Cheatsheet

### Configure an SSH Server

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

Then, copy the ssh key to the VM with:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub <username>@<VM IP Address> -p 22
```

Now, you can connect to the VM via SSH with

```bash
ssh <username>@<VM IP Address>
```
