# Codecs

Codecs are used to describe how to decode data from the wire and encode it back to wire format.

## Supported Codecs

|Codec Name|Description|
|---|---|
|[json](json)|The [JSON](https://json.org) format|
|[json-sorted](json-sorted)|The [JSON](https://json.org) format|
|[msgpack](msgpack)|The [Msgpack](https://msgpack.org) binary format|
|[influx](influx)|The [influx line protocol](https://docs.influxdata.com/influxdb/v1.7/write_protocols/line_protocol_tutorial/)| 
|[binflux](binflux)|An efficient binary representation of influx data|
|[null](null)|An drop only codec|
|[string](string)|UTF-8 String format|
|[statsd](statsd)|The statds format|
|[yaml](yaml)|The YAML format|
|[binary](binary)|Raw network endian binary data|
|[syslog](syslog)|The syslog format - IETF and BSD styles|
|[csv](csv)|The CSV format as per RFC4180 - constrained to a single line|

