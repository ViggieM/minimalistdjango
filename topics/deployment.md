# Deployment

### References

* [Dokploy](https://docs.dokploy.com/en/get-started/introduction): self-hosted alternative to Heroku, Fly.io, etc.
* [Dokku](https://dokku.com/docs/getting-started/installation/): self-hosted alternative to Heroku, Fly.io, etc.
* [CapRover · Scalable, Free and Self-hosted PaaS!](https://caprover.com/)
* [Django Deployments Done Right](https://www.youtube.com/watch?v=SUczHTa7WmQ)

## Guide

### Transfer code to the server

To transfer your code on the VM, you have two options: *a)* you clone it locally and copy it over with scp, or *b)* you clone the Git repository directly inside the VM.

#### Copy with `scp`

*Scp* is a fundamental linux command that copies files between hosts on a network. The basic syntax for *scp* is:

```bash
scp -r -P <port> ./* <user>@<host>:/path/to/target/directory
```

This will copy all files and directories recursively (`-r` flag) from your current directory to the remote host (your VM).
**The downside is that your project's directory might include files that are only supposed to be for local usage**, like `.env` files, static files, build output, etc.
Therefore, you might want to check out your repository into a separate directory first and then copy the files from there to the remote host.

#### Clone from the VCS

You need to install [git](https://github.com/git-guides/install-git) on your VM and get your code from *GitHub* to the remote machine.
If your GitHub repository is **public**, you can access it from the VM without any problems.
But in case your repository is **private**, you have two options:

1. You generate an **ssh private key** on your VM and [add it to the accepted SSH Keys in your GitHub Account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
2. You generate an **access token** in your GitHub Account for the repository

The downside of the first approach is that this key will have access to all of your GitHub repositories.
The second approach requires to go through a bit of documentation, but it is probably the safer method.

##### Generate an access token for a repository

1. Go to [Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Generate a **personal access token (classic)** with repo scope enabled.
  ![Select the checkbox 'repo' to create an access token with 'read' rights](/media/github-access-token.png)


Now you can clone the repository to the remote host like this:

```bash
git clone --branch <branch or tag> --depth 1 https://MY_TOKEN@github.com/user-or-org/repo
```
