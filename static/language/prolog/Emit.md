###

`emit` halts processing for the current event and returns control to the Tremor runtime, emitting a synthetic event as output.

:::info

By default, the `emit` operation will emit events to the standard output port, `out`.

However, the operation can be redirected to an alternative output port.

:::
