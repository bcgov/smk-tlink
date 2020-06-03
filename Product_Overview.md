TRUCK ROUTE PLANNER (TRP)

------------
Summary

------------

The Truck Route Planner (TRP) is a Simple Map Kit-based, web mapping application that was built by Vivid Solutions and DataBC for Metro Vancouver's Translink organization.  It is currently hosted on the OpenShift infrastructure offered by the BC Gov Digital Exchange Lab.

------------------------

Repository

------------------------

 The code repository for the TRP is:

https://www.github.com/bcgov/smk-tlink

 

The inaugural release of the TRP used the GitHub Projects board construct as a means to capture requirements and facilitate communication of status between stakeholders.

https://github.com/bcgov/smk-tlink/projects/1

Future releases (beyond "Post") will use a new Board.

https://github.com/bcgov/smk-tlink/projects/2/

------------------------

Hosting in OpenShift

------------------------

 The OpenShift project was requested and fulfilled via the DevOps team at the Digital Exchange Lab:

https://github.com/BCDevOps/devops-requests/issues/157

The OpenShift Project set used to host the application is:

wvmyix-tools, wvmyix-dev, wvmyix-test, wvmyix-prod.

The OpenShift Console is available at:

https://console.pathfinder.gov.bc.ca:8443/console/projects

Authorized users should be able to see the project set in the console.

For network security policy setup, please refer to https://developer.gov.bc.ca/Platform-Services-Security/Developer-Guide-to-Zero-Trust-Security-Model-on-the-Platform 

 

More info about hosting specific to the application can be found here: https://github.com/bcgov/smk-tlink/tree/tools/README.md

 

------------------------

TRP Environments

------------------------

The repo for all thinks TRP is: https://www.github.com/bcgov/smk-tlink

Within that there are a number of branches, most notably: develop, qa, master, tools

 

'develop' branch is where developers are able to commit code changes.  When commits are complete there is a webhook in place that deploys the code to the Delivery environment in OpenShift:

https://translink-d.apps.gov.bc.ca/trp/

 

'qa' branch is the gateway branch to the Test environment.  When there is satisfaction with the application in 'develop', a pull request can be made to pull code from 'develop' into 'qa'. When commits are complete there is a webhook in place that deploys the code to he Test environment in OpenShift:

https://translink-t.apps.gov.bc.ca/trp/

 

'master' branch is the gateway to the Production environment.  When there is satisfaction with the application in 'qa', a pull request can be made to pull code from 'qa' into 'master'. When commits are complete there is a webhook in place that deploys the code to the Production environment in OpenShift:

https://translink.apps.gov.bc.ca/trp/

 

'tools' branch is a structure where configuration related templates, tools, and command line scripts are housed.  'tools' is the DevOps team's preference as it is important to keep the application very portable and containerized.  Scripts related to configuration and deployment of code in OpenShift are housed here.

------------------------------------------------

Testing changes in Web Services

------------------------------------------------

By default, the application points to the Production instance of the BC Route Planner and BC Geocoder web services regardless of which environment you are visiting.  However, if there is a need to review the application against changes in Delivery or Test web services this can be done via the use of a URL parameter.  For example:

Delivery app to Test web services:

https://translink-d.apps.gov.bc.ca/trp/?config=./config/test-services.json 

Test app to Test web services:

https://translink-t.apps.gov.bc.ca/trp/?config=./config/test-services.json 

Production app to Test web services:

https://translink.apps.gov.bc.ca/trp/?config=./config/test-services.json 

 

------------------------------------------------

Code Structure for the TRP App

------------------------------------------------

Under the root of the code repository (https://github.com/bcgov/smk-tlink) are several files and sub-directories.  The sub-directories include:

'config' pertains to storage of config files, mostly JSON (map.json, layers.json, test-services.json, etc.)

'etc' pertains to storage of custom files to support printing and reporting

'fragments' pertains to the storage of custom CSS and HTML files used in TRP to support the About, Disclaimer, Feedback, Glossary, etc.

'images' pertains to the storage of images files specific to TRP (truck graphics, custom symbololgy, etc.)

'layers' pertains to the storage of layer specific files.  it has a sub-directory for each layer and within each sub-directory a collection of JSON (for config), geoJSON (for the actual geometry), and an 'images' sub-directory for the symbology of each layer.

'lib' pertains to the storage of core SMK libraries; this is where smk.js resides as well as the spinner graphic, for example.

The files under the root include CSS for overall styling, the all important index.html file, and a custom file trp-vehicle-definitions.js which is where configuration info for truck definitions is stored.  This can change from time to time as municipal rules evolve.

 

------------------------------------------------

Data Updates for TRP App

------------------------------------------------

Data updates to cartographic layers within the applications and to vehicle definition data and trucks weights is documented at length at the following:

\\Plane\s7793\DataBC\PROJECTS\19-xxx_Translink\Maintenance_Documentation\TRP_Cartographic_and_Truck_Config_Data_Updates.docx

 
