FROM codeurjc/full-teaching:demo

RUN rm -rf /app.jar

ADD full-teaching-0.5-SNAPSHOT.war app.jar
RUN bash -c 'touch /app.jar'

EXPOSE 5000

CMD /wait.sh && /init.sh
