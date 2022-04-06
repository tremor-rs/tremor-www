# Connectors Reference

In Tremor, a `connector` is the means by which data is distributed between Tremor
and upstream and downstream systems in a Tremor-based system. Connectors can be
clients ( such as TCP or UDP clients ), servers ( such as an embedded HTTP or gRPC
server ), or services such as the `kv` connector.

If you are interested in the connectivity offered by Tremor, [check](connectors/overview) the supported connectors.

## Formats and Types

Tremor supports a type system that is similar to the hierarchic structures found in formats
such as MsgPack and JSON. Tremor represents all data internally with its own value type.

All events distributed to Tremor via connectors needs to be transformed from their native
representation and formats to Tremor's in memory representation - the Tremor value.

Format conversion in Tremor is handled by pluggable `codec` facilities.

Codecs can use pre-processing and post-processing to un-batch or batch messages for efficient
data transfer in connectors.

The `preprocessors` and `postprocessors` are handled by pluggable facilities.

A `connector` essentially packages a transport protocol, codec, processing facilities
and connector specific configuration and qualify of service directives together to
distribute data.

It is very common for production systems to compose connectors from these parts to talk
to 3rd party systems. 

## Codecs

Codecs convert data from external data formats to Tremor's native in memory value type
representation.

Check the [codec guide](connectors/codecs) to see the supported codecs.

## Preprocessors

Preprocessor chains transform inbound chunks of streaming data before a configured
codec in a connector converts them to the native Tremor value type representation.

Check the [preprocessor guide](connectors/preprocessors) to see the supported codecs.

## Postprocessors

Postprocessor chains transform outbound chunks of streaming data after a codec
converts them from native Tremor value type representation to the external form
indicated by the configured codec of a connector.

Check the [postprocessor guide](connectors/postprocessors) to see the supported codecs.

