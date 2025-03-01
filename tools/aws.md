---
title: aws
---

## AWSCLI (v2)

* `aws configure list-profiles` lists the profiles configured in `~/.aws/config`
* `aws sts get-caller-identity` can be used to verify if the authentication was successful
* `export AWS_PROFILE=${aws_profile}` sets the currently active AWS profile in the active shell, so you don't have to specify it for every command with `--profile`
* `aws iam get-role --role-name CodeDeployServiceRole --query "Role.Arn" --output text` get details of a role
* `aws iam create-role --role-name ${role_name:CodeDeployDemo-EC2-Instance-Profile} --assume-role-policy-document file://${role_file:CodeDeployDemo-EC2-Trust.json}` create role

### AWS SSO

* `rm -rf ~/.aws/sso/cache` might be useful

#### file: `~/.aws/config`

```
[profile AdministratorAccess-${sso_account_id}]
sso_session = ${sso_session}
sso_account_id = ${sso_account_id}
sso_role_name = AdministratorAccess
[sso-session ${sso_session}]
sso_start_url = https://d-9067e4bb5f.awsapps.com/start/#
sso_region = us-east-1
sso_registration_scopes = sso:account:access
[default]
region = us-east-1
output = json
```
