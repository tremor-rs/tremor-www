---
sidebar_label: "null (No messages)"
sidebar_position: 100
---

# The `null` Connector

::: info

This connector is not intended for production use, but for testing the Tremor runtime itself. To enable it pass `--debug-connectors` to tremor.

:::


The `null` connector is a connector that is used during development.

Events sent to its source are discarded on receive.

Events sent to its sink are discarded on receive.

## Configuration

There is no specific configuration required for this connector

```tremor title="example.troy"
  define connector nil from `null`;
```

## A `null` integration test

Although designed for tests written in the rust programming language
rather than the integration test framework, it could be used in an
integration test as follows:

```tremor title="config.troy"
define flow main
flow
  use integration;

  define connector nil from `null`;
  create connector nil;

  create connector exit from integration::exit;
  create connector out from integration::write_file;
  create connector in from integration::read_file;
  create pipeline main from integration::out_or_exit;

  connect /connector/in to /pipeline/main;
  connect /pipeline/main to /connector/out;
  connect /pipeline/main to /connector/nil;
  connect /pipeline/main/exit to /connector/nil;
  connect /pipeline/main/exit to /connector/exit;
  
end;
deploy flow main;
```

We can then execute the test as follows
```bash
$ export TREMOR_PATH=/path/to/tremor-runtime/tremor-script/lib:/path/to/tremor-runtime/tremor-cli/tests/lib
$ tremor test integration .
```

## Constraints

It is an error to attempt to run any deployment using the `null` connector
via the regular server execution command in the `tremor` command line interface

```bash
➜  null-exit git:(main) ✗ tremor server run config.troy
tremor version: 0.12
tremor instance: tremor
rd_kafka version: 0x000002ff, 1.8.2
allocator: snmalloc
[2022-04-12T15:28:23Z ERROR tremor_runtime::system] Error starting deployment of flow main: Unknown connector type null
Error: An error occurred while loading the file `config.troy`: Error deploying Flow main: Unknown connector type null
[2022-04-12T15:28:23Z ERROR tremor::server] Error: An error occurred while loading the file `config.troy`: Error deploying Flow main: Unknown connector type null
We are SHUTTING DOWN due to errors during initialization!
[2022-04-12T15:28:23Z ERROR tremor::server] We are SHUTTING DOWN due to errors during initialization!
```
