---
title: Codecs
description: Understanding data. De- and encode data from wire formats.
hide_table_of_contents: false
---

### Concept

Tremor connects to the external systems using connectors.

Connectors that integrate Tremor with upstream systems from where Tremor is typically ingesting data are called `Onramps`.

Connectors that integrate Tremor with downstream systems where Tremor is typically publishing or contributing data to are called `Offramps`.

`Onramps` and `Offramps` use `codecs` to transform the external wire form of connected system participants into a structured internal value type Tremor understands semantically.

Tremor's internal type system is JSON-like.

`Onramps` and `Offramps` support `preprocessors` and `postprocessors`. External data ingested into Tremor via `Onramps` can be pre-processed through multiple transfomers before a code is applied to convert the data into Tremor-internal form. Preprocessors are configured as a chain of transformations. Postprocessors
are applied to values leaving Tremor after a codec transforms them from Tremor internal form to wire form. Postprocessors are configured as a chain of transformations.

<<<<<<< HEAD
Codecs share similar concepts to [extractors](/docs/tremor-script/#extractors) but differ in their
application. Codecs are applied to external data as they are ingested by or egressed from a running tremor process.
Extractors, on the other hand, are tremor internal and convert data from and to tremor's internal value type.
=======
Codecs share similar concepts to [extractors](https://docs.tremor.rs/tremor-script/#extractors), but differ in their application. Codecs are applied to external data as they are ingested by or egressed from a running Tremor process.
Extractors, on the other hand, are Tremor-internal and convert data from and to Tremor's internal value type.
>>>>>>> 22a80a7 (Make homepage feature headers links)

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

<<<<<<< HEAD
* [json](/docs/Artefacts/codecs#json)
* [msgpack](/docs/Artefacts/codecs#msgpack)
* [influx](/docs/Artefacts/codecs#influx)
* [binflux](/docs/Artefacts/codecs#binflux) - (binary representation of the influx wire protocol)
* [statsd](/docs/Artefacts/codecs#statsd)
* [yaml](/docs/Artefacts/codecs#yaml)
* [string](/docs/Artefacts/codecs#string) - any valid UTF-8 string sequence
=======
* [json](https://docs.tremor.rs/artefacts/codecs#json)
* [msgpack](https://docs.tremor.rs/artefacts/codecs#msgpack)
* [influx](https://docs.tremor.rs/artefacts/codecs#influx)
* [binflux](https://docs.tremor.rs/artefacts/codecs#binflux)- (binary representation of the influx wire protocol).
* [statsd](https://docs.tremor.rs/artefacts/codecs#statsd)
* [yaml](https://docs.tremor.rs/artefacts/codecs#yaml)
* [string](https://docs.tremor.rs/artefacts/codecs#string)- any valid UTF-8 string sequence.
>>>>>>> 22a80a7 (Make homepage feature headers links)

<h3 class="section-head" id="h-concept"><a href="#h-codecs"></a>Pre- and Postprocessors</h3>

Tremor supports the following preprocessing transformations in `Onramp` configurations:

<<<<<<< HEAD
* [lines](/docs/Artefacts/preprocessors/#lines) - split by newline
* [lines-null](/docs/Artefacts/preprocessors/#lines-null) - split by null byte
* [lines-pipe](/docs/Artefacts/preprocessors/#lines-pipe) - split by `|`
* [base64](/docs/Artefacts/preprocessors/#base64) - base64 decoding
* [decompress](/docs/Artefacts/preprocessors/#decompress) - auto detecting decompress
* [gzip](/docs/Artefacts/preprocessors/#gzip) - gzip decompress
* [zlib](/docs/Artefacts/preprocessors/#zlib) - zlib decompress
* [xz](/docs/Artefacts/preprocessors/#xz) - xz decompress
* [snappy](/docs/Artefacts/preprocessors/#snappy) - snappy decompress
* [lz4](/docs/Artefacts/preprocessors/#lz4) - zl4 decompress
* [gelf-chunking](/docs/Artefacts/preprocessors/#gelf-chunking) - GELF chunking support
* [remove-empty](/docs/Artefacts/preprocessors/#remove-empty) - remove emtpy (0 len) messages
* [length-prefixerd](/docs/Artefacts/preprocessors/#length-prefixerd) - length prefixed splitting for streams
=======
* [lines](https://docs.tremor.rs/artefacts/preprocessors/#lines)- split by newline.
* [lines-null](https://docs.tremor.rs/artefacts/preprocessors/#lines-null)- split by null byte.
* [lines-pipe](https://docs.tremor.rs/artefacts/preprocessors/#lines-pipe)- split by `|`.
* [base64](https://docs.tremor.rs/artefacts/preprocessors/#base64)- base64 decoding.
* [decompress](https://docs.tremor.rs/artefacts/preprocessors/#decompress)- auto detecting decompress.
* [gzip](https://docs.tremor.rs/artefacts/preprocessors/#gzip)- gzip decompress.
* [zlib](https://docs.tremor.rs/artefacts/preprocessors/#zlib)- zlib decompress.
* [xz](https://docs.tremor.rs/artefacts/preprocessors/#xz)- xz decompress.
* [snappy](https://docs.tremor.rs/artefacts/preprocessors/#snappy)- snappy decompress.
* [lz4](https://docs.tremor.rs/artefacts/preprocessors/#lz4)- zl4 decompress.
* [gelf-chunking](https://docs.tremor.rs/artefacts/preprocessors/#gelf-chunking)- GELF chunking support.
* [remove-empty](https://docs.tremor.rs/artefacts/preprocessors/#remove-empty)- remove emtpy (0 len) messages.
* [length-prefixerd](https://docs.tremor.rs/artefacts/preprocessors/#length-prefixerd)- length prefixed splitting for streams.
>>>>>>> 22a80a7 (Make homepage feature headers links)

Tremor supports the following postprocessing transformations in `Offramp` configurations:

* [lines](/docs/Artefacts/postprocessors/#lines)
* [base64](/docs/Artefacts/postprocessors/#base64)
* [length-prefixerd](/docs/Artefacts/postprocessors/#length-prefixerd)
* [compression](/docs/Artefacts/postprocessors/#compression)
