---
title: Minimal Gerrit Workflow with Docker and Git for agentic coding
shortDescription: Set up a local Gerrit instance with Docker, configure SSH access, and push code for review. Could be useful for agentic coding
pubDate: 2025-06-12
---

I wanted to experiment with a workflow that lets an AI write and push code to Version control, where I can review it, and the AI reads those code reviews and acts on them.
I heard a long time ago about Gerrit, a code review tool built on top of Git.
More specifically, Gerrit works with reviews on commit basis, which I don't have much experience with, but is an interesting concept nonetheless.
I would say that as a takeaway, I didn't find it particularly helpful for a smoother workflow with AI agents, but still, it was nice to play with it.

## Start Gerrit in Docker

```bash
docker run -ti -p 8080:8080 -p 29418:29418 gerritcodereview/gerrit
```
Runs Gerrit in a Docker container, exposing the web UI on port 8080 and SSH on 29418.

## Add SSH key to Gerrit via API

```bash
curl -u admin:secret \
     -X POST \
     -d '{"ssh_public_key": "'"$(cat ~/.ssh/id_rsa.pub)"'"}' \
     http://localhost:8080/a/accounts/admin/sshkeys
```
Uploads your public SSH key to the admin account using Gerrit’s REST API.
Unfortunately this does not work, so you need to add them manually on http://localhost:8080/#/settings/ssh-keys

## Create a new project in Gerrit

```bash
ssh -p 29418 admin@localhost gerrit create-project vibecode --branch main
```

Creates a new project named vibecode with a default main branch.

## Clone the repository over SSH

```bash
git clone ssh://admin@localhost:29418/vibecode
```

Clones the newly created project from the Gerrit server.

## Install Gerrit's commit-msg hook

```bash
curl -Lo `git rev-parse --git-dir`/hooks/commit-msg http://localhost:8080/tools/hooks/commit-msg && chmod +x `git rev-parse --git-dir`/hooks/commit-msg
```

Downloads and installs the commit-msg hook required to add Change-Id to commit messages.

## Push a commit for review

```bash
git push origin main:refs/for/main
```
Pushes the current branch to Gerrit for code review.

## Query a change and its comments

```bash
ssh -p 29418 admin@localhost gerrit query --comments --current-patch-set 27eac4ed28b66d45e0ad30e795dda14ba70925d3
```
