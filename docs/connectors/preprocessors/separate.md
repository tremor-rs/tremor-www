### lines

Splits the input into events, using a given separator, the default being `\n` (newline).

The default can be overwritten using the `separator` option.

Buffers any line fragment that may be present (after the last line separator), till more data arrives. This makes it ideal for use with streaming onramps like [tcp](../tcp), to break down incoming data into distinct events.

Additional options are:

* `max_length`, the maximum length in bytes to keep buffering before giving up finding a separator character. This prevents consuming huge ammounts of memory if no separator ever arrives.
* `buffered`, if we buffer multiple events to find a seperator, if this is set to false each event will be considered to be followd by a separator so "hello\nworld" would turn into two events "hello" and "world". With buffered true "hello\nworld" would turn into one event "hello" and "world" will be buffered until a next event includes a `\n`.