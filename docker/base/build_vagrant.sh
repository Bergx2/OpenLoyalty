#!/usr/bin/env bash

pushd "$( dirname $0 )" > /dev/null
CURDIR=$( pwd -P )

## build base images
VERSION=latest

## build base images
docker build --no-cache -t divante/openloyalty/base-nodejs:$VERSION -f nodejs-dockerfile $CURDIR
docker build --no-cache -t divante/openloyalty/base-nginx:$VERSION -f nginx-dockerfile $CURDIR
docker build --no-cache -t divante/openloyalty/base-php-fpm:$VERSION -f php-fpm-dockerfile $CURDIR
docker build --no-cache -t divante/openloyalty/elasticsearch:$VERSION -f elasticsearch-dockerfile $CURDIR

popd > /dev/null
