NODE ?= node
NPM ?= npm
DEL = rm -rf
DIST = .dist
BUILD = .build
ECHO = @echo
GRUNT ?= grunt
NODE_MODULES = node_modules
INSTALL_DEP = $(NODE_MODULES)
CONFIG = app/config.json

help:
	$(ECHO) "Builder for tatwebui server"
	$(ECHO) "make install       Install the dependancies and prepare environment"
	$(ECHO) "make release       Generate the release in $(DIST)"
	$(ECHO) "make clean         Clean the project"

install:
	$(NPM) install

release: $(INSTALL_DEP)
	$(GRUNT)

clean:
	$(DEL) $(BUILD) && $(DEL) $(DIST) && $(DEL) $(NODE_MODULES)

copy-config-sample:
	cp $(CONFIG).sample $(CONFIG)

$(NODE_MODULES): install
