TREMOR_VSN=connectors

all: clean tremor-runtime-docs

netlify: all reset
	-rm -rf ../cache/*
	npm run build
	cp -rf docs/language/svg build/docs/language/svg      # Saves duplicates in git this way
	cp -rf docs/language/svg build/docs/next/language/svg # Saves duplicates in git this way

serve:
	cp -rf docs/language/svg build/docs/language/svg      # Saves duplicates in git this way
	cp -rf docs/language/svg build/docs/next/language/svg # Saves duplicates in git this way
	npm run serve

tremor-runtime:
	-git clone https://github.com/tremor-rs/tremor-runtime
	cd tremor-runtime &&\
	git checkout $(TREMOR_VSN) &&\
	git pull

alex:
	npm install -g alex
	alex docs

tremor-runtime-docs: tremor-runtime
	-cd tremor-runtime && make docs
	-rm -rf docs/language docs/library
	cp -rf tremor-runtime/docs/language docs/language
	cp -rf tremor-runtime/docs/library docs/library
	cp -rf tremor-runtime/static/docs/library/*.md docs/library
	-rm -rf static/docs/svg
	-[ ! -d static/docs/language/svg ] && mkdir -p static/docs/language/svg || true
	cp -rf docs/language/svg static/docs/language/svg


openapi: tremor-runtime
	npm i -g redoc-cli
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

check_verify: touch_version
	npm run build

reset: 
	npm run clear
	-rm -rf /node_modules package-lock.json yarn.lock
	npm install

