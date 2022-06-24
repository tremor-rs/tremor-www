
# spankind

 SpanKind is the type of span. Can be used to specify additional relationships between spans
 in addition to a parent/child relationship.

## Constants

### internal

*type*: U64

> Indicates that the span represents an internal operation within an application,
> as opposed to an operation happening at the boundaries. Default value.


### producer

*type*: U64

Indicates that the span describes a producer sending a message to a broker.
> Unlike `CLIENT` and `SERVER`, there is often no direct critical path latency relationship
> between producer and consumer spans. A `PRODUCER` span ends when the message was accepted
> by the broker while the logical processing of the message might span a much longer time.


### unspecified

*type*: U64

> Unspecified. Do NOT use as default.
> Implementations MAY assume SpanKind to be `INTERNAL` when receiving `UNSPECIFIED`.


### server

*type*: U64

> Indicates that the span covers server-side handling of an RPC or other
> remote network request.


### consumer

*type*: U64

> Indicates that the span describes consumer receiving a message from a broker.
> Like the `PRODUCER` kind, there is often no direct critical path latency relationship
> between producer and consumer spans.

### client

*type*: U64

> Indicates that the span describes a request to some remote service.

## Functions

### make_default()

The `default` function returns the preferred default spankind if/when none is
specified

