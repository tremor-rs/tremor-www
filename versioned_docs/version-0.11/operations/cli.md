---
sidebar_position: 99
---

# Tremor cli v0.11

Tremor cli - Command Line Interface


## Scope

This document summarises the `tremor` cli commands.

## Audience

Tremor operators and developers

## General flags and switches

        

**Arguments**

| Name     | Switch | Kind        | Multiple | Description                 |
|----------|--------|-------------|----------|-----------------------------|
| verbose  | None   | switch/flag | yes      | Sets the level of verbosity |
| instance | None   | switch/flag | no       | Instance identifier         |

## Commands

**Subcommands**

| Command                     | Description                                                                                                                                  |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| [completions](#completions) | Generate shell completions to stdout. Tries to guess the shell if no subcommand is given.                                                    |
| [server](#server)           | Tremor server                                                                                                                                |
| [test](#test)               | Testing facilities                                                                                                                           |
| [dbg](#dbg)                 | Advanced debugging commands                                                                                                                  |
| [run](#run)                 | Run tremor script or query files against stdin or a json data archive, the data will be read from STDIN or an archive and written to STDOUT. |
| [doc](#doc)                 | Generates documention from tremor script files                                                                                               |
| [api](#api)                 | Tremor API client                                                                                                                            |

### **completions**

Generate shell completions to stdout. Tries to guess the shell if no subcommand is given.


**Subcommands**

| Command                               | Description                               |
|---------------------------------------|-------------------------------------------|
| [guess](#completions-guess)           | Generate completion based on active shell |
| [bash](#completions-bash)             | Generate bash shell completions           |
| [zsh](#completions-zsh)               | Generate zsh shell completions            |
| [elvish](#completions-elvish)         | Generate elvish shell completions         |
| [fish](#completions-fish)             | Generate fish shell completions           |
| [powershell](#completions-powershell) | Generate powershell shell completions     |

#### completions **guess**

Generate completion based on active shell

**Usage**

```
tremor completions guess
```

#### completions **bash**

Generate bash shell completions

**Usage**

```
tremor completions bash
```

#### completions **zsh**

Generate zsh shell completions

**Usage**

```
tremor completions zsh
```

#### completions **elvish**

Generate elvish shell completions

**Usage**

```
tremor completions elvish
```

#### completions **fish**

Generate fish shell completions

**Usage**

```
tremor completions fish
```

#### completions **powershell**

Generate powershell shell completions

**Usage**

```
tremor completions powershell
```

### **server**

Tremor server


**Subcommands**

| Command            | Description                    |
|--------------------|--------------------------------|
| [run](#server-run) | Runs the tremor server process |

#### server **run**

Runs the tremor server process

**Usage**

```
tremor server run
```

**Arguments**

| Name              | Switch | Kind        | Multiple | Description                                                         |
|-------------------|--------|-------------|----------|---------------------------------------------------------------------|
| artefacts         | None   | switch/flag | yes      | Paths to files containing pipelines, onramps, offramps to provision |
| storage-directory | None   | switch/flag | no       | Directory to cache/store runtime type information                   |
| pid               | None   | switch/flag | no       | Captures process id if set and stores in a file                     |
| no-api            | None   | switch/flag | no       | Disable the API                                                     |
| api-host          | None   | switch/flag | no       | The `host:port` to listen for the API                               |
| logger-config     | None   | switch/flag | no       | log4rs config                                                       |
| recursion-limit   | None   | switch/flag | no       | function tail-recursion stack depth limit                           |

### **test**

Testing facilities

**Usage**

```
tremor test [<MODE>] [<PATH>]
```

**Arguments**

| Name     | Switch | Kind        | Multiple | Description                                                               |
|----------|--------|-------------|----------|---------------------------------------------------------------------------|
| MODE     | None   | switch/flag | no       | One of `all`, `api`, `bench`, `command`, `integration`, `rest`, or `unit` |
| PATH     | None   | switch/flag | no       | The root test path                                                        |
| REPORT   | None   | switch/flag | no       | Should generate a test report to specified path                           |
| INCLUDES | None   | switch/flag | yes      | Optional tags to filter test executions by                                |
| EXCLUDES | None   | switch/flag | yes      | Optional tags to filter test executions by                                |
| QUIET    | None   | switch/flag | no       | do not print skipped tests                                                |

### **dbg**

Advanced debugging commands


**Arguments**

| Name         | Switch | Kind        | Multiple | Description             |
|--------------|--------|-------------|----------|-------------------------|
| no-banner    | None   | switch/flag | no       | do not print the banner |
| no-highlight | None   | switch/flag | no       | do not highlight output |

**Subcommands**

| Command                       | Description                                                                                                   |
|-------------------------------|---------------------------------------------------------------------------------------------------------------|
| [dot](#dbg-dot)               | prints the .dot representation for a trickle file (you can use `| dot -Tpng -oout.png` to generate a picture) |
| [ast](#dbg-ast)               | prints the AST of the source                                                                                  |
| [preprocess](#dbg-preprocess) | prints the preprocessed source                                                                                |
| [lex](#dbg-lex)               | prints lexemes                                                                                                |
| [src](#dbg-src)               | prints source                                                                                                 |

#### dbg **dot**

prints the .dot representation for a trickle file (you can use `| dot -Tpng -oout.png` to generate a picture)

**Usage**

```
tremor dbg dot [<SCRIPT>]
```

**Arguments**

| Name   | Switch | Kind        | Multiple | Description             |
|--------|--------|-------------|----------|-------------------------|
| SCRIPT | None   | switch/flag | no       | trickle script filename |

#### dbg **ast**

prints the AST of the source

**Usage**

```
tremor dbg ast [<SCRIPT>]
```

**Arguments**

| Name       | Switch | Kind        | Multiple | Description                         |
|------------|--------|-------------|----------|-------------------------------------|
| exprs-only | None   | switch/flag | no       | only prints the expressions         |
| SCRIPT     | None   | switch/flag | no       | tremor/json/trickle script filename |

#### dbg **preprocess**

prints the preprocessed source

**Usage**

```
tremor dbg preprocess [<SCRIPT>]
```

**Arguments**

| Name   | Switch | Kind        | Multiple | Description                         |
|--------|--------|-------------|----------|-------------------------------------|
| SCRIPT | None   | switch/flag | no       | tremor/json/trickle script filename |

#### dbg **lex**

prints lexemes

**Usage**

```
tremor dbg lex [<SCRIPT>]
```

**Arguments**

| Name   | Switch | Kind        | Multiple | Description                         |
|--------|--------|-------------|----------|-------------------------------------|
| SCRIPT | None   | switch/flag | no       | tremor/json/trickle script filename |

#### dbg **src**

prints source

**Usage**

```
tremor dbg src [<SCRIPT>]
```

**Arguments**

| Name   | Switch | Kind        | Multiple | Description                         |
|--------|--------|-------------|----------|-------------------------------------|
| SCRIPT | None   | switch/flag | no       | tremor/json/trickle script filename |

### **run**

Run tremor script or query files against stdin or a json data archive, the data will be read from STDIN or an archive and written to STDOUT.


**Usage**

```
tremor run [<SCRIPT>]
```

**Arguments**

| Name          | Switch | Kind        | Multiple | Description                                                              |
|---------------|--------|-------------|----------|--------------------------------------------------------------------------|
| SCRIPT        | None   | switch/flag | no       | filename to run the data through                                         |
| interactive   | None   | switch/flag | no       | Should not output to consumed source / produced synthetic data or errors |
| pretty        | None   | switch/flag | no       | Should not pretty print data [ when in interactive mode ]                |
| ENCODER       | None   | switch/flag | no       | The codec to use for encoding the data                                   |
| DECODER       | None   | switch/flag | no       | The codec to use for decoding the data                                   |
| INFILE        | None   | switch/flag | no       | input file                                                               |
| OUTFILE       | None   | switch/flag | no       | output file                                                              |
| PREPROCESSOR  | None   | switch/flag | no       | preprocessor to pass data through before decoding                        |
| POSTPROCESSOR | None   | switch/flag | no       | postprocessor to pass data through after encoding                        |
| output-port   | None   | switch/flag | no       | selects the port to pull output                                          |

### **doc**

Generates documention from tremor script files


**Usage**

```
tremor doc [<DIR>] [<OUTDIR>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                   |
|-------------|--------|-------------|----------|-----------------------------------------------|
| interactive | None   | switch/flag | no       | generates output to standard output           |
| DIR         | None   | switch/flag | no       | directory or source to generate documents for |
| OUTDIR      | None   | switch/flag | no       | directory to generate documents into          |

### **api**

Tremor API client


**Arguments**

| Name   | Switch | Kind        | Multiple | Description               |
|--------|--------|-------------|----------|---------------------------|
| FORMAT | None   | switch/flag | no       | Sets the output format    |
| CONFIG | None   | switch/flag | no       | Sets a custom config file |

**Subcommands**

| Command                   | Description                                    |
|---------------------------|------------------------------------------------|
| [version](#api-version)   | Get tremor version                             |
| [target](#api-target)     | Target one or many tremor server instances     |
| [binding](#api-binding)   | Query/update binding specification repository  |
| [pipeline](#api-pipeline) | Query/update pipeline specification repository |
| [onramp](#api-onramp)     | Query/update onramp specification repository   |
| [offramp](#api-offramp)   | Query/update offramp specification repository  |

#### api **version**

Get tremor version

**Usage**

```
tremor api version
```

#### api **target**

Target one or many tremor server instances


**Subcommands**

| Command                      | Description                   |
|------------------------------|-------------------------------|
| [list](#api-target-list)     | List registered targets       |
| [create](#api-target-create) | Create a new API target       |
| [delete](#api-target-delete) | Delete an existing API target |

##### api target **list**

List registered targets

**Usage**

```
tremor api target list
```

##### api target **create**

Create a new API target

**Usage**

```
tremor api target create [<TARGET_ID>] [<SOURCE>]
```

**Arguments**

| Name      | Switch | Kind        | Multiple | Description                                           |
|-----------|--------|-------------|----------|-------------------------------------------------------|
| TARGET_ID | None   | switch/flag | no       | The unique target id for the targetted tremor servers |
| SOURCE    | None   | switch/flag | no       | JSON or YAML file request body                        |

##### api target **delete**

Delete an existing API target

**Usage**

```
tremor api target delete [<TARGET_ID>]
```

**Arguments**

| Name      | Switch | Kind        | Multiple | Description                                           |
|-----------|--------|-------------|----------|-------------------------------------------------------|
| TARGET_ID | None   | switch/flag | no       | The unique target id for the targetted tremor servers |

#### api **binding**

Query/update binding specification repository


**Subcommands**

| Command                               | Description                                               |
|---------------------------------------|-----------------------------------------------------------|
| [list](#api-binding-list)             | List registered binding specifications                    |
| [fetch](#api-binding-fetch)           | Fetch a binding by artefact id                            |
| [delete](#api-binding-delete)         | Delete a binding by artefact id                           |
| [create](#api-binding-create)         | Create and register a binding specification               |
| [instance](#api-binding-instance)     | Fetch an binding instance by artefact id and instance id  |
| [activate](#api-binding-activate)     | Activate a binding by artefact id and servant instance id |
| [deactivate](#api-binding-deactivate) | Activate a binding by artefact id and servant instance id |

##### api binding **list**

List registered binding specifications

**Usage**

```
tremor api binding list
```

##### api binding **fetch**

Fetch a binding by artefact id

**Usage**

```
tremor api binding fetch [<ARTEFACT_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                          |
|-------------|--------|-------------|----------|------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the binding specification |

##### api binding **delete**

Delete a binding by artefact id

**Usage**

```
tremor api binding delete [<ARTEFACT_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                          |
|-------------|--------|-------------|----------|------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the binding specification |

##### api binding **create**

Create and register a binding specification

**Usage**

```
tremor api binding create [<SOURCE>]
```

**Arguments**

| Name   | Switch | Kind        | Multiple | Description                    |
|--------|--------|-------------|----------|--------------------------------|
| SOURCE | None   | switch/flag | no       | JSON or YAML file request body |

##### api binding **instance**

Fetch an binding instance by artefact id and instance id

**Usage**

```
tremor api binding instance [<ARTEFACT_ID>] [<INSTANCE_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                          |
|-------------|--------|-------------|----------|------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the binding specification |
| INSTANCE_ID | None   | switch/flag | no       | The unique instance id for the binding specification |

##### api binding **activate**

Activate a binding by artefact id and servant instance id

**Usage**

```
tremor api binding activate [<ARTEFACT_ID>] [<INSTANCE_ID>] [<SOURCE>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                          |
|-------------|--------|-------------|----------|------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the binding specification |
| INSTANCE_ID | None   | switch/flag | no       | The unique instance id for the binding specification |
| SOURCE      | None   | switch/flag | no       | JSON -r YAML file request body                       |

##### api binding **deactivate**

Activate a binding by artefact id and servant instance id

**Usage**

```
tremor api binding deactivate [<ARTEFACT_ID>] [<INSTANCE_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                          |
|-------------|--------|-------------|----------|------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the binding specification |
| INSTANCE_ID | None   | switch/flag | no       | The unique instance id for the binding specification |

#### api **pipeline**

Query/update pipeline specification repository


**Subcommands**

| Command                            | Description                                               |
|------------------------------------|-----------------------------------------------------------|
| [list](#api-pipeline-list)         | List registered pipeline specifications                   |
| [fetch](#api-pipeline-fetch)       | Fetch a pipeline by artefact id                           |
| [delete](#api-pipeline-delete)     | Delete a pipeline by artefact id                          |
| [create](#api-pipeline-create)     | Create and register a pipeline specification              |
| [instance](#api-pipeline-instance) | Fetch an pipeline instance by artefact id and instance id |

##### api pipeline **list**

List registered pipeline specifications

**Usage**

```
tremor api pipeline list
```

##### api pipeline **fetch**

Fetch a pipeline by artefact id

**Usage**

```
tremor api pipeline fetch [<ARTEFACT_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                           |
|-------------|--------|-------------|----------|-------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the pipeline specification |

##### api pipeline **delete**

Delete a pipeline by artefact id

**Usage**

```
tremor api pipeline delete [<ARTEFACT_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                           |
|-------------|--------|-------------|----------|-------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the pipeline specification |

##### api pipeline **create**

Create and register a pipeline specification

**Usage**

```
tremor api pipeline create [<SOURCE>]
```

**Arguments**

| Name   | Switch | Kind        | Multiple | Description                    |
|--------|--------|-------------|----------|--------------------------------|
| SOURCE | None   | switch/flag | no       | JSON or YAML file request body |

##### api pipeline **instance**

Fetch an pipeline instance by artefact id and instance id

**Usage**

```
tremor api pipeline instance [<ARTEFACT_ID>] [<INSTANCE_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                           |
|-------------|--------|-------------|----------|-------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the pipeline specification |
| INSTANCE_ID | None   | switch/flag | no       | The unique instance id for the pipeline specification |

#### api **onramp**

Query/update onramp specification repository


**Subcommands**

| Command                          | Description                                             |
|----------------------------------|---------------------------------------------------------|
| [list](#api-onramp-list)         | List registered onramp specifications                   |
| [fetch](#api-onramp-fetch)       | Fetch an onramp by artefact id                          |
| [delete](#api-onramp-delete)     | Delete an onramp by artefact id                         |
| [create](#api-onramp-create)     | Create and register an onramp specification             |
| [instance](#api-onramp-instance) | Fetch an onramp instance by artefact id and instance id |

##### api onramp **list**

List registered onramp specifications

**Usage**

```
tremor api onramp list
```

##### api onramp **fetch**

Fetch an onramp by artefact id

**Usage**

```
tremor api onramp fetch [<ARTEFACT_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                         |
|-------------|--------|-------------|----------|-----------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the onramp specification |

##### api onramp **delete**

Delete an onramp by artefact id

**Usage**

```
tremor api onramp delete [<ARTEFACT_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                         |
|-------------|--------|-------------|----------|-----------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the onramp specification |

##### api onramp **create**

Create and register an onramp specification

**Usage**

```
tremor api onramp create [<SOURCE>]
```

**Arguments**

| Name   | Switch | Kind        | Multiple | Description                    |
|--------|--------|-------------|----------|--------------------------------|
| SOURCE | None   | switch/flag | no       | JSON or YAML file request body |

##### api onramp **instance**

Fetch an onramp instance by artefact id and instance id

**Usage**

```
tremor api onramp instance [<ARTEFACT_ID>] [<INSTANCE_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                         |
|-------------|--------|-------------|----------|-----------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the onramp specification |
| INSTANCE_ID | None   | switch/flag | no       | The unique instance id for the onramp specification |

#### api **offramp**

Query/update offramp specification repository


**Subcommands**

| Command                           | Description                                              |
|-----------------------------------|----------------------------------------------------------|
| [list](#api-offramp-list)         | List registered offramp specifications                   |
| [fetch](#api-offramp-fetch)       | Fetch an offramp by artefact id                          |
| [delete](#api-offramp-delete)     | Delete an offramp by artefact id                         |
| [create](#api-offramp-create)     | Create and register an offramp specification             |
| [instance](#api-offramp-instance) | Fetch an offramp instance by artefact id and instance id |

##### api offramp **list**

List registered offramp specifications

**Usage**

```
tremor api offramp list
```

##### api offramp **fetch**

Fetch an offramp by artefact id

**Usage**

```
tremor api offramp fetch [<ARTEFACT_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                          |
|-------------|--------|-------------|----------|------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the offramp specification |

##### api offramp **delete**

Delete an offramp by artefact id

**Usage**

```
tremor api offramp delete [<ARTEFACT_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                          |
|-------------|--------|-------------|----------|------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the offramp specification |

##### api offramp **create**

Create and register an offramp specification

**Usage**

```
tremor api offramp create [<SOURCE>]
```

**Arguments**

| Name   | Switch | Kind        | Multiple | Description                    |
|--------|--------|-------------|----------|--------------------------------|
| SOURCE | None   | switch/flag | no       | JSON or YAML file request body |

##### api offramp **instance**

Fetch an offramp instance by artefact id and instance id

**Usage**

```
tremor api offramp instance [<ARTEFACT_ID>] [<INSTANCE_ID>]
```

**Arguments**

| Name        | Switch | Kind        | Multiple | Description                                          |
|-------------|--------|-------------|----------|------------------------------------------------------|
| ARTEFACT_ID | None   | switch/flag | no       | The unique artefact id for the offramp specification |
| INSTANCE_ID | None   | switch/flag | no       | The unique instance id for the offramp specification |
