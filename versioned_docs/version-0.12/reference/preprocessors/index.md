# Preprocessors

Preprocessors operate on the raw data stream and transform it. They are run before data reaches the codec and do not know or care about tremor's internal representation.

Online codecs, preprocessors can be chained to perform multiple operations in succession.

## Supported Preprocessors

| Codec Name                                     | Description                               |
|------------------------------------------------|-------------------------------------------|
| [base64](base64)                               | Base64 decoding                           |
| [decompress](decompress)                       | Decompression algorithms                  |
| [gelf-chunking](gelf-chunking)                 | GELF format UDP chunking                  |
| [length-prefixed](length-prefixed)             | Length prefixed data                      |
| [remove-empty](remove-empty)                   | Remove or coalesce out empty events       |
| [separate](separate)                           | Split input by separator (e.g. linebreak) |
| [textual-length-prefix](textual-length-prefix) | Textual length prefixed data              |

