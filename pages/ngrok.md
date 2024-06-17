Ngrok is a tool that can serve the application that you host on your computer publicly.
This can be particularly useful for:

- Testing your application on mobile phones
- Providing your customers with a link for testing

## Using Ngrok

To use Ngrok you need to register on their website and obtain an auth token.
Then you have three possibilities:

1. Install it on your computer and execute it from command line
2. Execute it with Docker
3. Add it as a service to your Docker Compose file

### Bash One-Liner with Docker

```bash
docker run --net=<docker-network> -it -e NGROK_AUTHTOKEN=${ngrok_token} ngrok/ngrok:latest http <docker-service-name>:<port>
```

### Docker Compose service

```yaml
ngrok:
  image: ngrok/ngrok:latest
  ports:
    - '4040:4040'
  # you can go to http://localhost:4040/ to see the ngrok dashboard and the link
  tty: true
  command: "http <docker-service-name>:<port>"
  environment:
    NGROK_AUTHTOKEN: ${NGROK_AUTHTOKEN:-}
```
