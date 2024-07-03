## Snippets

### Node

This is a minimal working service that installs dependencies and runs the dev server.

```yaml
node:
  user: node
  image: node:lts
  volumes:
    - ./src:/app
  working_dir: /app
  command: bash -c "npm ci && npm run dev:watch"
```
