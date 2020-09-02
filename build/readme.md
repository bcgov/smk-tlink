# Instructions for updating the layer geo-data

## Prerequisites

The scripts are written in Bash, so will need a Unix-like system to run.
Mac OS will work fine.
Windows Subsystem for Linux (WSL) will also work.

To use these scripts, some additional tools are needed. All of these tools can be installed with homebrew (Mac), or apt (WSL):

- [cUrl](https://curl.haxx.se/)

- [jq](https://stedolan.github.io/jq/)

- [gdal](https://gdal.org/)

## Updating layers

Change to the `build` directory (directory where this readme is located):

    > cd build

Download the latest versions of the source data:

    > ./download-geojson.sh

Extract the layer files from the source data:

    > ./extract-layers.sh

If everything looks ok, and no errors are reported, then update the layer files for the app:

    > ./update-layers.sh

Now, look at the changes to the `layers` directory in your git client.
Ensure that the changes are what you are expecting to be changed.
Commit only changes that you are sure are actually necessary.

The directories `build/temp` and `build/etc` should be ignored by git, so don't commit any changes in those directories.

