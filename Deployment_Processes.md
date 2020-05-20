# How Fixes and Features Move Into The Environments

## Fixes and features into the delivery environment
* Contributors can push code to the `delelop` branch of the repo and changes are automatically updated, through the use of webhooks, to the delivery environment running in OpenShift.

## Fixes and featurs into the Test Environment
* Contributors must issue a pull request (PR) from the `develop` branch to the `qa` brach.
* A member of the MAP team, with privileges can, review the PR and merge it into the `qa` branch.
* The merge event of code to the `qa` brach will trigger a webhook which will cause the `test` environment, in OpenShfit, to be updated to the revision of the code from the `qa` branch.

## Fixes and features into PROD
* When fixes or featurs have been tested in the test environment and approved by a member of the MAP team, a member of the MAP team will initiate a pull request from the `qa` branch to the `master` branch.  
* Another member of the team will review and approve the PR and merge it into the `master` branch.
    * They will also, after merging, tag the repo, following [Semantic Versioning](https://semver.org/).
* As with the delivery environment and test environment, there is a webhook configured:
    * When code is merged to the `master` branch a webhook is fired which triggers an updated of the code running in OpenShift - the latest version of the code in the `master` branch is used.


# Notes
## How to create a tag: see [Stack Overflow: Create a Tag in a GitHub Repositgory](https://stackoverflow.com/questions/18216991/create-a-tag-in-a-github-repository)
