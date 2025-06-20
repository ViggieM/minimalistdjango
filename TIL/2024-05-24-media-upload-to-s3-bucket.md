---
title: Upload media files to an S3 Bucket
pubDate: 2024-05-24
tags:
  - DevOps
shortDescription: A guide on configuring Django to store media files in S3, including local development setup with Localstack and Terraform.
---


Let's take this Django model:

```python
class Profile(models.Model):
    image = models.ImageField(upload_to="media/")
```

The easiest way to save the uploaded files to disk would be by setting the `MEDIA_ROOT` and `MEDIA_URL` settings,

```python
MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), "mediafiles")
MEDIA_URL = "/media/"
```

and extend the `urlpatterns` with

```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
  ...
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

However, this is [only suitable for development](https://docs.djangoproject.com/en/5.0/howto/static-files/#serving-files-uploaded-by-a-user-during-development).
Serving the media files in production requires a dedicated server, such as [nginx](/tools/nginx.md).
Or, in this case, we can make use of S3 to store the uploaded media files, and let AWS serve them for us.

## Upload files with curl

I created a nice little REST endpoint to upload files via following curl command:

```bash
curl -X POST -F "image=@/path/to/image.jpg" http://127.0.0.1:8000/api/profiles/
```

This will upload the image in a folder called "images/" in the path specified by the `MEDIA_ROOT` setting.

### Serializer and ViewSet (built with Django REST Framework)

```python
from rest_framework import serializers, viewsets

from app.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = Profile
        fields = "__all__"


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
```


### Urls.py

```python
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from app import views

router = DefaultRouter()
router.register("profiles", views.ProfileViewSet)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## Simulate and S3 Bucket with Localstack

I installed [Localstack](../tools/localstack.md) with `pip install localstack` in my virtual environment and launched it with `localstack start`.
Last time I wrote about it, I used [serverless](https://www.serverless.com/) to set up a s3 Bucket locally.
But now I realized it requires an account, and login, to run a serverless script.

So I wrote a small [Terraform](../tools/terraform.md) file to provision an S3 bucket (`main.tf`):

```tf
resource "aws_s3_bucket" "test-bucket" {
  bucket = "my-bucket"
}
```

To apply the configuration, I executed

```bash
tflocal init
tflocal apply
```

See here for more information: https://docs.localstack.cloud/user-guide/integrations/terraform/

## Configure django-storages and boto3

I installed [django-storages](https://django-storages.readthedocs.io/en/latest/index.html) and reduced the configuration to following minimal configuration:

```python
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            "bucket_name": "my-bucket",
            "endpoint_url": "http://localhost:4566",
            "file_overwrite": False,
        },
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}
```

This makes sure that the staticfiles configuration remains untouched, and we can only work on the media files setting.
Some remarks:

* The `endpoint_url` setting is only required because we access the localstack S3 bucket. This option should not be set for production.
* The `file_overrite` setting makes sure that when an image is uploaded that has the same name as an existing image in the bucket, it will not overwrite the existing one. Instead, it will append a random characters string to the file name.


## Pitfalls

* AWS is notoriously expensive. So you need to know what you are doing, otherwise your next bill might surprise you.
* Setting up an S3 on AWS is slightly more complicated, but there are plenty of resources online on how to do it, for example: https://testdriven.io/blog/storing-django-static-and-media-files-on-amazon-s3/
  It basically boils down to:
  1. Create a new bucket in AWS
     - Block all public access
  2. Create IAM Group
  3. Create IAM User
  4. Create Access Key and make sure they are present in your environment as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
