# Ngrok

Ngrok is a tool that can serve your local application on the internet.
This can be useful for development purposes, such as:

- Testing your application on mobile phones
- Providing your customers with a link for testing

See more on [ngrok | API Gateway, IoT Device Gateway, Secure Tunnels for Containers, Apps & APIs](https://ngrok.com/).

## Using Ngrok

To use Ngrok you need to register on their website and obtain an [auth token](https://dashboard.ngrok.com/get-started/your-authtoken).
Then I would save that in your `.bashrc` as an environment variable:

```shell
export NGROK_AUTHTOKEN=<your token>
```

To run it you can either:

1. Install it locally and execute it from command line

    ```bash
    ngrok config add-authtoken $NGROK_AUTHTOKEN
    ngrok http http://localhost:8080
    ```

2. With Docker

    ```bash
    docker run --net=<docker-network> -it -e NGROK_AUTHTOKEN=${NGROK_AUTHTOKEN} ngrok/ngrok:latest http <docker-service-name>:<port>
    ```

3. Add it as a service in Docker Compose

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
