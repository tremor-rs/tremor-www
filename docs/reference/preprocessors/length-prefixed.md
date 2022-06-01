# length-prefixed

Separates a continuous stream of data based on length prefixing. The length for each package in a stream is based on the first 64 bit decoded as an unsigned big endian integer.