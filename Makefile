TREMOR_VSN=main
REF_DIR=docs/reference
LANG_REF_DIR=docs/language/reference
NEXT_LANG_REF_DIR=docs/next/language/reference

all: clean tremor-runtime-docs openapi

clean_build: reset all
	# -rm -rf ../cache/*
	npm run build

netlify: clean_build openapi

serve:
	npm run serve

tremor-runtime:
	-git clone https://github.com/tremor-rs/tremor-runtime

.PHONY: tremor-runtime-refresh
tremor-runtime-refresh: tremor-runtime
	cd tremor-runtime &&\
	git checkout $(TREMOR_VSN) &&\
	git pull

alex:
	npm install -g alex
	alex docs

tremor-runtime-docs: tremor-runtime-refresh
	-cd tremor-runtime && make docs
	-rm -rf $(LANG_REF_DIR) $(REF_DIR)/{codecs,extractors,operators,postprocessors,preprocessors,scripts,stdlib}
	cp -rf tremor-runtime/docs/language $(LANG_REF_DIR)
	cp -rf tremor-runtime/docs/{codecs,extractors,operators,postprocessors,preprocessors,scripts,stdlib} $(REF_DIR)
	cp -r _templates/* docs


openapi: tremor-runtime-refresh
	-mkdir -p static/api/edge
	cp tremor-runtime/static/openapi.yaml static/api/edge

clean:
	-rm -rf static/api/edge/openapi.yaml
	-rm -rf $(REF_DIR)/{codecs,extractors,operators,postprocessors,preprocessors,scripts,stdlib}
	-rm -rf $(LANG_REF_DIR)

touch_version:
	cat versions.json | jq '.[1:]' > out
	mv out versions.json
	rm -rf versioned_sidebars/version-0.12.0-rc0-sidebars.json
	rm -rf versioned_docs/version-0.12.0-rc0
	npm run docusaurus docs:version 0.12.0-rc0

check_verify:
	npm run build

reset: 
	-npm run clear
	-rm -rf tremor-runtime
	-rm -rf node_modules
	npm install