The `drop` operation halts processing for the current event and returns
control to the Tremor runtime, dropping the event.

### Constraints

:::danger

Here be dragons!

:::

:::caution

The `drop` operation should be used with care as the in-flight event is
discarded by the runtime. Where circuit breakers, guaranteed delivery and
quality of service operations are being managed by the engine downstream,
these should be carefully programmed so that `drop` operations have no
side-effects on non-functional behaviours of the Tremor runtime.

:::

