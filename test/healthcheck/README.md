# Health check

JMeter script to verify scrAPI API end points

Environment: https://stage.m.topshop.com
Loop: 2
Threads: 3 (concurrent users)

## Requirements

* [Apache JMeter 3.0](http://jmeter.apache.org/download_jmeter.cgi)
* Java 7 or later

## Run JMeter from commandline

		./jmeter -n -t <path_to_script>/scrAPI.jmx -l <logfile>.jtl

## Journey

* Register user > Product Search > Add item > Order Summary > Order > Account > Logout
