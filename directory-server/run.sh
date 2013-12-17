#!/bin/sh

export MAVEN_OPTS='-Xloggc:/Users/tangrui/gc.log -XX:+PrintGCDetails -XX:+PrintGCDateStamps'
mvn jetty:run
