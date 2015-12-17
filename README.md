[![Build Status](https://travis-ci.org/ovh/tatwebui.svg?branch=master)](https://travis-ci.org/ovh/tatwebui)

# Tat WebUI

Tat Command Line Interface.

See Tat Engine for more information: https://github.com/ovh/tat

## Views

- Standard View: https://github.com/ovh/tatwebui-plugin-standardview
- Notifications View: https://github.com/ovh/tatwebui-plugin-notificationsview
- Release View: https://github.com/ovh/tatwebui-plugin-releaseview


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
  -e WS_SOCKET_SCHEME=ws \
  -e WS_SOCKET_PORT=8080 \
  -e WS_SOCKET_HOST=localhost \
  -p 8082:8082 tat-webui
```

## Sailabove

```
docker build -t tat-webui .
docker tag -f tat-webui sailabove.io/<yourSailaboveUsername>/tat-webui
docker push sailabove.io/<yourSailaboveUsername>/tat-webui

sail services add <yourSailaboveUsername>/tat-webui \
  --network predictor \
  -e FILESYSTEM_LISTEN_PORT=8080 \
  -e PROCESS_NB_FORKS=2 \
  -e BACKEND_SCHEME=http \
  -e BACKEND_HOST=tat-webui.<yourSailaboveUsername>.app.sailabove.io \
  -e BACKEND_PORT=8081 \
  -e WS_SOCKET_SCHEME=wss \
  -e WS_SOCKET_PORT=443 \
  -e WS_SOCKET_HOST=tat-engine.<yourSailaboveUsername>.app.sailabove.io
  -p 8080:8080 tat-webui
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

### Launch the proxy
Launch *serve* task of grunt:

-  ```cd ./server```
-  ```npm start```
