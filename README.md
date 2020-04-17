# Translink Router APP

| Sections |
| --- |
| [TL'DR](#tldr) |
| [- Preparation Work](#preparation-work)|
| [- Provision the ImageStream Builds](#provision-the-imagestream-builds)|
| [- Provision Components in the Operational Environment](#provision-necessary-components-in-the-operational-environment) |
| [- Create a Webhook on Github](#create-a-webhook-in-the-associated-github-repo-and-modify-the-associated-webhook-secrete-in-the-namesapce) |
| [-------------------------------------------------------------------]() |
| [How Does all this work?](#how-does-all-this-work) |
| [- The Basic App](#the-basic-app) |
| [- What are the all the parts](#what-are-all-the-parts) |
| [- OpenShift Overview](#openshift-overview) |
| [-------------------------------------------------------------------]() |
| [What are the Parts - more Detail](#what-are-the-parts---more-detail) |
| [- BuildConfigs](#buildconfigs) |
| [- Deployment](#deployment) |
| [-------------------------------------------------------------------]() |
| [A Word about other resources](#a-word-about-other-resources) |
| [A word about templates](#a-word-about-templates) |
| [Provisioning the BuildConfig](#provisioning-the-buildconfigs) |
| [Provisioning the deployment and other objects](#provisioning-the-deployment-and-other-objects) |
| [Create the ConfigMap for the `apikey` and map into the Deployment](#create-the-configmap-for-the-apikey-and-map-into-the-deployment) |
| [Update the webhook secret and create a webhook on github.](#update-the-webhook-secreat-and-create-a-webhook-in-the-github-repo) |

## TL'DR
* Image Builds and ImageStreams reside in your **tools** namespace
* All other objects reside in you operational environment.
* There is an `apikey` that is not stored in the code repository.  The `apikey` is required to access online Geocoder and online Route Planner APIs.  This `apikey` is manually added to a config map in the appropriate namespace and mapped into the deployment.
* There is an additional post-provisioning step: you must configure webhooks in the github repo and update the webhook key in the corresponding namespaces secrets.

## Preparation Work
1. You will need to create a Persistent Volume (PV) in the operational environment (dev, test, or prod)- This has to be done before provisioning any object in the respective namespace - the Persistent Volume Claim (PVC) will not find the PV to use.

2. The name you choose for the Persistent Volume will be used later when provisioning resources. See **Provisioning the Deployment and other objects**


## Provision the ImageStream Builds
### In your TOOLS namespace

#### Create the necessary ImageStreams (IS)

##### Create the `caddy-build` IS

```bash
oc create imagestream caddy-build -n wvmyix-tools
imagestream.image.openshift.io/caddy-build created
```

##### Create the `caddy-run` IS

```bash
oc create imagestream caddy-run -n wvmyix-tools
imagestream.image.openshift.io/caddy-run created
```

#### Provision BuildConfigs in your `tools` namespace

```bash
oc process -f caddy-bc.template.yaml -o yaml \
 | oc apply -n wvmyix-tools -f -
buildconfig.build.openshift.io/caddy-run created
buildconfig.build.openshift.io/caddy-build created
```

**Note:** You will need to trigger a build of both of these.

## Provision necessary components in the operational environment.

```bash
oc process -f caddy-smk.template.yaml -o yaml \
 --param-file=trp-caddy.env \
 --param-file=trp-service.env \
 --param-file=trp-route.env
 | oc apply -n wvmyix-test -f -
deployment.extensions/caddy-deployment created
persistentvolumeclaim/caddy-site unchanged
service/trp-service created
configmap/caddyfile created
secret/tlink-webhook-key created
route.route.openshift.io/translink-trp-test created
```

### Ensure the `default` user in the destination environment has the correct privileges in the `tools` namespace

* Grant the `system:image-puller` privileget to the `default` account from the operational environment, in the `tools` namespace.

### Create a ConfigMap and add it to the deployment.

* I manually created the configmap. The template could be modified to accept a parameter which is the `apikey` and add/mount the configMap into the deployment.  

 | Config Map | Key | Mount Point | mount filename |
 | --- | --- | --- | --- |
 | api-key | api-key | `/app/smk/trp/config/key/` | `route-planner.json` |

```YAML
{
  "tools": [
    {
      "type": "directions",
      "routePlannerService": {
        "apiKey": "PLACE THE KEY HERE"
      }
    }
  ]
}
```
#### _Note:_
The very fist time you start the caddy pod and it mounts the empty PVC the startup will fail:
* the pod starts,
* the containers start (init continer then the longrunning container),
* the configmap is mounted readonly,
* the source code for the smk app is pulled and fails to overwrite the readonly file (with a dummy file)!

To resolve this you will need to mount the configMap only after the pod has successfully started. The pod will have started, the source code will be pulled to the latest version and that state persisted on the PVC.  All subsequent starts of the pod, with the configMap now mounted will succeed.

### Create a webhook in the associated github repo and modify the associated webhook secrete in the NameSapce.


#### Create the webook in the github repo
You will need admin privileges on the github repo in question.
Navigate to `Settings-> WebHooks` and click the **Add webhook** button.

| Payload URL | Content Type | Secret |
| --- | --- | --- |
| https://translink.apps.gov.bc.ca/webhook| `application/json` | _the key you will generate in openshift_ |

#### Create the needed secret in the namespace

| Secret Name | secret key | secret value |
| --- | --- | --- |
| `tlink-webhook-key`| `caddy.webhook`| _you can generate this when you create the key_ |

To understand how the Webhook on github, the secret and the caddy server all fit together, look at the **configMap** below and the **Environment** specified in `caddy-deployment`.

`caddyfile`:
```json
0.0.0.0:8080 {
git {$siteRepo} /app/smk/trp {
 branch {$branch}
 hook {$hookPath} {$hookKey}
}
root /app/smk
gzip
log stdout
errors stdout
}
```

----

# How does all this work?

I'll break it down to a few layers.

## The Basic App

* SimpleMapKit (SMK) apps are essentially Single Page Apps (SPAs) - a single `index.html` containing references to JavaScript code, images, and style Sheets.

* There is _some_ http server that hosts/serves this index.html page.

* The App gets download/loaded into a user's web browser.  The "running code" then communicates with APIs to get data and render the data in the user's browser.

Simple as that.

## What are all the parts

* The source code is maintained in a repository on GitHub.
* The running application is hosted in OpenShift.
* Traffic requests to the app go through the Kong API Gateway.
* The app makes use of the BC Gov Online Geocoder and Online Route Planner applications.

## OpenShift Overview

* OpenShift is a platform that allows for the automation of provisioning of **ubiquitous resources**.

* OpenShift is a layer enhancements and functionality on top of Kubernetes.

* There are 3 ways to interact with OpenShift

  * The Graphical user Interface
  * The command line interface (cli)`oc`
  * The REST API


  Pressing buttons, clicking on drop-down list boxes, and poking characters into boxes does not scale.

  We use Automation leveraged by the API or the `oc` command -- we prefer the `oc` command.

* These ubiquitous resources can be configured and managed through the use of configuration files in YAML format.

* Examples of **ubiquitous resources** are:

  * Build Images / Image Streams
  * Build Configs
  * Deployment Configs
  * Deployments
  * Services
  * Routes
  * ConfigMaps
  * Persisten Volumes and Persistent Volume Claims
  * Secrets

# What Are the Parts - more detail

_This is from an infrastructure perspective_

## BuildConfigs

Again, the apps is a Single Page App with code that is served by some http server.

The code for the APP will likely vary much more than the code that http server is built from. Another way to say it: "you're not going to be  updating Apache or NGNX as often as the code for the webapp you are developing."

With the containerization model we "build images that combine all the elements necessary to run the application".  We could create a container which builds the http server in one layer (compiles it from source or even installs it using your preferred package manager), then add our application in another step.  This would require an entire rebuild of everything every time we want to rebuild our app; even fixing a simple spelling mistake or fixing a teeny bug would require a complete end to end rebuild of the image.  

This is wasteful.

Here we are using the ability of OpenShift to operate 2 containers in a pod.  

* A pod can run one container or more than one.  When 2 containers run in a pod, they share disc.
* One container is an Init container that simply does something before the _main_ container starts.
* the other container is the _main_ container which is long running.

##### The pattern used in this app is:

* We use the init container to "inject" the required app files -- the `index.html`, `images`, and `css` files.  These resources are simply downloaded from github and place in a folder that is shared between containers running in the pod.

* Once the Init container finishes the main container starts - Here this is a **caddy** container.  It starts and begins serving the application.

##### So there are 2 Builds that create these two images.

* One build creates the image that is the Init container - its job is to pull the correct version of the code from github and place it in a folder. Now this can be confusing: This build, builds the image that is the init container.  when that image runs (in a pod), only then does it pull the `smk` code.

* One build creates the image that is our version of **caddy** - we only require certain capabilities so we compile our own version of caddy.  This is like building Apache once and running the binary.

### _Builds and the resulting images reside in the `tools` namespace_

## Deployment

The Deployment simply orchestrates the creation of pods.  Through Environment parameters the pod will start, the init container will run and do its job, pulling the correct version of the application saving it to a folder, the next container simply runs **caddy** which serves the application.

## A Word about other resources

At this time I won't cover them here.  Red Hat has excellent documentation on these things.  Note, be sure, when you are reading, that you are reading the correct versions -- The OpenShift platform has different version and the capabilities change between versions.  ATM I am using `3.11.59`

## A word about templates

* I use templates to provision resources.
* Templates are text files in YAML format.
* They can accept parameters, so you can _vary_ parts of the configuration such as the name or label applied to resources, or the version, say of an ImageStream.

## Provisioning the BuildConfigs

They are simple enough, so I used the default values.

You can see the variables with the following command:

```bash
process -f caddy-bc.template.yaml --parameters
NAME                          DESCRIPTION                                        GENERATOR           VALUE
CADDY_BUILD_CONFIG_NAME       The name of the Caddy Build Config to be created                       caddy-build
CADDY_RUN_BUILD_CONFIG_NAME   The name of the Build Config to be created                             caddy-run
```

## Provisioning the deployment and other objects

The template creates a number of objects each with parameters.

* deployment
* Persistent Volume Claim
* Service
* Route
* ConfigMap
* Secret

I built the application by working on each component individually as a template, then combining them together.  With that I created parameter files containing the values I wanted, rather then providing these on the command line.

You will likely have noted the different parameter files when I described how to provision the deployment:

```bash
oc process -f caddy-smk.template.yaml -o yaml \
 --param-file=trp-caddy.env \
 --param-file=trp-service.env \
 --param-file=trp-route.env
 | oc apply -n wvmyix-test -f -
deployment.extensions/caddy-deployment created
persistentvolumeclaim/caddy-site unchanged
service/trp-service created
configmap/caddyfile created
secret/tlink-webhook-key created
route.route.openshift.io/translink-trp-test created
```

I'll list these here:

`trp-caddy.env`

```bash
DEPLOYMENT_NAME=caddy-deployment
APP_LABEL=trp-caddy
CLIENT_NAME=tranlink
SITE_LABEL=trp
SITE_REPO=https://github.com/bcgov/smk-tlink
BRANCH=develop
CONTAINER_IMAGE=docker-registry.default.svc:5000/wvmyix-tools/caddy-run
CONTAINER_IMAGE_LABEL=latest
INIT_CONTAINER_IMAGE=docker-registry.default.svc:5000/wvmyix-tools/caddy-build
INIT_CONTAINER_IMAGE_LABEL=latest
CONFIG_MAP_NAME=caddyfile
PERSISTENT_VOLUME_NAME=caddy-site
```

`trp-service.env`

```bash
SERVICE_APP_LABEL=trp-caddy
SERVICE_NAME=trp-service
SERVICE_SELECTOR=trp-caddy
```

`trp-route.env`

```bash
ROUTE_NAME=translink-trp-test
ROUTE_HOSTNAME=translink-t.apps.gov.bc.ca
```

## Create the ConfigMap for the apikey and map into the Deployment

I describe this in the **Prepartion Work** Section

## Update the webhook secreat and create a webhook in the github repo.

I also described this in **Prepartion Work**
