# Codecs

Tremor connects to the external systems using connectors.

Connectors that integrate Tremor with upstream systems from where Tremor is typically ingesting data are called `Onramps`.

Connectors that integrate Tremor with downstream systems where Tremor is typically publishing or contributing data to are called `Offramps`.

`Onramps` and `Offramps` use `codecs` to transform the external wire form of connected system participants into a structured internal value type Tremor understands semantically.

Tremor's internal type system is JSON-like.

`Onramps` and `Offramps` support `preprocessors` and `postprocessors`. External data ingested into Tremor via `Onramps` can be pre-processed through multiple transfomers before a code is applied to convert the data into Tremor-internal form. Preprocessors are configured as a chain of transformations. Postprocessors
are applied to values leaving Tremor after a codec transforms them from Tremor internal form to wire form. Postprocessors are configured as a chain of transformations.

Codecs share similar concepts to [extractors](../extractors/overview), but differ in their application. Codecs are applied to external data as they are ingested by or egressed from a running Tremor process.
Extractors, on the other hand, are Tremor-internal and convert data from and to Tremor's internal value type.

### Data Format

Tremor's internal data representation is JSON-like. The supported value types are:

* String- UTF-8 encoded
* Numeric (float, integer)
* Boolean
* Null
* Array
* Record (string keys)

### Codecs

Tremor neither requires nor validates schemas and works with schemaless or unstructured data. Validation can be asserted with the tremor-script language. `Onramps`, `Offramps`, and other components of Tremor may, however, require or expect conformance with schemas.

For specific components, their documentation should be consulted for correct usage.

Tremor supports the encoding and decoding of the following formats:

* [json](../connectors/codecs#json)
* [msgpack](../connectors/codecs#msgpack)
* [influx](../connectors/codecs#influx)
* [binflux](../connectors/codecs#binflux)- (binary representation of the influx wire protocol).
* [statsd](../connectors/codecs#statsd)
* [yaml](../connectors/codecs#yaml)
* [string](../connectors/codecs#string)- any valid UTF-8 string sequence.

<h3 class="section-head" id="h-concept"><a href="#h-codecs"></a>Pre- and Postprocessors</h3>

Tremor supports the following preprocessing transformations in `Onramp` configurations:

* [lines](../connectors/preprocessors/#lines)- split by newline.
* [lines-null](../connectors/preprocessors/#lines-null)- split by null byte.
* [lines-pipe](../connectors/preprocessors/#lines-pipe)- split by `|`.
* [base64](../connectors/preprocessors/#base64)- base64 decoding.
* [decompress](../connectors/preprocessors/#decompress)- auto detecting decompress.
* [gzip](../connectors/preprocessors/#gzip)- gzip decompress.
* [zlib](../connectors/preprocessors/#zlib)- zlib decompress.
* [xz](../connectors/preprocessors/#xz)- xz decompress.
* [snappy](../connectors/preprocessors/#snappy)- snappy decompress.
* [lz4](../connectors/preprocessors/#lz4)- zl4 decompress.
* [gelf-chunking](../connectors/preprocessors/#gelf-chunking)- GELF chunking support.
* [remove-empty](../connectors/preprocessors/#remove-empty)- remove emtpy (0 len) messages.
* [length-prefixed](../connectors/preprocessors#length-prefixed)- length prefixed splitting for streams.

Tremor supports the following postprocessing transformations in `Offramp` configurations:

* [lines](../connectors/postprocessors/#lines)
* [base64](../connectors/postprocessors/#base64)
* [length-prefixed](../connectors/postprocessors#length-prefixed)
* [compression](../connectors/postprocessors/#compression)
