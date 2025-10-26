#!/bin/sh

DOCKER_TAG=$(git rev-parse --short HEAD)
echo "Latest hash for tag: $DOCKER_TAG"
docker build -t akshayhere/teachers-portal-app:$DOCKER_TAG --build-arg DOCKER_TAG=$DOCKER_TAG .
echo "Build locally successful"
docker push akshayhere/teachers-portal-mysql:$DOCKER_TAG
docker tag akshayhere/teachers-portal-mysql:$DOCKER_TAG akshayhere/teachers-portal-mysql:latest
docker push akshayhere/teachers-portal-mysql:latest
echo "Build deployed to docker hub"