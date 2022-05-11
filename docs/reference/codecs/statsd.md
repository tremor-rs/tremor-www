# statsd

The `statsd` codec supports the [statsd format](https://github.com/statsd/statsd#usage).

The format is similar the `influx` line protoco` line protocoll.

The codec translates a single `statsd` measurement line into a structured event

## Example

The native format of a single statsd event line is as follows:

```text
sam:7|c|@0.1
```

The equivalent representation as a tremor value:

```json
{
  "type": "c",
  "metric": "sam",
  "value": 7,
  "sample_rate": 0.1
}
```

## Supported types

- `c` for `counter`
- `ms` for `timing`
- `g` for `gauge`
- `h` for `histogram`
- `s` for `sets`

## Considerations

For **gauge** there is also the field `action` which might be `add` if the value was prefixed with a `+`, or `sub` if the value was prefixed with a `-`

