TREMOR_VSN=main

all: docs/tremor-script/stdlib docs/operations/cli.md

tremor-runtime:
	-git clone https://github.com/tremor-rs/tremor-runtime
	cd tremor-runtime &&\
	git checkout $(TREMOR_VSN)

docs/tremor-script/stdlib: tremor-runtime
	cd tremor-runtime && make stdlib-doc
	-rm -r docs/scripting/tremor-script/stdlib
	cp -r tremor-runtime/docs docs/scripting/tremor-script/stdlib

docs/operations/cli.md: tremor-runtime
	python3 ./python_scripts/cli2md.py tremor-runtime/tremor-cli/src/cli.yaml > docs/operations/cli.md

clean:
	-rm -rf docs/operations/cli.md docs/tremor-script/stdlib

