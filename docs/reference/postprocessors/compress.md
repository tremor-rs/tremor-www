# compress

Compresses event data.

Unlike decompression processors, the compression algorithm must be selected. Optionally the compression level can be specified for algotithms which support it (example Zstandard with level 0). The following compression post-processors are supported. Each format can be configured as a postprocessor.

Supported formats:

| Name   | Algorithm / Format                                         |
|--------|------------------------------------------------------------|
| gzip   | GZip                                                       |
| zlib   | ZLib                                                       |
| xz     | Xz2 level 9 (default)                                                |
| snappy | Snappy                                                     |
| lz4    | Lz level 4 compression (default)                                     |
| zstd   | [Zstandard](https://datatracker.ietf.org/doc/html/rfc8878) (defaults to level 0) |

Example configuration:

Xz compression example with compression level.

`{
  "algotithm":"xz2",
  "level": 3
}`

Xz compression example without compression level defaults to level 9.

`{
  "algorithm":"xz2"
}
`

Xz compression when wrong compression level is specified gives an `Err`.
