# debug::history

:::note
    This operator is for debugging purposes only, and should not be used in production deployments.
:::

This operator generates a history entry in the event metadata underneath the field provided in the `name` config value. Data is pushed to the array as a Striong in the form: `"event: <op>(<event_id>)"`.

This can be used as a tracepoint of events in a complex pipeline setup.

This operator manipulates a section of the event metadata.

**Configuration options**:

- `op` - The operation name of this operator
- `name` - The field to store the history on

**Outputs**:

- `out`

**Example**:

```tremor
define operator history from debug::history
with
  op = "my-checkpoint",
  name = "event_history"
end;
```