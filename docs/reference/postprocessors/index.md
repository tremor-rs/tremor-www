# Postprocessors

Postprocessors operate on the raw data stream and transform it. They are run after data reaches the codec and do not know or care about tremor's internal representation.

Online codecs and postprocessors can be chained to perform multiple operations in succession.

## Supported Postprocessors

|PostprocessorName|Description|
|---|---|
|[base64](base64)|Base64 Encoding|
|[compress](compress)|Compression Algorithms|
|[gelf](gelf)|GELF format|
|[ingest-timestamp](ingest-timestamp)|Ingest timestamp|
|[length-prefix](length-prefix)|Length prefixed data|
|[sepatate](separate)|Insert a separator between single event bytes|

