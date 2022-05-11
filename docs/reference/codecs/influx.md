# influx

The `influx` codec supports the [influx line protocol](https://docs.influxdata.com/influxdb/v1.7/write_protocols/line_protocol_tutorial/).

## Example

A single line of data in influx line protocol format:

```text
weather,location=us-midwest temperature=82 1465839830100400200
```

The equivalent tremor value representation::

```json
{
  "measurement": "weather",
  "tags": { "location": "us-midwest" },
  "fields": { "temperature": 82.0 },
  "timestamp": 1465839830100400200
}
```

