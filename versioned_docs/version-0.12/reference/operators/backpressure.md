# qos::backpressure

The backpressure operator is used to introduce delays based on downstream systems load. Longer backpressure steps are introduced every time the latency of a downstream system reached `timeout`, or an error occurs. On a successful transmission within the timeout limit, the delay is reset.

The operator supports two modes:

- `discard` - the standard, when backpressure is triggered it will discard new messages by sending them to the `overflow` output port. This is designed to fulfill the need of low transport latency at the cost of loss.
- `pause` - it will trigger a circuit breaker and ask the sources that send it data to stop sending additional events. No Event is discarded by the backpressure operator. This is designed to deal with situations where losing events is not an option - but the garuantee of losslessness depends on the source and how it can handle circuit breaker events.


This operator preserves event metadata.

**Configuration options**:

- `timeout` - Maximum allowed 'write' time in nanoseconds.
- `steps` - Array of values to delay when a we detect backpressure. (default: `[50, 100, 250, 500, 1000, 5000, 10000]`)
- `method` - Either `discard` or `pause` to define how backpressure is handled (default: `discard`)

**Outputs**:

- `out`
- `overflow` - Events that are not let past due to active backpressure

**Example**:

```tremor
use std::time::nanos;

define operator bp from qos::backpressure
with
  timeout = nanos::from_millis(100),
  method = "discard"
end;
```