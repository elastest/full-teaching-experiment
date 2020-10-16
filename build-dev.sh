#!/bin/sh
#gradle build
gradle clean build -x test
#docker build image
docker build ./backend --tag full-teaching:1.0
#docker compose up
docker-compose up
