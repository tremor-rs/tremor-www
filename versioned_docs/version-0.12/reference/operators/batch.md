# generic::batch

The batch operator is used to batch multiple events and send them in a bulk fashion. It also allows to set a timeout of how long the operator should wait for a batch to be filled.

This operator batches both the event payload and event metadata into a single bulk event. Downstream pipeline nodes or offramps will receive 1 such bulk event but will treat its context as multiple events and might act different e.g. when it comes to building a request payload in the offramp context or other use cases. Empty bulk events are usually considered as `no` event.

Supported configuration options are:

- `count` - Elements per batch
- `timeout` - Maximum delay between the first element of a batch and the last element of a batch.

**Outputs**:

- `out`

**Example**:

```tremor
define operator batch from generic::batch
with
  count = 300
end;
```