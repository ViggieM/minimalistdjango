# Set up Litestream

I tried to prove how easy it is to set up [Litestream](/tools/litestream.md) to sync a sqlite database to s3 bucket.
Here is an easy local setup to follow through:

## The Docker Compose file

We have two services:
* The web service, that serves our Django application
* The litestream service, that uses the docker image

```yaml
services:
  x-common-variables: &common-variables
    SQLITE_DB: /srv/app/db.sqlite3

  web:
    build: .
    command: python src/manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/srv/app
    environment:
      <<: *common-variables
    ports:
      - "8000:8000"
    depends_on:
      - litestream

  litestream:
    image: litestream/litestream
    environment:
      <<: *common-variables
      LITESTREAM_ACCESS_KEY_ID: ${ACCESS_KEY_ID:-}
      LITESTREAM_SECRET_ACCESS_KEY: ${SECRET_ACCESS_KEY:-}
      LITESTREAM_BUCKETNAME: ${S3_BUCKET_NAME:-}
      BUCKET_REGION: ${S3_BUCKET_REGION:-}
    volumes:
      - .:/srv  # the sqlite DB lies in the project root, so we need to mount the volume
      - ./litestream.yaml:/etc/litestream.yml  # litestream requires .yml file ending
      - ./litestream_entrypoint.sh:/litestream_entrypoint.sh
    entrypoint: "/litestream_entrypoint.sh"
```

The environment variables `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY` and `S3_BUCKET_NAME` are

## The Litestream configuration file

The `litestream.yml` file needs to be mounted inside the `/etc` directory, so Litestream will detect it automatically.
Note that Litestream requires at the time of writing that the file ending is `.yml`, not `.yaml`, otherwise it will not detect it.

```yaml
dbs:
  - path: ${SQLITE_DB}
    replicas:
      - url: s3://${S3_BUCKET_NAME}/db.sqlite3
        region: ${S3_BUCKET_REGION}
```

## The entrypoint

The entrypoint script makes sure that the database is restored from the S3 Bucket on startup, in case it is not already present.

```shell
#!/bin/sh
set -e

# Restore the database if it does not already exist.
if [ -f ${SQLITE_DB} ]; then
  echo "Database already exists, skipping restore"
else
  echo "No database found, restoring from replica if exists"
  litestream restore ${SQLITE_DB}
fi

# Run litestream with your app as the subprocess.
exec litestream replicate
```

## Final words

You can now start your Django application, populate the sqlite DB with data, and you will see in the logs of the Litestream service how the data is synced to the S3 Bucket.
Try to delete the local sqlite DB file, and restart the docker services, then you will see how the sqlite database is restored from S3.
