sparkles
========

[![Build Status](https://travis-ci.org/ritterim/sparkles.svg?branch=master)](https://travis-ci.org/ritterim/sparkles)

Monitors TeamCity builds and uses data to control outlets via Raspberry Pi and SainSmart four-module relay board

## Initialization

- Run `npm install` from the project's directory to get all dependencies.

- Use `config/default.yml` as skeleton for populating necessary config.-values (`cp default.yml local.yml`). If you prefer, you could follow directions [here](https://github.com/lorenwest/node-config/wiki/Environment-Variables) to use environment-variables instead.

- Project must be run as `root` since we are tapping into raspi's gpio: `sudo node .`
