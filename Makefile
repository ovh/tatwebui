DOCKER ?= docker
NODE ?= node
NPM ?= npm
DEL = rm -rf
CLIENT = client
SERVER = server
GRUNT ?= grunt
DIST = .dist
TAR ?= tar czf
DIST_TAR ?= dist.tar.gz
DIST_PUBLIC = $(DIST)/public
CLIENT_DIST = $(CLIENT)/$(DIST)
SERVER_DIST = $(SERVER)/$(DIST)
ECHO = @echo

define makesub
	cd $1 && make $2
endef


help:
	$(ECHO) "Builder for TAT UI"
	$(ECHO) "make release       Generate the release in $(DIST)"
	$(ECHO) "make dist-clean    Clean all the project including $(SERVER) and $(CLIENT)"
	$(ECHO) "make docker        Build the docker image"
	$(ECHO) "make devclient     Launch client dev"
	$(ECHO) "make devserver     Launch server dev"

docker:
	$(DOCKER) build -t tatwebui .

dockerImage : clean copy-samples check-config $(DIST)

tardist :
	$(TAR) $(DIST_TAR) $(DIST)

release: $(DIST)

$(DIST) : check-config clean build-ihm build-server
	mkdir -p $(DIST_PUBLIC) && \
	cp -r $(SERVER_DIST)/* $(DIST)/. && \
	cp -r $(CLIENT_DIST)/* $(DIST_PUBLIC)/.

unsafe: check-config dist-clean build-ihm build-server
	mkdir -p $(DIST_PUBLIC) && \
	cp -r $(SERVER_DIST)/* $(DIST)/. && \
	cp -r $(CLIENT_DIST)/* $(DIST_PUBLIC)/.

devserver: build-server
	cd $(SERVER) && $(NPM) start

devclient: build-ihm
	cd $(CLIENT) && $(GRUNT) serve

check-config: $(SERVER)/app/config.json $(CLIENT)/src/assets/config.json

copy-samples : copy-config-sample-server copy-config-sample-client

copy-config-sample-server:
	cd $(SERVER) && \
	make copy-config-sample && \
	cd ..

copy-config-sample-client:
	cd $(CLIENT) && \
	make copy-config-sample && \
	cd ..

$(SERVER)/app/config.json:
	$(error configuration files not found: $(SERVER)/app/config.json)

$(CLIENT)/src/assets/config.json:
	$(error configuration files not found: $(CLIENT)/src/assets/config.json)

run: $(DIST)
	cd $(DIST) && \
	$(NODE) index.js

build-ihm :
	$(call makesub,client,release)

build-server:
	$(call makesub,server,release)

clean: dist-clean client-clean server-clean

dist-clean: client-clean server-clean
	$(DEL) $(DIST)

client-clean:
	$(call makesub,client,clean)

server-clean:
	$(call makesub,server,clean)
