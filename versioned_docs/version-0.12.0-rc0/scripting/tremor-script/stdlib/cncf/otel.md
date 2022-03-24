
# otel

<p align="center">
<img src="https://raw.githubusercontent.com/cncf/artwork/master/projects/opentelemetry/horizontal/color/opentelemetry-horizontal-color.png" width='35%'/>
</p>

<hr/>

# `CNCF OpenTelemetry` utility functions



* [span_id](otel/span_id.md) - OpenTelemetry Span Id utilities
* [trace_id](otel/trace_id.md) - OpenTelemetry Trace Id utilities
* [logs](otel/logs.md) - OpenTelemetry log event utilities
* [metrics](otel/metrics.md) - OpenTelemetry metrics event utilities
* [trace](otel/trace.md) - OpenTelemetry trace event utilities
## Functions
### gen_span_id_string()

Generate a random span id using the hex string representation

Returns a `string`

### gen_span_id_bytes()

Generate a random span id using the binary representation

Returns a `binary`

### gen_span_id_array()

Generate a random span id using the int array representation

Returns a `array` of `int`

### gen_trace_id_string()

Generate a random trace id using the hex string representation

Returns a `string`

### gen_trace_id_bytes()

Generate a random trace id using the binary representation

Returns a `binary`

### gen_trace_id_array()

Generate a random trace id using the binary representation

Returns a `array` of `int`
