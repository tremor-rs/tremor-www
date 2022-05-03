# Postprocessors Overview

Postprocessors operate on the raw data stream and transform it. They are run after data reaches the codec and do not know or care about tremor's internal representation.

Online codecs and postprocessors can be chained to perform multiple operations in succession.

## Supported Postprocessors

|PostprocessorName|Description|
|---|---|
|[base64](postprocessors/base64)|Base64 Encoding|
|[compress](postprocessors/compress)|Compression Algorithms|
|[gelf](postprocessors/gelf)|GELF format|
|[ingest-timestamp](postprocessors/ingest-timestamp)|Ingest timestamp|
|[length-prefix](postprocessors/length-prefix)|Length prefixed data|
|[sepatate](postprocessors/separate)|Insert a separator between single event bytes|

