---
sidebar_label: logging (Tremor pluggable logging)
sidebar_position: 1
---

# The `logging` Connector

The `logging` connector collects and forwards of various kind of logs, which can be categorized as `info`, `warn`, `trace`, `error` and `debug` logs.

## Configuration

We use the standard definition of the logging connector of the standard library and the passthrough

```tremor
use tremor::pipelines;
use tremor::connectors;

create connector logging from connectors::logs;
...
 
# Redirect system logs to a user pipeline
connect /connector/logs to /pipeline/passthrough

...
```

## Format the data

```tremor
{"level":"INFO","args":"[Source::logging_flow::console] Starting...","origin":"Rust",
"path":"tremor_runtime::connectors::source","file":"src/connectors/source.rs","line":634}
```

Where:

| field       	| type                      | description                                                                 |
|---------------|---------------------------|-----------------------------------------------------------------------------|
| level			| string                    | The type of log                                                             |
| args			| string                    | The informations message                                                    |
| origin		| string	                | There are two types of origin `Tremor = user logs` and `Rust = system logs` |
| file,path		| string					| file and path										                          |
| line			| int						| line                                  									  |



## How do i capture system logs to standard output?

Capture and redirect system logs and redirect to standard output

```tremor
define flow logging_flow
flow
	use tremor::pipelines;
	use tremor::connectors;

	# define and create logging connectors
	define connector logging from logs;
	create connector logging;

	# Create console connectors
	create connector console from connectors::console;

	# Create pipeline
	create pipeline passthrough from pipelines::passthrough;

	# Connections
	connect /connector/logging to /pipeline/passthrough;
	connect /pipeline/passthrough to /connector/console;
end;

deploy flow logging_flow;
```
### Running as service
The logic can be used as starting point for your own client or service via `tremor -p server run`.

```bash
$ export TREMOR_PATH=/path/to/tremor-runtime/tremor-script/lib:/path/to/tremor-runtime/tremor-cli/tests/lib
$ tremor server run config.troy
```