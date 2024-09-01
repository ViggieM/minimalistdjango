# Ansible

Ansible is a pretty good tool for provisioning.


## Installation

I suggest to install Ansible via pipx.


## Cheatsheet

```bash
# execute a playbook
ansible-playbook -i <inventory name> -e user=<remote username> playbook.yml
# encrypt variable with ansible-vault
ansible-vault encrypt_string --encrypt-vault-id ${vaultId} ${variableValue}
```

### Inventory file

The inventory file will specify the hosts the Playbook will be executed on.
For this I followed the simplest pattern, as suggested in the [Ansible Documentation](https://docs.ansible.com/ansible/latest/tips_tricks/sample_setup.html#sample-setup):
The inventory specifies a hostname that is addressed in the playbook as `hosts: vbox`. This tells Ansible which hosts to run this playbook on.

```bash
touch development
echo "vbox ansible_host=<IP Address of the VM> ansible_port=<SSH port of the VM> ansible_become=true" >> development
```

* **IP Address of the VM**: You can find out the IP Address of the VM by executing `ip a s`
* **SSH port of the VM**: The SSH port is 22 by default, but can be changed, to increase security
* **ansible_become**: this instructs ansible to become a specific user on the remote host during playbook execution.
  By default, this is **root**.
  Since most of the commands require superuser privileges, I would rather specify it here than for each task repeatedly,
  and only in case I need less privileges to perform an action, I specify it per task level.


### Sample playbook

This is a playbook for installing Pyenv on a VM. Put the content inside a file, "playbook.yaml":

```yaml
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
