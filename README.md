sparkles
========

[![Build Status](https://travis-ci.org/ritterim/sparkles.svg?branch=master)](https://travis-ci.org/ritterim/sparkles)

Monitors TeamCity builds and uses data to control outlets via Raspberry Pi and SainSmart four-module relay board

## Initialization

- Run `npm install` from the project's directory to get all dependencies.

- Project must be run as `root` since we are tapping into raspi's gpio. Example of setting env. variables and running 
as one-command: `sudo QUERY_INTERVAL='1000' TC_USER='***' TC_PASSWORD='***' TC_URI='teamcity:8080' node .`.
