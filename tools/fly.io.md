1. Install flctl ([official documentation](https://fly.io/docs/hands-on/install-flyctl/))
2. Sign up to fly with: `fly auth signup`
3. Execute `fly launch`: This will generate some additional files that will allow you to deploy your application with `fly deploy`.
  It will also automatically generate a `SECRET_KEY` environment variable for you, so you don't need to take care of that.
4. Deploy your app with `fly deploy`
