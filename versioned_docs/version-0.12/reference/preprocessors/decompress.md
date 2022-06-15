# decompress

Decompresses a data stream. It is assumed that each message reaching the decompressor is a complete compressed entity.

The compression algorithm is detected automatically from the supported formats. If it can't be detected, the assumption is that the data was decompressed and will be sent on. Errors then can be transparently handled in the codec.

Supported formats:

## gzip

Decompress GZ compressed payload.

## lz4

Decompress Lz4 compressed payload.

## snappy

Decompress framed snappy compressed payload (does not support raw snappy).

## xz

Decompress Xz2 (7z) compressed payload.

## xz2

Decompress xz and LZMA compressed payload.

## zstd

Decompress [Zstandard](https://datatracker.ietf.org/doc/html/rfc8878) compressed payload.

### zlib

Decompress Zlib (deflate) compressed payload.
