---
title: "Simulate an S3 Bucket Locally with LocalStack"
pubDate: 2023-09-08
shortDescription: "A guide to setting up LocalStack for local S3 development, including serverless configuration and Django integration"
image:
    url: "/media/TIL/2023-09-08-localstack/aws-meme.png"
    alt: "aws meme, bear trap, fly trap"
tags:
  - DevOps
keywords: localstack, s3, aws simulation, serverless, boto3, local development
---


## Install Localstack

> [LocalStack](https://docs.localstack.cloud/getting-started/) is a cloud service emulator that runs in a single container on your laptop or in your CI environment. With LocalStack, you can run your AWS applications or Lambdas entirely on your local machine without connecting to a remote cloud provider!

You can install it with pip (make sure you use pyenv).

```bash
pip install localstack
localstack start
```

## Serverless configuration

The [Serverless Framework](https://www.serverless.com/framework/docs/getting-started) allows you to deploy services on AWS with an easy configurable `serverless.yml` file.
Install *serverless* globally, since you might want to use it in different projects.

```bash
npm install -g serverless serverless-deployment-bucket serverless-localstack
```

Here is a simplified `serverless.yml` file that sets up an S3 bucket locally:

```yaml
service: my_app
plugins:
  - serverless-deployment-bucket
  - serverless-localstack

provider:
  name: aws
  stage: ${opt:stage,'local'}
  region: eu-west-1

custom:
  localstack:
    stages: [local]

resources:
  Resources:
    archiveBucket:
      Type: AWS::S3::Bucket
      Properties:
        # https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html
        BucketName: archive-bucket

```

To deploy your serverless configuration, set up the following `Makefile` and run `make deploy`.

```makefile
deploy:
	SLS_DEBUG=1 serverless deploy --stage local
```

Install (globally) `aws-shell` and `awscli-local`, and list your buckets and files with:

```bash
pip install aws-shell awscli-local
awslocal s3 ls
awslocal s3 ls archive-bucket
```

## Access the local S3 bucket from inside your Django app

[Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) is the AWS SDK for Python that you can use to access AWS services.

```bash
poetry add boto3
```

To use it with LocalStack, we need to change the default endpoint url for boto3 to our local one, [http://localhost:4566](http://localhost:4566).
We also want to pass in the name of the bucket through the `S3_BUCKET` environment variable, to keep it flexible.
Both in production and development, boto3 requires the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to function,
but for LocalStack [IAM is not enforced in the free version](https://docs.localstack.cloud/user-guide/aws/iam/#enforcing-iam-policies), so we can set it to a random string.

```python
def get_client(resource):
    kwargs = {}
    if os.environ.get("ENDPOINT_URL"):
        os.environ["AWS_ACCESS_KEY_ID"] = ""
        os.environ["AWS_SECRET_ACCESS_KEY"] = ""
        kwargs["endpoint_url"] = os.environ.get("ENDPOINT_URL")
    return boto3.client(resource, **kwargs)

S3_BUCKET = os.environ.get("S3_BUCKET")
s3 = get_client("s3")
s3.put_object(Bucket=S3_BUCKET, Key="file.txt", Body="Hello, World!")
```

Now you can look at your file that you have uploaded with:

```bash
awslocal s3 cp s3://archive-bucket/file.txt ./file.txt
```
