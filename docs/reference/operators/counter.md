# generic::counter

Keeps track of the number of events as they come and emits the current count out alongside the event. The output is a record of the form `{"count": n, "event": event}`, where `n` is the current count and `event` is the original event.

The counter starts when the first event comes through and begins from 1.

This operator preserves event metadata.

**Outputs**:

- `out`

**Example**:

```tremor
define operator counter from generic::counter;
```