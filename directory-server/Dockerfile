FROM zyeeda/java:latest

EXPOSE 9100 9143

COPY docker-entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["mvn", "jetty:run"]

