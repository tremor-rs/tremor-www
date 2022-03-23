TREMOR_VSN=connectors

all: clean docs/library/stdlib docs/library/aggr openapi static/docs/svg

netlify: all reset
	npm run build

tremor-runtime:
	-git clone https://github.com/tremor-rs/tremor-runtime

tremor-runtime-refresh:
	cd tremor-runtime &&\
	git checkout $(TREMOR_VSN) &&\
	git pull origin $(TREMOR_VSN)

lalrpop-docgen:
	-git clone https://github.com/darach/lalrpop lalrpop-docgen
	cd lalrpop-docgen &&\
	git checkout docgen

static/docs/svg:
	-mkdir docs/language
	cd lalrpop-docgen && cargo build --all
	lalrpop-docgen/target/debug/lalrpop-docgen \
	  -mp static/language/prolog \
	  -me static/language/epilog \
	  -gc "Use,Deploy,Query,Script" \
	  --out-dir docs/language \
	  ./tremor-runtime/tremor-script/src/grammar.lalrpop
	mv docs/language/grammar.md docs/language/EBNF.md
	mv docs/language/Use.md docs/language/ModuleSystem.md
	mv docs/language/svg static/docs/svg

docs/library/stdlib: tremor-runtime
	cd tremor-runtime && make stdlib-doc
	-rm -r docs/library/stdlib
	cp -r tremor-runtime/docs docs/library/stdlib

docs/library/aggr: tremor-runtime
	cd tremor-runtime && make aggr-doc
	-rm -r docs/library/aggr
	cp -r tremor-runtime/aggr-docs/aggr docs/library/aggr

openapi: tremor-runtime
	cp tremor-runtime/static/openapi.yaml static/api/v0.12
	redoc-cli bundle static/api/v0.12/openapi.yaml
	mv redoc-static.html static/api/v0.12/index.html
	redoc-cli bundle static/api/v0.11/openapi.yaml
	mv redoc-static.html static/api/v0.11/index.html

clean:
	-rm -rf static/api/v0.11/index.html
	-rm -rf static/api/v0.12/index.html
	-rm -rf static/api/v0.12/openapi.yaml
	-rm -rf docs/library/aggr
	-rm -rf docs/library/stdlib
	-rm -rf docs/language
	-rm -rf static/docs/svg
	-rm -rf docs/api

touch_version:
	cat versions.json | jq '.[1:]' > out
	mv out versions.json
	rm -rf versioned_sidebars/version-0.12.0-rc0-sidebars.json
	rm -rf versioned_docs/version-0.12.0-rc0
	npm run docusaurus docs:version 0.12.0-rc0

reset: 
	npm i -g redoc-cli
	npm run clear
	-rm -rf /node_modules package-lock.json yarn.lock
	npm install

.PHONY: static/docs/svg
