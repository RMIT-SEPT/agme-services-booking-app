#!/bin/bash

echo "runner.sh script starting..."

echo "Docker down and checkout to master & update"
docker-compose down;
git pull;
git checkout feature/deployment;

echo "Move to Backend & Creating new Springboot Image"
cd ..;
cd BackEnd;
mvn spring-boot:build-image -Dspring-boot.build-image.imageName=sept/backend -Dspring.profiles.active=test;

echo "Deploying Springboot, React & Postgres Containers"
cd ..;
cd .deployment;
docker-compose up --build -d;

echo "runner.sh script finished!"
