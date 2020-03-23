# Translink Router APP

## TL'DR

* Image Builds and ImageStreams reside in your **tools** namespace

* All other objects reside in you operational environment.

## Initial Work

* You will need to create a Persistent Volume in the opeartional environment - This has to be done before the second step above as the PVC will not find a PV to use.
* The name you choose for the Persisten Volume will be used later when provisioning resources. See **Provisioning the Deployment and other objects**

### 

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

### Provision necessary components in the operational environment.

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

----

# How does all this work?

I'll break it down to a few layers.

## The Basic App

* SimpleMapKit (SMK) apps are essentially Single Page Apps (SPAs) - a single `index.html` containing references to JavaScript code, images, and style Sheets.

* There is _some_ http server that hosts the page.

* The App communicates with APIs to get data and render it in the user interface.

Simple as that.

## What are all the parts

* The source code is maintained in a repository on GitHub.

* The running applicaiton is hosted in OpenShift.

* Traffic requests to the app go through the Kong API Gateway.

* The app makes use of the BC Gov Geocoder and Router application.

## OpenShift Overview

* OpenShift is a platform that allows for the automation of provisioning of ubiquitous resources.

* OpenShift is a layer of improvement on Kubernetes.

* There are 3 ways to interact with OpenShift
  
  * The Grafical user Interface
  
  * The command line inerface (cli)`oc` 
  
  * The API

* Pressing buttons, clicking on drop-down list boxes, and poking characters into boxes does not scale. Hence we use automation leveraged by the API or the `oc` command -- we prefer the `oc` command. 

* These ubiquitous resources can be configured and managed through the use of configuration files in YAML format.

* Examples of resources are:
  
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

The code for the APP will likely vary much more than the code that http server is built from.

With the containerization model we build images that combine all the elements necessary to run the application.  We could create a container which builds the http server in one layer, then adds our application in another.  This would require an entire rebuild of everything when we fix a simple spelling mistake or fix a bug.  

Here we are using the abilit of OpenShift to operate 2 containers in a pod.  

* one container is an Init container that simply does something before the _main_ container starts.

* the other container is the _main_ container which is long running.

##### The pattern in this app is:

* we use the init container to "inject" the required app files -- the `index.html`, `images`, and `css` files.  These resources are simply downloaed from github and place in a folder that is shared between containers running in the pod.

* Once the Init container finishes the main container starts - Here this is a **caddy** container.  It starts and begins serving the application.

##### So there are 2 Builds that create these two images.

* one creates the image that is the Init container - its job is to pull the correct version of the code from github and place it in a folder.

* One creates the image that is our verions of **caddy** - we only require certain capabilites so we compile our own version of caddy.

##### Builds and the resulting images reside in the `tools` namespace

## Deployment

The Deployment simply orchestrates the creation of pods.  Through Enviornment parameters the pod will start, the init container will run and do its job, pulling the correct version of the application saving it to a folder, the next container simply runs **caddy** which serves the application.

## A Word about other resources

At this time I won't cover them here.  Red Hat has excellent documentation on these things.  Note, be sure, when you are reading, that you are reading the correct verions -- The OpenShift platform has different version and the capabilities change between versions.  ATM I am using `3.11.59`

## A word about templates

* I use tempates to provision resources.

* Templates are text files in YAML format.

* They can accept parameters, so you can _varry_ parts of the configuration such as the name or label applied to resources, or the version, say of an ImageStream.

## Provisioning the BuildConfigs

They are simple enough, so I used the default values.

You can see the variables with the following command:

```bashag-0-1e4296rfiag-1-1e4296rfi
process -f caddy-bc.template.yaml --parameters
NAME                          DESCRIPTION                                        GENERATOR           VALUE
CADDY_BUILD_CONFIG_NAME       The name of the Caddy Build Config to be created                       caddy-build
CADDY_RUN_BUILD_CONFIG_NAME   The name of the Build Config to be created                             caddy-run
```

## Provisioning the deployment and other objects

The template creats a number of objects each with parameters. 

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
