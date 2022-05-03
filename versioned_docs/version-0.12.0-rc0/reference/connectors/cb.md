# The `cb` Connector

The `cb` connector is for testing circuit breaker internals.

The connector expects a circuit breaker event for each event propagated
and then, the latest after a configurable `timeout` has been exceeded,
it halts or exits the tremor process.

On halting, if accounting for circuit breaker events detects missing or
unaccounted events it exits with a process status code of `1`.

If the circuit breaker events are processed correctly then the process will
exit with a process status code of `0`.

## Configuration

Options specific to this connector:
- `path` - The path to the file to read from, expecting 1 JSON event payload per line.
- `timeout` - The time to wait for circuit breaker events in milliseconds. If this timeout is exceeded, the tremor process is terminated.

## Configuration

```troy
  # File: example.troy
  define connector my_cb from cb
  with
    codec = "json",		# Events are line delimited JSON
    config = {
      "path": "in.json",	# File from which to replay events
      "timeout": 1000,		# Timeout of 1 second as 1000 milliseconds ( default: 10 seconds as 10,000 milliseconds )
    }
  end;
```

## Examples

|Name|Description|
|---|---|
|[Validate dead ends are dropped](https://github.com/tremor-rs/tremor-runtime/tree/main/tremor-cli/tests/integration/cb-drop-dead-ends)|All required circuit breaker events are received and processed correctly|
|[Validate pipeline to pipeline](https://github.com/tremor-rs/tremor-runtime/tree/main/tremor-cli/tests/integration/cb-pipeline-to-pipeline)|All required circuit breaker events are received and processed correctly|
|[Validate auto-acknowledged sinks](https://github.com/tremor-rs/tremor-runtime/tree/main/tremor-cli/tests/integration/cb-with-auto-ack-sink)|All required circuit breaker events are received and processed correctly|

