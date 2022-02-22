TREMOR_VSN=main

all: docs/scripting/tremor-script/stdlib docs/scripting/tremor-query/functions

netlify: all
	npm run build

tremor-runtime:
	-git clone https://github.com/tremor-rs/tremor-runtime
	cd tremor-runtime &&\
	git checkout $(TREMOR_VSN)

openapi.yaml: tremor-runtime
	cp tremor-runtime/static/openapi.yaml ./openapi.yaml

docs/scripting/tremor-script/stdlib: tremor-runtime
	cd tremor-runtime && make stdlib-doc
	-rm -r docs/scripting/tremor-script/stdlib
	cp -r tremor-runtime/docs docs/scripting/tremor-script/stdlib

docs/scripting/tremor-query/functions: tremor-runtime
	cd tremor-runtime && make aggr-doc
	-rm -r docs/scripting/tremor-query/functions
	cp -r tremor-runtime/aggr-docs docs/scripting/tremor-query/functions

clean:
	-rm -rf docs/scripting/tremor-script/stdlib docs/scripting/tremor-query/functions

reset: 
	-rm -rf /node_modules
	npm install
