# Preprocessors Overview

Preprocessors operate on the raw data stream and transform it. They are run before data reaches the codec and do not know or care about tremor's internal representation.

Online codecs, preprocessors can be chained to perform multiple operations in succession.

## Supported Preprocessors

|Codec Name|Description|
|---|---|
|[base64](preprocessors/base64)|Base64 decoding|
|[decompress](preprocessors/decompress)|Decompression algorithms|
|[gelf](preprocessors/gelf)|GELF format|
|[length-prefix](preprocessors/length-prefix)|Length prefixed data|
|[lines](preprocessors/lines)|Line delimited data|
|[remove-empty](preprocessors/remove-empty)|Remove or coalesce out empty events|

