# binflux

The `binflux` codec is a binary representation of the influx line protocol.

It exhibits significantly faster serialization performance, taking less space on the wire.

The format does not include framing and SHOULD be used with `size-prefix` processors.

For all numerics network byte order is used (big endian).

## Data Representation

1. _2 byte_ (u16) length of the `measurement` in bytes
2. _n byte_ (utf8) the measurement (utf8 encoded string)
3. _8 byte_ (u64) the timestamp
4. _2 byte_ (u16) number of tags (key value pairs) repetitions of:
   1. _2 byte_ (u16) length of the tag name in bytes
   2. _n byte_ (utf8) tag name (utf8 encoded string)
   3. _2 byte_ (u16) length of tag value in bytes
   4. _n byte_ (utf8) tag value (utf8 encoded string)
5. _2 byte_ (u16) number of fiends (key value pairs) repetition of:
   1. _2 byte_ (u16) length of the tag name in bytes
   2. _n byte_ (utf8) tag name (utf8 encoded string)
   3. _1 byte_ (tag) type of the field value can be one of:
   4. `TYPE_I64 = 0` followed by _8 byte_ (i64)
      1. `TYPE_F64 = 1` followed by _8 byte_ (f64)
      2. `TYPE_TRUE = 2` no following data
      3. `TYPE_FALSE = 3` no following data
      4. `TYPE_STRING = 4` followed by _2 byte_ (u16) length of the string in bytes and _n byte_ string value (utf8 encoded string)

## Origins

The format originated with tremor as an efficient alternative to the [influx](./influx) codec.
