FROM openjdk:8-jdk-alpine

MAINTAINER daniel097541

ADD ./backend/build/libs/backend-0.5-SNAPSHOT.jar ./full-teaching.jar

EXPOSE 5001

ENTRYPOINT ["java","-jar","/full-teaching.jar"]
