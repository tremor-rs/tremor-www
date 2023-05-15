TREMOR_VSN=main
REF_DIR=docs/reference
LANG_REF_DIR=docs/language/reference
NEXT_LANG_REF_DIR=docs/next/language/reference
REF_DOCS=codecs extractors operators postprocessors preprocessors scripts stdlib connectors

all: clean tremor-runtime-refresh tremor-runtime-docs openapi

docusaurus:
	npm install
	npm run build

clean_build: reset all docusaurus

netlify: clean_build

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

tremor-runtime-docs:
	-cd tremor-runtime && make docs
	-rm -rf $(LANG_REF_DIR)
	-for doc in $(REF_DOCS); do rm -rf $(REF_DIR)/$$doc; done;
	-cp -r tremor-runtime/docs/language $(LANG_REF_DIR)
	-for doc in $(REF_DOCS); do cp -r tremor-runtime/docs/$$doc $(REF_DIR); done
	-cp -r _templates/* docs


openapi:
	-mkdir -p static/api/edge
	cp tremor-runtime/static/openapi.yaml static/api/edge

clean:
	-rm -rf static/api/edge/openapi.yaml
	-for doc in $(REF_DOCS); do rm -rf $(REF_DIR)/$$doc; done;
	-rm -rf $(LANG_REF_DIR)

touch_version:
	cat versions.json | jq '.[1:]' > out
	mv out versions.json
	rm -rf versioned_sidebars/version-0.12.0-rc0-sidebars.json
	rm -rf versioned_docs/version-0.12.0-rc0
	npm run docusaurus docs:version 0.12.0-rc0

reset: 
	-npm run clear
	-rm -rf tremor-runtime
	-rm -rf node_modules