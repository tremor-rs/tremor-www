# syslog

The `syslog` codec supports marshalling the [IETF](https://datatracker.ietf.org/doc/html/rfc5424#section-6) and [BSD](https://www.ietf.org/rfc/rfc3164.txt) syslog formats.

## BSD Example

A syslog message following the BSD format as follows:              

```text
<13>Jan  5 15:33:03 74794bfb6795 root[8539]: i am foobar
```

The equivalent representation as a tremor value

```json
{
  "severity": "notice",
  "facility": "user",
  "hostname": "74794bfb6795",
  "appname": "root",
  "msg": "i am foobar",
  "procid": 8539,
  "msgid": null,
  "protocol": "RFC3164",
  "protocol_version": null,
  "structured_data": null,
  "timestamp": 1609860783000000000
}
```

## IETF example

A syslog message following IETF standard as follows:

```text
<165>1 2021-03-18T20:30:00.123Z mymachine.example.com evntslog - ID47 [exampleSDID@32473 iut=\"3\" eventSource=\"Application\" eventID=\"1011\"] BOMAn application event log entry..."
```

The equivalent representation as a tremor value.

```json
{
  "severity": "notice",
  "facility": "local4",
  "hostname": "mymachine.example.com",
  "appname": "evntsog",
  "msg": "BOMAn application event log entry...",
  "procid": null,
  "msgid": "ID47",
  "protocol": "RFC5424",
  "protocol_version": 1,
  "structured_data": {
              "exampleSDID@32473" :
              [
                {"iut": "3"},
                {"eventSource": "Application"},
                {"eventID": "1011"}
              ]
            },
  "timestamp": 1616099400123000000
}
```

## Considerations

:::note
Malformed syslog messages are treated per `rfc3164` protocol semantics resulting in the entire string being
dumped into the `msg` of the result record.
:::

