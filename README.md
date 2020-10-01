# RMIT SEPT 2020 Major Project

# Group 04

## Members
* FLOECK, Oskar (s3725028)
* BARROS, Marco (s3379774)
* HA, Minh (s3719678)
* HOOGWERF, Adam (s3719724)

## Records

* Github repository : https://github.com/RMIT-SEPT/majorproject-8-mon-17-30-4-lemonfruits
* Trello Workspace : https://trello.com/b/9i3HnEMe

## Local run

Backend:
$ mvn spring-boot:build-image -Dspring-boot.build-image.imageName=sept/backend -Dspring.profiles.active=test;

then navigate to .deployment 
$ docker-compose up --build -d

Frontend:
$ npm install
$ npm run start:dev

## Live Website

To access 'agme.company:3001' you need to contact us
