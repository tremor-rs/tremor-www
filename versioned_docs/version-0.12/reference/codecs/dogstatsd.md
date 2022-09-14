# dogstatsd

The `dogstatsd` codec supports the [Datadog DogStatsD v1.2 protocol](https://docs.datadoghq.com/developers/dogstatsd/datagram_shell).

The format is similar the `statsd` format, but also includes events and service checks.

The codec translates a single `dogstatsd` measurement line into a structured event.

## Examples

The native format of a single dogstatsd event line is as follows:

### Metric

```text
datadog.metric:7|c|@0.1|#example_tag:example_value
```

The equivalent representation as a tremor value:

```json
{
  "metric": {
    "type": "c",
    "metric": "datadog.metric",
    "values": [7],
    "sample_rate": 0.1,
    "tags": ["example_tag:example_value"]
  }
}
```

## Supported types

- `c` for `counter`
- `ms` for `timing`
- `g` for `gauge`
- `h` for `histogram`
- `s` for `sets`
- `d` for `distribution`


### Event

```text
_e{21,36}:An exception occurred|Cannot parse CSV file from 10.0.0.17
```

The equivalent representation as a tremor value:

```json
{
  "event": {
    "title": "An exception occurred",
    "text": "Cannot parse CSV file from 10.0.0.17",
  }
}
```


### Service Check

```text
_sc|Redis connection|2|#env:dev|m:Redis connection timed out after 10s
```

The equivalent representation as a tremor value:

```json
{
  "service_check": {
    "name": "Redis connection",
    "status": 2,
    "tags": ["env:dev"],
    "message": "Redis connection timed out after 10s",
  }
}
```