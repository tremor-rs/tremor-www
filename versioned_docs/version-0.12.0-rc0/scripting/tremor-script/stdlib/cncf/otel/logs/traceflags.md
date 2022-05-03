
# traceflags

The `severity` module defines `severity_number` values
and associated utility functions


[OpenTelemetry Log Data Model - Trace Flags](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/logs/data-model.md#field-traceflags)

[W3C Trace Context - Trace Flags](https://www.w3.org/TR/trace-context/#trace-flags)

## Functions
### from_int(trace_flags)

The `from_int` function interprets a `trace_flags` integer value argument
to see if it is `sampled-flag` ( decimal `128` ) is set. All other flags are
currently unused and SHOULD be `0` ( unset ) in conforming `W3C Trace Context`
and conformant `OpenTelemetry` implementations


### is_valid(trace_flags)

Checks if a `trace_flags` instance is correct and valid

### make_default()

Returns the default configuration of traceflags
