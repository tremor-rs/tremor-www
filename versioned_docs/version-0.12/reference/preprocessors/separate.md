# separate

Splits the input into events, using a given separator, the default being `\n` (newline).

The default can be overwritten using the `separator` option.

Buffers any fragment that may be present (after the last separator), till more data arrives. This makes it ideal for use with streaming onramps like [tcp](../connectors/tcp), to break down incoming data into distinct events.

Additional options are:

| Option     | Description                                                                                                                                                                                                                                                                                                                                                     | Required | Default Value |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| separator  | The separator to split the incoming bytes at                                                                                                                                                                                                                                                                                                                    | no       | `\n`          |
| max_length | the maximum length in bytes to keep buffering before giving up finding a separator character. This prevents consuming huge ammounts of memory if no separator ever arrives.                                                                                                                                                                                     | no       | `8192`        |
| buffered   | buffer multiple fragments to find a seperator, if this is set to false each fragment will be considered to be followed by a separator so "hello\nworld" would turn into two events "hello" and "world". With buffered true "hello\nworld" would turn into one event "hello" and "world" will be buffered until a next event includes a `\n` or the stream ends. | no       | `true`        |


If this preprocessor is only configured by name, it will split on `\n`, does not enforce a maximum length of `8192` and buffer incoming byte fragments until a separator is found or the `max_length` is hit, at which point the fragment is discarded.

Example configuration:

```tremor
define connector foo from ws_client
with
    preprocessors = ["separate"],
    postprocessors = ["separate"]
    codec = "json",
    config = {
        "url": "ws://localhost:12345"
    }
end;

define connector snot from ws_server
with
    preprocessors = [
        {
            "name": "separate",
            "config": {
                "separator": "|",
                "max_length": 100000,
                "buffered": false
            }
        }
    ],
    ...
end;
```