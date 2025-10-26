#!/bin/sh

# DOCKER_TAG=$(git rev-parse --short HEAD)
DOCKER_TAG=$(date +%Y%m%d-%H%M%S)
echo "Latest hash for tag: $DOCKER_TAG"
docker build -t teachers-portal-app:$DOCKER_TAG .
docker tag teachers-portal-app:$DOCKER_TAG akshayhere/teachers-portal-app:$DOCKER_TAG
docker push akshayhere/teachers-portal-app:$DOCKER_TAG
docker tag akshayhere/teachers-portal-app:$DOCKER_TAG akshayhere/teachers-portal-app:latest
docker push akshayhere/teachers-portal-app:latest