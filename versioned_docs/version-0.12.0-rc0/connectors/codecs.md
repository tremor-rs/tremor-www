# Codecs Overview

Codecs are used to describe how to decode data from the wire and encode it back to wire format.

## Supported Codecs

|Codec Name|Description|
|---|---|
|[json](codecs/json)|The [JSON](https://json.org) format|
|[json-sorted](codecs/json-sorted)|The [JSON](https://json.org) format|
|[msgpack](codecs/msgpack)|The [Msgpack](https://msgpack.org) binary format|
|[influx](codecs/influx)|The [influx line protocol](https://docs.influxdata.com/influxdb/v1.7/write_protocols/line_protocol_tutorial/)| 
|[binflux](codecs/binflux)|An efficient binary representation of influx data|
|[null](codecs/null)|An drop only codec|
|[string](codecs/string)|UTF-8 String format|
|[statsd](codecs/statsd)|The statds format|
|[yaml](codecs/yaml)|The YAML format|
|[binary](codecs/binary)|Raw network endian binary data|
|[syslog](codecs/syslog)|The syslog format - IETF and BSD styles|
|[csv](codecs/csv)|The CSV format as per RFC4180 - constrained to a single line|

