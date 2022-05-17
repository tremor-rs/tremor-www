# Monitoring

Monitoring tremor is done using tremor itself. This has some interesting implications.

Each connector pipeline emits metric, they can be subscribed to from the [metrics connector](../reference/connectors/metrics.md). This allows to both write these messages to a destination system such as InfluxDB, as well as to a message queue such as Kafka.

The rate at which metrics are published can be defined, for pipeliunes with the config directive `#!config metrics_interval_s = <time>`  and for connectors with the argument `metrics_interval_s = <time>` in the `with` part of the connector definition.

By default metrics are turned off.

Metrics are formatted following the same structure as the [Influx Codec](../reference/codecs/influx.md).

## Pipeline metrics

Example:

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

In influx format:

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

## Connector metrics

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

In influx format:

```influx
connector_events,port=out,ramp=example_connector count=42 1576215344378248634
```

In this structure `measurement` is always `connector_events` as that is what this is measuring. The number of events is always in the field `count` as we are counting them.

The `tags` section explains where this measurement was taken:

- `connector` is the `id` of the connector
- `port` is one of `in`, `out` and `error` (or any other port used by the connector)

The example above measures all events that were emitted out by the connector `example_connector`.

Notes:

- Preprocessor and codec level errors count as errors for connector metrics.
- If your pipeline is using the [batch operator](../language/queries/operators#genericbatch) and connector is receiving events from it, no of events tracked at connector is going to be dictated by the batching config.

## Operator level metrics

In addition to the metrics provided by the pipeline itself, some operators can generate additional metrics.

The details are documented on a per operator level. Currently the following operators provide custom metrics:

- [grouper::bucket](../language/queries/operators#grouperbucket)

## Example

And example can be found in the [metrics guide](../guides/metrics.md#tremor-metrics)