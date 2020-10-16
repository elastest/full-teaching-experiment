#!/bin/sh
#gradle build with prod profile
gradle clean build -Pprofile=prod -x test
#docker build image
docker build ./backend --tag full-teaching:1.0

