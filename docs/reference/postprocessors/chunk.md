# chunk

A postprocessor for concatenating serialized input chunks into a buffer that is guaranteed to never exceed the configured `max_bytes` configuration,
but tries to come as close to that as possible while not splitting apart given input chunks. 

Input chunks are concatenated until concatenating another chunk would exceed the configured `max_bytes`, then the accumulated buffer is emitted as a single chunk and the new one is accumulated until `max_bytes` would be hit again.

If an input chunk exceeds `max_bytes` it is discarded with a warning.

## Configuration

| Option      | Description                                                                                                            | Required | Default Value |
|-------------|------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| `max_bytes` | The maximum number of bytes an output chunk should never exceed. Output chunks can and will have less number of bytes. | yes      |               |

## Example

Ensure a maximum UDP packet size for the [`udp_client` connector](../connectors/udp.md#client):

```tremor
define connector my_udp_client from udp_client
with
    codec = "json",
    postprocessors = [
        "separate",
        {
            "name": "chunk",
            "config": {
                "max_bytes": 1432
            }
        }
    ]

end;
```
