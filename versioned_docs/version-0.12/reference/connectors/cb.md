---
sidebar_label: cb (Circuit Breaker)
sidebar_position: 101
---

# The `cb` Connector

:::info

This connector is not intended for production use, but for testing the Tremor runtime itself. To enable it pass `--debug-connectors` to tremor.

:::


The `cb` connector is for testing circuit breaker internals.

The connector expects a circuit breaker event for each event propagated
and then, the latest after a configurable `timeout` has been exceeded,
it halts or exits the tremor process and reports on the validation result via stdout.

Most of the time it is used to test the behaviour of the whole runtime when it comes to the circuit breaker and guaranteed delivery (ack/fail) mechanisms. To that end use the connector as source and sink of events by connecting your tremor pipeline application with the `in` and `out` port of this connector.
It can also be used to test the behaviour of connectors acting as event sinks, checking if they handle all events correctly, in this case connect the `in` port of the connector to test against to the `out` port of the `cb` connector via a pipeline of your choice.


## Ports

- `in`: This Connector is expecting events that trigger certain Circuit Breaker and/or Event acknowledge/fail behaviour. See [Expected Input Data](#expected-input-data).
- `out`: When configured with [`path`](#configuration) this connector will emit events on the `out` port.

## Configuration

| Config Option  | Description                                                                                                                                                                                         | Possible Values  | Required / Optional                | Default Value               |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|------------------------------------|-----------------------------|
| path           | Path to the file to load data from. The file will be split into lines and each will form one event. Only required for the source part.                                                              | file path        | Only required for the source part. |                             |
| timeout        | Timeout in nanoseconds to wait for circuit breaker messages after all events from the `path` file have been sent. After this timeout is expired the Tremor process will be stopped.                 | positive integer | optional                           | 10_000_000_000 (10 seconds) |
| expect_batched | When set to `true` changes verifcation mode for testing applications involving [batching](../operators/batch.md). That means only not all events are required to be acknowledged, only all batches. | boolean          | optional                           | false                       |

### Example

```tremor title="cb_example.troy"
define flow cb_example
flow
  use tremor::pipelines;
  use std::time::nanos;

  define connector my_cb from cb
  with
    codec = "json",		# Events are line delimited JSON
    config = {
      "path": "in.json",	# File from which to replay events
      "timeout": nanos::from_seconds(1)
    }
  end;
  create connector my_cb;

  create pipeline passthrough from pipelines::passthrough;

  # connect both the `out` and the `in` port of the connector 
  # via a simple passthrough pipeline.
  # (The ports can also be omitted for brevity)
  connect /connector/my_cb/out to /pipeline/passthrough/in;
  connect /pipeline/passthrough/out to /connector/my_cb/in;
end;

deploy flow cb_example;
```

## Expected Data Format

This connector expects events that can trigger certain Circuit Breaker and Event acknowledgement behaviour via its `in` port.

The event can contain the `cb` specific payload in either the event metadata or the event payload.

The expected is a JSON document with a string or array beneath the key `"cb"`.

The `"cb"` values can be one of the following (or multiple):

| Value           | Description                                                                                                             |
|-----------------|-------------------------------------------------------------------------------------------------------------------------|
| ack             | Send a runtime-internal message upstream in order to **acknowledge the event**.                                         |
| fail            | Send a runtime-internal message upstream in order to **fail the event**.                                                |
| close / trigger | *Close* or *trigger* the circuit breaker, so that all upstream connectors stop sending events until it is opened again. |
| open / restore  | *Open* or *restore* the circuit breaker, so that all upstream connectors start sending events again.                    |

:::info

Only 1 value of the pairs `ack` - `fail` and `open` / `restore` and `close` / `trigger` will be considered.

:::

### Examples

```js
{ "cb": "ack" }    // this will acknowledge the event
{ "cb": "open" }   // this will open the circuit breaker
{ "cb": ["fail", "trigger"] } // this will fail the event and close the circuit breaker
```

## Example usage

| Name                                                                                                                                         | Description                                                              |
|----------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| [Validate dead ends are dropped](https://github.com/tremor-rs/tremor-runtime/tree/main/tremor-cli/tests/integration/cb-drop-dead-ends)       | All required circuit breaker events are received and processed correctly |
| [Validate pipeline to pipeline](https://github.com/tremor-rs/tremor-runtime/tree/main/tremor-cli/tests/integration/cb-pipeline-to-pipeline)  | All required circuit breaker events are received and processed correctly |
| [Validate auto-acknowledged sinks](https://github.com/tremor-rs/tremor-runtime/tree/main/tremor-cli/tests/integration/cb-with-auto-ack-sink) | All required circuit breaker events are received and processed correctly |

