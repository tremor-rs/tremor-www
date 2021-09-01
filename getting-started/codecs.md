---
title: Codecs
description: Understanding data. De- and encode data from wire formats.
hide_table_of_contents: true
---

### Concept

Tremor connects to the external systems using connectors.

Connectors that integrate tremor with upstream systems from where tremor is typically
ingesting data are called `Onramps`.

Connectors that integrate tremor with downstream systems where tremor is typically
publishing or contributing data to are called `Offramps`.

`Onramps` and `Offramps` use `codecs` to transform the external wire form of connected
system participants into a structured internal value type tremor understands semantically.

Tremor's internal type system is JSON-like.

`Onramps` and `Offramps` support `preprocessors` and `postprocessors`. External data ingested into tremor
via `Onramps` can be pre-processed through multiple transfomers before a code is applied to convert the
data into tremor internal form. Preprocessors are configured as a chain of transformations. Postprocessors
are applied to values leaving tremor after a codec transform them from tremor internal form to wire
form. Postprocessors are configured as a chain of transformations.

Codecs share similar concepts to [extractors](/docs/tremor-script/#extractors) but differ in their
application. Codecs are applied to external data as they are ingested by or egressed from a running tremor process.
Extractors, on the other hand, are tremor internal and convert data from and to tremor's internal value type.

### Data Format

Tremor's internal data representation is JSON-like. The supported value types are:

* String - UTF-8 encoded
* Numeric (float, integer)
* Boolean
* Null
* Array
* Record (string keys)

### Codecs

Tremor neither requires nor validates schemas and works with schemaless or unstructured
data. Validation can be asserted with the tremor-script language. `Onramps`, `Offramps`
and other components of tremor may however require or expect conformance with schemas.

For specific components their documentation should be consulted for correct usage.

Tremor supports the encoding and decoding of the following formats:

* [json](/docs/artefacts/codecs#json)
* [msgpack](/docs/artefacts/codecs#msgpack)
* [influx](/docs/artefacts/codecs#influx)
* [binflux](/docs/artefacts/codecs#binflux) - (binary representation of the influx wire protocol)
* [statsd](/docs/artefacts/codecs#statsd)
* [yaml](/docs/artefacts/codecs#yaml)
* [string](/docs/artefacts/codecs#string) - any valid UTF-8 string sequence

<h3 class="section-head" id="h-concept"><a href="#h-codecs"></a>Pre- and Postprocessors</h3>

Tremor supports the following preprocessing transformations in `Onramp` configurations:

* [lines](/docs/artefacts/preprocessors/#lines) - split by newline
* [lines-null](/docs/artefacts/preprocessors/#lines-null) - split by null byte
* [lines-pipe](/docs/artefacts/preprocessors/#lines-pipe) - split by `|`
* [base64](/docs/artefacts/preprocessors/#base64) - base64 decoding
* [decompress](/docs/artefacts/preprocessors/#decompress) - auto detecting decompress
* [gzip](/docs/artefacts/preprocessors/#gzip) - gzip decompress
* [zlib](/docs/artefacts/preprocessors/#zlib) - zlib decompress
* [xz](/docs/artefacts/preprocessors/#xz) - xz decompress
* [snappy](/docs/artefacts/preprocessors/#snappy) - snappy decompress
* [lz4](/docs/artefacts/preprocessors/#lz4) - zl4 decompress
* [gelf-chunking](/docs/artefacts/preprocessors/#gelf-chunking) - GELF chunking support
* [remove-empty](/docs/artefacts/preprocessors/#remove-empty) - remove emtpy (0 len) messages
* [length-prefixerd](/docs/artefacts/preprocessors/#length-prefixerd) - length prefixed splitting for streams

Tremor supports the following postprocessing transformations in `Offramp` configurations:

* [lines](/docs/artefacts/postprocessors/#lines)
* [base64](/docs/artefacts/postprocessors/#base64)
* [length-prefixerd](/docs/artefacts/postprocessors/#length-prefixerd)
* [compression](/docs/artefacts/postprocessors/#compression)
