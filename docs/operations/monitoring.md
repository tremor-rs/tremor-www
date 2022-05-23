# Monitoring

Monitoring tremor is done using tremor itself. This has some interesting implications.

Each connector and each pipeline emit metrics, they can be subscribed to using the [metrics connector](../reference/connectors/metrics.md). This allows to both write these messages to a destination system such as InfluxDB, as well as to a message queue such as Kafka.

The rate at which metrics are published can be defined for each connector and pipeline.

By default metrics are turned off.

Metrics are formatted following the same structure as the [Influx Codec](../reference/codecs/influx.md).

## Metrics

Tremor allows collecting it's own metrics and processing them, this enables us to send metrics to any system tremor can connect to and not force our users into a specific ecosystem. 

An example can be found in the [metrics guide](../guides/metrics.md#tremor-metrics)

### Pipeline metrics

Configuring metrics for pipelines is done with the config directive:

```
#!config metrics_interval_s = <seconds>
```

This directive determines the interval in seconds at which metrics events are emitted from the pipeline into the metrics connector.

Example pipeline definition:

```tremor
define pipeline with_metrics
pipeline
  #!config metrics_interval_s = 5
  select event from in into out;
end;
```

This pipeline will emit a metrics event every 5 seconds.

Each pipeline will emit 1 metrics event per interval with a count of the events it received on its input port (Usually `in`).

Example metrics event:

```json
{
  "measurement": "events",
  "tags": {
    "direction": "output",
    "node": "in",
    "pipeline": "main",
    "port": "out"
  },
  "fields": { "count": 20 },
  "timestamp": 1553077007898214000
}
```

In [influx](../reference/codecs/influx.md) format:

```influx
events,port=out,direction=output,node=in,pipeline=main count=20 1553077007898214000
```

In this structure `measurement` is always `events` as that is what this is measuring. The number of events is always in the field `count` as we are counting them.

The `tags` section explains where this measurement was taken:

- `direction` means if this event came into the node `"input"` or came out of the node `"output"`
- `node` is the `id` of the node in a given pipeline
- `pipeline` is the `id` of the pipeline
- `port` is the point the event was received or send from

The example above measures all events that left the `in` of pipeline `main`.

In addition to the general pipeline metrics, some operators do generate their own metrics, for details please check on the documentation for the operator in question.

### Connector metrics

For connectors metrics can be configured with the argument `metrics_interval_s = <time>` in the `with` part of the connector definition.

Example connector definition:

```tremor
define connector with_metrics from stdio
with
  metrics_interval_s = 7,
  codec = "string",
  preprocessors = ["separate"],
  postprocessors = ["separate"]
end;
```

This connector will emit 1 metrics event for each port. `in` for received events, `out` for emitted events and `err` for emitted error events (e.g. if a codec failed to decode an event).

```json
{
  "measurement": "connector_events",
  "tags": {
    "port": "out",
    "connector": "example_connector"
  },
  "fields": { "count": 42 },
  "timestamp": 1576215344378248634
}
```

In [influx](../reference/codecs/influx.md) format:

```influx
connector_events,port=out,ramp=example_connector count=42 1576215344378248634
```

In this structure `measurement` is always `connector_events` as that is what this is measuring. The number of events is always in the field `count` as we are counting them.

The `tags` section explains where this measurement was taken:

- `connector` is the `id` of the connector
- `port` is one of `in`, `out` and `err` (or any other port used by the connector)

The example above measures all events that were emitted out by the connector `example_connector`.

Notes:

- Preprocessor and codec level errors count as errors for connector metrics.
- If your pipeline is using the [batch operator](../reference/operators#genericbatch) and connector is receiving events from it, no of events tracked at connector is going to be dictated by the batching config.

### Operator level metrics

In addition to the metrics provided by the pipeline itself, some operators can generate additional metrics.

The details are documented on a per operator level. Currently the following operators provide custom metrics:

- [grouper::bucket](../reference/operators/bucket.md)

## Logging

Tremor uses the [log4rs](https://docs.rs/log4rs) this allows a rather flexible configuration that can be changed without restarting tremor. An alternative is setting `RUST_LOG` for global lgo levels as provided by [env_logger](https://docs.rs/env_logger).

The log4rs config yaml is passed in over the `-l` arugment. An example would be:

```yaml
refresh_rate: 30 seconds

appenders:
  stdout:
    kind: console

root:
  level: warn
  appenders:
    - stdout

loggers:
  tremor_runtime:
    level: debug
    appenders:
      - stdout
    additive: false
  tremor:
    level: debug
    appenders:
      - stdout
    additive: false
```

More about the format can be found [in the documentation](https://docs.rs/log4rs/latest/log4rs/).

