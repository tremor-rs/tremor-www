
# connectors

 Predefined Connectors for use within your troy flow
## Connectors
### exit
The exit connector

When getting an event it terminates the preprocessors.
### console
A line seperated stdio based connector

Useful for reading and writing lines to stdout/stderr and reading lines from stdin.
- Read from the `out` port
- Write to `in` or `stdout` or `stderr` ports
### metrics
The metrics connector that can be used to receive metrics from the Tremor runtime

The metrics received from the `out` port of this connector are suitable to be serialized with the `influx` codec
in order to send them to any time-series database or metrics store.
