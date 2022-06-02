# qos::roundrobin

Evenly distributes events over it's outputs. If a CB trigger event is received from an output this
output is skipped until the circuit breaker is restored. If all outputs are triggered the operator
itself triggers a CB event.

This operator preserves event metadata.

**Outputs**:

- `*` (any named output is possible)

**Example**:

```tremor
define operator roundrobin from qos::roundrobin
with
  outputs = ["round", "robin", "outputs"]
end;
```