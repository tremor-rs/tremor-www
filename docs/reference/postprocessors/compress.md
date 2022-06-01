# compress

Compresses event data.

Unlike decompression processors, the compression algorithm must be selected. The following compression post-processors are supported. Each format can be configured as a postprocessor.

Supported formats:

| Name   | Algorithm / Format                                         |
|--------|------------------------------------------------------------|
| gzip   | GZip                                                       |
| zlib   | ZLib                                                       |
| xz     | Xz2 level 9                                                |
| snappy | Snappy                                                     |
| lz4    | Lz level 4 compression                                     |
| zstd   | [Zstandard](https://datatracker.ietf.org/doc/html/rfc8878) |

Example configuration:

