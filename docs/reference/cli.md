# Command Line Interface

This document summarises the `tremor` cli commands.

## Audience

Tremor `operators` and `developers`

## General flags and switches

Options that are available to all subcommands.

**Options**

| Name              | Switch | Kind              | Multiple | Description                                                                                |
|-------------------|--------|-------------------|----------|--------------------------------------------------------------------------------------------|
| `--help`          | `-h`   | switch/flag       | no       | Prints help information                                                                    |
| `--instance`      | `-i`   | switch/flag       | no       | Instance identifier (default: `tremor`)                                                    |
| `--logger-config` | `-l`   | `<LOGGER_CONFIG>` | no       | Configuration file for [Log4RS](https://docs.rs/log4rs/latest/log4rs/) ( default: `none` ) |

## Version

Prints version information.

| Name        | Switch | Kind        | Multiple | Description                |
|-------------|--------|-------------|----------|----------------------------|
| `--version` | `-V`   | switch/flag | no       | Prints version information |

```bash
$ tremor --version
tremor 0.12.0
```

## Commands

Set of commands supported by the command line interface.

**Subcommands**

| Command                               | Description                                                                                                                                  |
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| [completions](#shell-completions)     | Generate shell completions to stdout. Tries to guess the shell if no subcommand is given.                                                    |
| [server](#standalone-server-instance) | Tremor server                                                                                                                                |
| [test](#testing-facilities)           | Testing facilities                                                                                                                           |
| [dbg](#debugging-facilities)          | Advanced debugging commands                                                                                                                  |
| [run](#interactive-development)       | Run tremor script or query files against stdin or a json data archive, the data will be read from STDIN or an archive and written to STDOUT. |
| [doc](#documentation-generation)      | Generates documention from tremor script files                                                                                               |
| [new](#template)                      | Generates a project template                                                                                                                 |

## Shell Completions

Generate shell completions to standard output on the console. 

Tries to guess the shell if no subcommand is given.

### Subcommands

| Command                                                                   | Description                               |
|---------------------------------------------------------------------------|-------------------------------------------|
| [guess](#how-to-explicitly-guess-completion-based-on-active-shell)        | Generate completion based on active shell |
| [bash](#how-to-generate-shell-completions-for-the-bash-shell)             | Generate bash shell completions           |
| [zsh](#how-to-generate-shell-completions-for-the-zsh-shell)               | Generate zsh shell completions            |
| [elvish](#how-to-generate-shell-completions-for-the-elvish-shell)         | Generate elvish shell completions         |
| [fish](#how-to-generate-shell-completions-for-the-fish-shell)             | Generate fish shell completions           |
| [powershell](#how-to-generate-shell-completions-for-the-powershell-shell) | Generate powershell shell completions     |

### How to guess the shell completion?

Generate completion based on active shell

### How to explicitly guess completion based on active shell?

```bash
$ tremor completions guess
```

### Short form guess completion based on active shell

```bash
$ tremor completions
```

### How to generate shell completions for the `bash` shell?

Generate `bash` shell completions.

```bash
$ tremor completions bash
```

### How to generate shell completions for the `zsh` shell?

Generate `zsh` shell completions.

```bash
$ tremor completions zsh
```

### How to generate shell completions for the `elvish` shell?

Generate elvish shell completions

```bash
$ tremor completions elvish
```

### How to generate shell completions for the `fish` shell?

Generate `fish` shell completions.

```bash
$ tremor completions fish
```

### How to generate shell completions for the `powershell` shell?

Generate powershell shell completions.

```bash
$ tremor completions powershell
```

## Running a standalone server instance

Run tremor as a long lived standalone server instance.

| Command                   | Description                    |
|---------------------------|--------------------------------|
| [server run](#server-run) | Runs the tremor server process |

### Options

|Name|Switch|Kind|Multiple|Description|
|----|------|----|--------|-----------|
|`--api-host`|-a|`<API_HOST>`|The `host:port` to listen for the API ( default: `0.0.0.0:9898` )|
|`--debug-connectors`|`-d`|`boolean`|Loads the debug connectors ( default: `false` )|
|`--no-api`|`-n`|`boolean`|Optionally disable API ( default: `false` )|
|`--pid`|-|`<PID>`|Path to file to store captured process id if set ( default: `none` )|
|`--recursion-limit`|`-r`|`<RECURSION_LIMIT>`|Function tail-recursion stack depth limit ( default: `1024` )|

### Arguments

| Name      | Switch | Kind        | Multiple | Description                                                                 |
|-----------|--------|-------------|----------|-----------------------------------------------------------------------------|
| artefacts | None   | switch/flag | yes      | Paths to `.troy` files containing pipelines, onramps, offramps to provision |

### Run tremor with zero deployments

```bash
$ tremor server run
tremor version: 0.12.0 (RELEASE)
tremor instance: tremor
rd_kafka version: 0x000002ff, 1.8.2
allocator: snmalloc
Listening at: http://0.0.0.0:9898
```

This command will run tremor with no deployments and expose its API on [`http://0.0.0.0:9898`](http://0.0.0.0:9898/v1).

### Run tremor with alternative API endpoint

```bash
$ tremor server run --api-host localhost:1234
tremor version: 0.12.0 (RELEASE)
tremor instance: tremor
rd_kafka version: 0x000002ff, 1.8.2
allocator: snmalloc
Listening at: http://localhost:1234
```

### Run tremor capturing process id to a file

```bash
$ tremor server run --pid tremor.pid
tremor version: 0.12.0 (RELEASE)
tremor instance: tremor
rd_kafka version: 0x000002ff, 1.8.2
allocator: snmalloc
Listening at: http://localhost:1234
^C
$ cat tremor.pid
6348
```

### Run tremor without API running a deployment

```bash
$ tremor server run --pid tremor.pid my_deployment.troy
tremor version: 0.12.0 (RELEASE)
tremor instance: tremor
rd_kafka version: 0x000002ff, 1.8.2
allocator: snmalloc
```

### Run tremor with a `TREMOR_PATH` environment set

```bash
$ export TREMOR_PATH=/usr/local/share/tremor/lib:/opt/my_app_modules/lib
$ tremor server run --pid tremor.pid my_deployment.troy
tremor version: 0.12.0 (RELEASE)
tremor instance: tremor
rd_kafka version: 0x000002ff, 1.8.2
allocator: snmalloc
```
## Testing facilities

Run user defined or tremor provided test suites.

```bash
$ tremor test [<MODE>] [<PATH>]
```

The framework will walk the provided `path` for tests conforming to the `mode` of
operation supplied and execute the tests.

To setup a test folder to contain our tests:

```bash
$ mkdir tests
$ cd tests
$ echo '[ "all" ]' >> tags.yaml
```

::note
The `tags.yaml` allows a list of tags to be defined to control filtering tests
by inclusion or exclusion. By default all tests are run. But tags allow a subset to be selected.
::

### Arguments

| Name     | Switch | Kind        | Multiple | Description                                     |
|----------|--------|-------------|----------|-------------------------------------------------|
| MODE     | None   | switch/flag | no       | One of `all`, `bench`, `integration`, or `unit` |
| PATH     | None   | switch/flag | no       | The root test path                              |
| REPORT   | None   | switch/flag | no       | Should generate a test report to specified path |
| INCLUDES | None   | switch/flag | no       | Optional tags to filter test executions by      |
| EXCLUDES | None   | switch/flag | no       | Optional tags to filter test executions by      |
| QUIET    | None   | switch/flag | no       | only print failed tests                         |

### How do I write a benchmark?

Within our parent `tests` folder, we can create one or many sub folders to
contain benchmarks:

```bash
$ cd tests
$ mkdir bench
$ cd bench
$ echo '[ "bench" ]' >> tags.yaml
```

Let us create a benchmark called `example`

```bash
$ cd tests/bench
$ mkdir example
$ cd example
$ echo '[ "pipeline", "codec::binary", "passthrough", "example" ]' >> tags.yaml
```

Create a deployment file `config.troy` that encapsulates our benchmark logic:

```tremor
define flow main
flow
  # Our pipeline under test
  define pipeline passthrough
  pipeline
    select event from in into out;
  end;

  # Benchmark conditions with replayed data
  define connector bench from bench
  args
    codec = "json",
    file = "data.json.xz",
    base64 = false,
  with
    codec = args.codec,
    config = {
      "base64": args.base64,
      "source":  "./#{args.file}",
      "warmup_secs": 5,
      "stop_after_secs": 25,
      "significant_figures": 2,
    }
  end;

  create connector bench from bench
  with
    codec = "binary",
  end;
  create pipeline main from passthrough;

  connect /connector/bench to /pipeline/main;
  connect /pipeline/main to /connector/bench;
end;
deploy flow main;
```

This assumes that a `data.json.xz` line delimited json file exists in the test folder.

```json
{ "snot": "badger" }
```

We can execute this test directly in the current working folder.

```bash
$ cd tests/bench/example
$ tremor test bench .
  Benchmark: Running .
    Tags:  codec:binary pipeline passthrough example

       | Value Percentile TotalCount 1/(1-Percentile)
       | 
       | 12799 0.00000          1           1.00
       | 55551 0.25000     271201           1.33
...
       | 23986175 1.00000    1077905     1048576.00
       | 31719423 1.00000    1077906     1398101.33
       | 31719423 1.00000    1077906            inf
       | #[Mean       =    160029.80, StdDeviation   =    454979.40]
       | #[Max        =     31719423, Total count    =      1077906]
       | #[Buckets    =           30, SubBuckets     =         3968]
       | 
       | 
       | Throughput   (data): 0.4 MB/s
       | Throughput (events): 43.1k events/s

  Elapsed: 30s 80ms


All Benchmark Stats: Pass 1 Fail 0 Skip 0  Asserts 0 
Total Stats: Pass 1 Fail 0 Skip 0  Asserts 0 
Total Elapsed: 30s 83ms
```

We can execute our entire suite and discover all benchmarks automatically:

```bash
$ tremor test bench tests
```

Generally, reusable logic and the `TREMOR_PATH` environment variable will be set where
external modules, such as utilities in the standard library are being used in a test.

Our worked example has no external module dependencies so we omit this.

The full source for [this example](__GIT__/tests/bench/example).

Any output from the system under test will be captured in log files

```bash
$ cd tests/bench/example
$ ls *.log
fg.err.log  fg.out.log
```

### How do I write an integration test?

Within our parent `tests` folder, we can create one or many sub folders to
contain integration tests:

```bash
$ cd tests
$ mkdir integration
$ cd integration
$ echo '[ "integration" ]' >> tags.yaml
```

Let us create an integration test called `example2`

```bash
$ cd tests/integration
$ mkdir example2
$ cd example2
$ echo '[ "integration", "structured", "metronome", "example2" ]' >> tags.yaml
```

Create a deployment file `config.troy` that encapsulates our integration test logic:

```tremor
define flow main
flow
  use std::time::nanos;

  define connector exit from exit;

  # Connector under test
  define connector metronome from metronome
  with
    config = {"interval": nanos::from_millis(500) }
  end;
 
  define connector write_file from file
  args
    file = "out.log"
  with 
    codec = "json-sorted",
    postprocessors = ["separate"],
    config = {
        "path": args.file,
        "mode": "truncate"
    },
  end;
 
  define pipeline main
  pipeline
    select "triggered" from in into out;
  end;

  define pipeline exit
  pipeline    
    select {
      "exit": 0,
    } from in into out;
  end;

  create connector exit from exit;
  create connector file from write_file;
  create connector metronome;
  create pipeline main;
  create pipeline exit;

  connect /connector/metronome to /pipeline/main;
  connect /connector/metronome to /pipeline/exit;
  connect /pipeline/main to /connector/file;
  connect /pipeline/exit to /connector/exit;
end;
deploy flow main;
```

As this is an integration test we need an assert specification:

```yaml
status: 0
name: example2
asserts:
  - source: out.log
    contains:
      - "\"triggered\""
```

We can execute this test directly in the current working folder.

```bash
$ cd tests/integration/example2
$ tremor test integration .
  Integration: Running .
    Tags:  example2 metronome integration connector
       (+) Assert 0: Status example2
       (+) Assert 1:   Contains `"triggered"` in `out.log`
   Stats: Pass 2 Fail 0 Skip 0  Asserts 2 
    Elapsed: 72ms 635us


All Integration Stats: Pass 1 Fail 0 Skip 0  Asserts 2 
Total Stats: Pass 1 Fail 0 Skip 0  Asserts 2 
Total Elapsed: 75ms 670us
```

We can execute our entire suite and discover all integration tests automatically:

```bash
$ tremor test integration tests
```

Generally, reusable logic and the `TREMOR_PATH` environment variable will be set where
external modules, such as utilities in the standard library are being used in a test.

Our worked example has no external module dependencies so we omit this.

The full source for [this example](__GIT__/tests/integration/example2).

Any output from the system under test will be captured in log files

```bash
$ cd tests/integration/example2
$ ls *.log
fg.err.log  fg.out.log out.log
```

### How do I write a unit test suite?

Within our parent `tests` folder, we can create one or many sub folders to
contain unit test suites:

```bash
$ cd tests
$ mkdir unit
$ cd unit
$ echo '[ "unit" ]' >> tags.yaml
```

Let us create a unit test suite called `example3`

```bash
$ cd tests/unit
$ mkdir example3
$ cd example3
$ echo '[ "unit", "example3" ]' >> tags.yaml
```

Create a metadata file `meta.yaml` that encapsulates our unit test conditions:

```tremor
{
    "kind": "Unit",
    "includes": "all.tremor"
}
```

As this is a `unit` test we need to provide a test `suite`:

```tremor
# We import the `std::test` module with unit test support
use std::test;

# We include a function for simplicity in this example
fn square(x) with
  x * x
end;

# Our suite of tests
test::suite({
  "name": "square test",
  "tags": ["square"],
  "tests": [
    test::test({
      "name": "square_2",
      "test": test::assert("square_2", square(2), 4)
    }),
    test::test({
      "name": "square_4",
      "test": test::assert("square_4", square(4), 16)
    }),
    test::test({
      "name": "square_10",
      "test": test::assert("square_10", square(10), 100)
    }),
  ]
});
```

We can execute this test directly in the current working folder .

```bash
$ cd tests/unit/example3
$ tremor test unit .
Framework: Finding unit test scenarios
  Unit Test Scenario: /workspace/tremor-www/docs/operations/tests/unit/example3/all.tremor
    Tags:  unit example3

    Suite: square test
      Tags:  square unit example3
   Stats: Pass 3 Fail 0 Skip 0  Asserts 3 
    Elapsed: 4ms 611us
  Unit Stats: Pass 3 Fail 0 Skip 0  Asserts 3 



All Unit Stats: Pass 3 Fail 0 Skip 0  Asserts 3 
Total Stats: Pass 3 Fail 0 Skip 0  Asserts 3 
Total Elapsed: 7ms 263us
```

We can execute our entire suite and discover all integration tests automatically:

```bash
$ tremor test unit tests
```

Generally, reusable logic and the `TREMOR_PATH` environment variable will be set where
external modules, such as utilities in the standard library are being used in a test.

Our worked example has no external module dependencies so we omit this.

The full source for [this example](__GIT__/tests/unit/example3).

### Further examples

Tremor ships with more complete examples that we run as part of our CI and CD
processes that can be referenced [here](https://github.com/tremor-rs/tremor-runtime/tree/main/tremor-cli/tests).

## Debugging facilities

Debugging commands useful for contributors, language writers, and tremor
operators and authors.

### Options

| Name             | Switch | Kind        | Multiple | Description                                                                                  |
|------------------|--------|-------------|----------|----------------------------------------------------------------------------------------------|
| `--no-banner`    | `-b`   | switch/flag | no       | Do not print the banner ( default: `false` )                                                 |
| `--no-highlight` | `-n`   | switch/flag | no       | Do not highlight output ( default: `false`                                                   |
| `--raw`          | `-r`   | switch/flag | no       | Do not output any formatting. Disables highlight, banner, line numbers. ( default: `false` ) |

### Sub Commands

| Command         | Description                                                                                            |
|-----------------|--------------------------------------------------------------------------------------------------------|
| [dot](#dbg-dot) | prints the .dot representation for a query (you can use `| dot -Tpng -oout.png` to generate a picture) |
| [ast](#dbg-ast) | prints the AST of the source                                                                           |
| [lex](#dbg-lex) | prints lexemes                                                                                         |
| [src](#dbg-src) | prints source                                                                                          |

### dbg **dot**

Generates a [GraphViz](https://graphviz.org/) `.dot` graph representation for a query.

### How to generate a GraphViz `.dot` file on standard output

```bash
$ tremor dbg dot [<SCRIPT>]
```

### How to generate a GraphViz `.dot` file as PNG

```bash
$ tremor dbg dot foo.troy | dot -Tpng -o foo.troy.png
```
### dbg **ast**

Generate the Abstract syntax Tree ( AST ) of a valid tremor source files

```bash
$ tremor dbg ast [<SCRIPT>]
```
### dbg **lex**

Prints a representation of the lexical token stream for the source passed.

This tool is useful for understanding the lexical structure of a tremor source,
or when troubleshotting and debugging changes to the lexer.

```bash
$ tremor dbg lex [<SCRIPT>]
```
### dbg **src**

Prints a syntax highlighted representation of the source based on the lexical token
stream.

::note
This tool will highlight source even if the code is semantically incorrect. To check
for validity the `ast` tool can be used to emit a hygienic error for these cases. The
`lex` tool can be used to compare file variants.

```bash
$ tremor dbg src [<SCRIPT>]
```
## Interactive Development

Run tremor script or query files against stdin or a json data archive, the data will be read from STDIN or an archive and written to STDOUT.

This command supports execution of `troy` files but we recommend using `tremor server run` instead.

```bash
$ tremor run [<OPTIONS>] <SCRIPT>
```

### Options

| Name              | Switch | Kind        | Multiple | Description                                                               |
|-------------------|--------|-------------|----------|---------------------------------------------------------------------------|
| SCRIPT            | None   | switch/flag | no       | filename to run the data through                                          |
| `--interactive`   | None   | switch/flag | no       | Should not output to consumed source / produced synthetic data or errors  |
| `--pretty`        | None   | switch/flag | no       | Should not pretty print data [ when in interactive mode ]                 |
| `--encoder`       | `-d`   | switch/flag | no       | The codec to use for encoding the data ( default: `json` )                |
| `--decoder`       | `-e`   | switch/flag | no       | The codec to use for decoding the data ( default: `json` )                |
| `--infile`        | `-i`   | switch/flag | no       | input file ( default: `stdin` )                                           |
| `--outfile`       | `-o`   | switch/flag | no       | output file ( default: `stdout` )                                         |
| `--preprocessor`  | None   | switch/flag | no       | preprocessor to pass data through before decoding ( default: `separate` ) |
| `--postprocessor` | None   | switch/flag | no       | postprocessor to pass data through after encoding ( default: `separate` ) |
| output-port       | None   | switch/flag | no       | selects the port to pull output                                           |

### How do I interactively test work under development?

Given a simple tremor script:

```tremor
fn square(x) with
  x * x
end;

square(event)
```

```bash
$ tremor run source.tremor
> 1
1
> 2
4
```

We can test hygienic errors by using a bad codec:

```bash
$ tremor run -d string source.tremor
> *
Error in source.tremor:2:3 
    2 |   x * x
      |   ^^^^^ The binary operation `*` is not defined for the type `string` and `string`
```
And we can exercise preprocessors:

```bash
$ tremor run -e string --postprocessor base64 source.tremor
> 1
MQ==
```

## Documentation Generation

This tool generates markdown documentation against modular tremor source designed
for inclusion into other projects. This tool is used by tremor itself to generate
its own standard library documentation on the tremor website.

The tool traverses modular source contained within a module root and documents
definitions available within `.troy` and `.tremor` files.

```bash
$ tremor doc [<DIR>] [<OUTDIR>]
```

### Options

| Name            | Switch | Kind        | Multiple | Description                         |
|-----------------|--------|-------------|----------|-------------------------------------|
| `--interactive` | `-i`   | switch/flag | no       | Generates output to standard output |

### Arguments

| Name   | Switch | Kind        | Multiple | Description                                   |
|--------|--------|-------------|----------|-----------------------------------------------|
| DIR    | None   | switch/flag | no       | Directory or source to generate documents for |
| OUTDIR | None   | switch/flag | no       | Directory to generate documents into          |


### Generating documents for the standard library

```bash
$ tremor doc /path/to/tremor/lib /tmp/docs
```

## Template

This command generates a new project template that can be used as a starting point.

```bash
$ tremor new <NAME>
```

### Arguments

| Name | Switch | Kind        | Multiple | Description         |
|------|--------|-------------|----------|---------------------|
| NAME | None   | switch/flag | no       | Name of the project |

