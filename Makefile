TREMOR_VSN=main

all: docs/tremor-script/stdlib docs/Operations/cli.md docs/api.md

tremor-runtime:
	-git clone https://github.com/tremor-rs/tremor-runtime
	cd tremor-runtime &&\
	git checkout $(TREMOR_VSN)

docs/tremor-script/stdlib: tremor-runtime
	cd tremor-runtime && make stdlib-doc
	-rm -r docs/tremor-script/stdlib
	cp -r tremor-runtime/docs docs/tremor-script/stdlib

docs/Operations/cli.md: tremor-runtime
	python3 ./python_scripts/cli2md.py tremor-runtime/tremor-cli/src/cli.yaml > docs/Operations/cli.md

docs/api.md: tremor-runtime
	python3 ./python_scripts/api2md.py tremor-runtime/static/openapi.yaml > docs/api.md

clean:
	-rm -rf docs/Operations/cli.md docs/api.md docs/tremor-script/stdlib

