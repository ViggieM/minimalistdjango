---
title: Setting Up MCP Servers for Claude Code
shortDescription: Configure Model Context Protocol servers to extend Claude Code with web browsing, GitHub integration, documentation access, and more
pubDate: 2025-08-02
tags:
  - Developer Experience
keywords: mcp servers, claude code, model context protocol, github, puppeteer, context7, youtube api, development tools
---

When upgrading a Django project, you often need to check the latest documentation for packages, browse migration guides online, and manage GitHub repositories. MCP (Model Context Protocol) servers transform Claude Code into a comprehensive development assistant by adding web browsing, GitHub operations, real-time documentation access, and API integrations.

Imagine asking Claude to "upgrade my Django project to the latest version, check the release notes, and create a pull request with the changes" - with the right MCP servers, this becomes possible in a single conversation.

You can find available MCP servers at [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).

## Core MCP Servers

### Server Fetch (Web Browsing)
Fetch and extract content from any URL on the internet. Converts HTML to markdown for easy reading and analysis. Essential for checking documentation, release notes, and migration guides.

```bash
claude mcp add-json server-fetch --scope user '{
  "command": "uvx",
  "args": [
    "mcp-server-fetch"
  ]
}'
```

### Server Git (Git Operations)
Perform git operations including status, diff, commit, add, reset, log, branch management, and checkout. Allows the agent to manage your git workflow directly without switching to the terminal.

```bash
claude mcp add-json server-git --scope user '{
  "command": "uvx",
  "args": [
    "mcp-server-git"
  ]
}'
```

## Popular Integrations

### Puppeteer (Browser Automation)
Navigate websites, take screenshots, click elements, fill forms, select dropdowns, hover interactions, and execute JavaScript in the browser. Enables the agent to automatically test your web applications, track UI bugs, and verify that changes work correctly by actually interacting with the interface.

```bash
claude mcp add-json puppeteer --scope user '{
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-puppeteer"
  ]
}'
```

### Context7 (Live Documentation)
Access up-to-date documentation for any library from [Context7](https://context7.com/).

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp
```

Or via JSON configuration:
```bash
claude mcp add-json context7 --scope user '{
  "command": "npx",
  "args": [
    "-y",
    "@upstash/context7-mcp"
  ]
}'
```

### GitHub Integration
Complete GitHub operations including creating/updating issues and pull requests, managing repositories, reviewing code, running workflows, handling notifications, and searching across code/issues/PRs. Enables the agent to autonomously manage your entire GitHub workflow from creating branches to merging pull requests.

Requires a Personal Access Token from your GitHub profile settings.

```bash
claude mcp add-json github --scope user '{
  "command": "docker",
  "args": [
    "run",
    "-i",
    "--rm",
    "-e",
    "GITHUB_PERSONAL_ACCESS_TOKEN",
    "ghcr.io/github/github-mcp-server"
  ],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "github_pat_YOUR_TOKEN_HERE"
  }
}'
```

## Misc

### YouTube MCP Server Setup

WARNING: This is not an official MCP server, so check the source code first: https://github.com/ZubeidHendricks/youtube-mcp-server

Access YouTube video information, search functionality, and metadata through the YouTube Data API. Useful for analyzing video content, gathering research material, or integrating video data into your development workflow.

Generate an API key at [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

#### Standard Installation (May Not Work)
```bash
claude mcp add-json youtube-mcp-server --scope user '{
  "command": "npx",
  "args": ["-y", "zubeid-youtube-mcp-server"],
  "env": {
    "YOUTUBE_API_KEY": "YOUR_API_KEY_HERE"
  }
}'
```

#### Manual Build (Recommended)
If the standard installation fails[^1], use this manual approach:

```bash
git clone https://github.com/ZubeidHendricks/youtube-mcp-server.git
cd youtube-mcp-server
npm install
npm run build
```

Then configure with the built version:
```bash
claude mcp add-json youtube-mcp-server '{
  "command": "node",
  "args": ["/full/path/to/youtube-mcp-server/dist/index.js"],
  "env": {
    "YOUTUBE_API_KEY": "YOUR_API_KEY_HERE"
  }
}'
```

[^1]: At the time of writing, I had [this issue](https://github.com/ZubeidHendricks/youtube-mcp-server/issues/11) when setting up the YouTube MCP server.
[This comment](https://github.com/ZubeidHendricks/youtube-mcp-server/issues/11#issuecomment-3113849638) provides the solution
