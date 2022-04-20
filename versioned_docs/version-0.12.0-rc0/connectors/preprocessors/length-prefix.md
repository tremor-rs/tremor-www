### length-prefixed

Separates a continuous stream of data based on length prefixing. The length for each package in a stream is based on the first 64 bit decoded as an unsigned big endian value.

### textual-length-prefix

Extracts the message based on prefixed message length given in ascii digits which is followed by a space as used in [RFC 5425](https://tools.ietf.org/html/rfc5425#section-4.3) for TLS/TCP transport for syslog.
