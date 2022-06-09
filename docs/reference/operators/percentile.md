# qos::percentile

An alternative traffic shaping option to backpressure. Instead of all dropping events for a given
time we drop a statistical subset with an increasing percentage of events dropped the longer we
see errors / timeouts.

In general `step_up` should always be significantly smaller then `step_down` to ensure we gradually
reapproach the ideal state.

This operator preserves event metadata.

**Configuration options**:

- `timeout` - Maximum allowed 'write' time in nanoseconds.
- `step_down` - What additional percentile should be dropped in the case of a timeout (default 5%: `0.05`)
- `step_up` - What percentile should be recovered in case of a good event. (default: 0.1%: `0.001`)

**Outputs**:

- `out`
- `overflow` - Events that are not let past due to active backpressure

**Example**:

```tremor
use std::time::nanos;

define operator perc from qos::percentile
with
  timeout = nanos::from_millis(100),
  step_down = 0.1 # 10%
end;
```