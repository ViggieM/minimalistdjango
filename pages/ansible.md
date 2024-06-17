Ansible is a pretty good tool to provision virtual machines. These could be:

* Droplets on DigitalOcean
* EC2 Instances on AWS
* VM Instances on Google Cloud Platform (GCP)
* Linodes on Linode
* Virtual Machines on Microsoft Azure
* ...

Even though it is quite verbose, ...

<script src="https://gist.github.com/movileanuv/835a2c5e287dd1ce5b192da7f503dd3b.js"></script>

The inventory specifies a hostname that is addressed in the playbook as `hosts: vbox`. This tells Ansible which hosts to run this playbook on.
There are three other parameters specified for the host:

* **ansible_host**: this is the IP address of the node that ansible will ssh to to execute the playbook
* **ansible_port**: this is the port for the ssh connection
* **ansible_become**: this instructs ansible to become a specific user on the remote host during playbook execution. By default this is **root**. Since most of the commands require superuser privileges, I would rather specify it here than for each task repeatedly, and only in case I need less privileges to perform an action, I specify it per task level.
