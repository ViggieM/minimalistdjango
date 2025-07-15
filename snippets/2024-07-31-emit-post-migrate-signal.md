---
title: Force the Creation of Permission Objects Associated with Models During Migration
pubDate: 2024-07-31
shortDescription: How to force Django to create default model permissions during migrations using emit_post_migrate_signal
tags:
  - Django
keywords: django migrations, permissions, post-migrate signal, data migrations, groups
---

Django models come with default permissions associated with them. Whenever a new Model is created in the database, there are also 4 [default permissions](https://docs.djangoproject.com/en/5.0/topics/auth/default/#default-permissions) that are created in the `auth_permission` table:

*   `add_${modelName}`

*   `change_${modelName}`

*   `delete_${modelName}`

*   `view_${modelName}`


These entries in the `auth_permission` table are created **after** the migrations are executed, when the _post\_migrate_ signal is emmited. Sometimes we need to create data migrations that creates certain Groups, and attaches permissions to them. But when no permission objects have been created, we can't select and attach them to groups during the migraion.

This is where one method in Django comes in handy, `emit_post_migrate_signal`.

```python
from django.core.management.sql import emit_post_migrate_signal

def forward_migrate(apps, schema_editor):
    emit_post_migrate_signal(verbosity=2, interactive=False, db="default")
    # now you can select the Permissions from the DB
```

I actually had to google how to do it quite a few times, so I decided to make a snippet out of it, so I can find it faster next time.
