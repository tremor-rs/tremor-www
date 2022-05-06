TREMOR_VSN=main

all: docs/scripting/tremor-script/stdlib docs/scripting/tremor-query/functions openapi.yaml

netlify: all | reset
	npm run build

tremor-runtime:
	-git clone https://github.com/tremor-rs/tremor-runtime

tremor-runtime-refresh:
	cd tremor-runtime &&\
	git checkout $(TREMOR_VSN) &&\
	git pull origin $(TREMOR_VSN)

openapi.yaml: tremor-runtime-refresh
	cp tremor-runtime/static/openapi.yaml ./openapi.yaml

docs/scripting/tremor-script/stdlib: tremor-runtime-refresh
	$(MAKE) -C tremor-runtime library-doc
	-rm -rf docs/scripting/tremor-script/stdlib
	# remove aggr docs
	-rm -r tremor-runtime/docs/library/aggr
	cp -r tremor-runtime/docs/library docs/scripting/tremor-script/stdlib

docs/scripting/tremor-query/functions: tremor-runtime-refresh
	$(MAKE) -C tremor-runtime library-doc
	-rm -rf docs/scripting/tremor-query/functions
	mkdir docs/scripting/tremor-query/functions
	# only copy aggr docs
	cp -r tremor-runtime/docs/library/aggr docs/scripting/tremor-query/functions

clean:
	-rm -rf docs/scripting/tremor-script/stdlib docs/scripting/tremor-query/functions

reset: 
	-rm -rf /node_modules
	npm install
