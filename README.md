[![Build Status](https://travis-ci.org/ovh/tatwebui.svg?branch=master)](https://travis-ci.org/ovh/tatwebui)

# Tat WebUI

<img align="right" src="https://raw.githubusercontent.com/ovh/tat/master/tat.png">

Tat Web UI - A Web Client for Tat Engine

See Tat Engine for more information: https://github.com/ovh/tat

## Views

- Standard View: https://github.com/ovh/tatwebui-plugin-standardview
- Notifications View: https://github.com/ovh/tatwebui-plugin-notificationsview
- Release View: https://github.com/ovh/tatwebui-plugin-releaseview
- Pastat View: https://github.com/ovh/tatwebui-plugin-pastatview


## Docker
### Build Image

```
docker build -t tat-webui:latest .
```

### RUN
```
docker run -it --rm --name tat-webui-instance1 \
  -e FILESYSTEM_LISTEN_PORT=8082 \
  -e PROCESS_NB_FORKS=2 \
  -e BACKEND_SCHEME=http \
  -e BACKEND_HOST=localhost \
  -e BACKEND_PORT=8081 \
  -p 8082:8082 tat-webui
```

# Hacking

You've developed a new cool feature? Fixed an annoying bug? We'd be happy
to hear from you! Make sure to read [CONTRIBUTING.md](./CONTRIBUTING.md) before.

## Prerequisites
- Install NodeJs [https://nodejs.org/]
- Install Bower ``` npm install -g bower ```
- Install Grunt ```npm install -g grunt-cli```

## Client

### Tat webui plugins

### Configuration

See file ```client/plugin.tpl.json```
You can had your custom tat view plugins in ```client/custom.plugin.tpl.json```

Configure Tat Engine and others parameters

```
cp client/src/assets/config.json.sample client/src/assets/config.json.prod
```
See file ```client/src/assets/config.json.prod```

### Quick RUN in dev mode

```
make devclient
```

## Server

See Makefile... Useful only if your Tat Engine doesn't allow CORS.

### Dependencies
Get the dependencies by launching those commands:

-  ```cd ./server```
-  ```npm install```

### Configuration

-  ```cd ./server```
-  ```cp ./app/config.json.sample ./app/config.json```
-  edit ./app/config.json

### Launch
Launch *serve* task of grunt:

-  ```cd ./server```
-  ```npm start```
