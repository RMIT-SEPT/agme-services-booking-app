#!/bin/bash
docker-compose down;

cd ..;
cd BackEnd;

git pull;

git checkout release;

echo "Creating new backend image"
mvn spring-boot:build-image -Dspring-boot.build-image.imageName=sept/backend -Dspring.profiles.active=test;

echo "Running frontend & backend & postgres containers"

cd ..;

cd .deployment;
docker-compose up --build -d;