# Syslog UDP

The `syslog udp` example is demonstrate a number things:

1. Encoding data in the `syslog` format.
2. Sending data over `UDP`.
3. Receiving data over `UDP`.
4. Decoding `syslog` formatted data.

For digestion it is entirely self-contained inside a single tremor instance using multiple parallel pipelines, sinks and sources.

## Setup

:::tip
All the code here is available in the [git repository](https://github.com/tremor-rs/tremor-www/tree/main/docs/recipes/syslog_udp) as well and can be run with `docker compose up`.
:::

## Environment

The [sources and sinks](etc/tremor/config/00_ramps.yaml) we use are:

- The `metronome` source - to generate data in one second intervals.
- The `udp` sink - to send the data over `UDP`.
- The `udp` source - to receive data via `UDP`.
- The `stdout` sink - to display data decoded and re-formatted as `JSON`.

In addition we have two pipelines.

The [producer](etc/tremor/config/consumer.trickle) pipeline takes the tick from metronome and generates a syslog message. It is only handling message rewriting.

The [consumer](etc/tremor/config/consumer.trickle) pipeline takes the syslog message and forwards it. It is a passthrough pipeline.

The [binding](./etc/tremor/config/01_binding.yaml) expresses those relations and gives the graph of onramp, pipeline and offramp. We hare left with those two workflows:

```
metronome -> producer -> syslog-udp-out

syslog-udp-in -> consumer -> stdout-output
```

Finally the [mapping](./etc/tremor/config/02_mapping.yaml) instantiates the binding with the given name and instance variable to activate the elements of the binding.

## Business Logic

The only interesting part to look at is the event rewriting, this uses an example syslog message and adds the `event.id` as a `structured_data` field.

```tremor
select {
  "severity": "notice",
  "facility": "local4",
  "hostname": "example.com",
  "appname": "evntsog",
  "msg": "BOMAn application event log entry...",
  "procid": null,
  "msgid": "ID47",
  "protocol": "RFC5424",
  "protocol_version": 1,
  "structured_data": {
              "exampleSDID@32473" :
              [
                {"eventSource": "Tremor"},
                {"eventID": "#{ event.id }"}
              ]
            },
  "timestamp": event.ingest_ns
} from in into out
```

## Testing

If using the CLI, you can run the server using config artifacts and see a log message triggered by the metronome every
second being transformed by the pipeline into json and sent to stdout:

```shell-session
$ tremor server run -f docs/recipes/14_syslog_udp/etc/tremor/config/*
tremor version: 0.11.12 heads/v0.11.12:77792d92a9e5788eb221b1e64cde4d2dce756340
...
>> {"hostname":"example.com","severity":"notice","facility":"local4","timestamp":1651666687465441000,"protocol":"RFC5424","protocol_version":1,"appname":"evntsog","msgid":"ID47","structured_data":{"exampleSDID@32473":[{"eventSource":"Tremor"},{"eventID":"0"}]},"procid":null,"msg":"BOMAn application event log entry..."}
>> {"hostname":"example.com","severity":"notice","facility":"local4","timestamp":1651666688468303000,"protocol":"RFC5424","protocol_version":1,"appname":"evntsog","msgid":"ID47","structured_data":{"exampleSDID@32473":[{"eventSource":"Tremor"},{"eventID":"1"}]},"procid":null,"msg":"BOMAn application event log entry..."}
```

Since the config enables a syslog receiver on port 12201, you should be able to send custom syslog messages with the
`logger` command.

```shell-session
$ logger -d -n 127.0.0.1 -P 12201 "Weeeeh. It works :D"
```

**NOTE:** If you are running the recipe inside a docker container, execute the command inside the container using
`docker exec`. If you are running using the CLI, leave tremor running and execute this in a different terminal window.

You should be able to see a message similar to this in the tremor output.

```json
>> {"hostname":"neptune","severity":"notice","facility":"user","timestamp":1651671807829230000,
    "protocol":"RFC5424", "protocol_version":1,"appname":"sandipb","msgid":null,
    "structured_data":{"timeQuality":[{"tzKnown":"1"},{"isSynced":"1"},{"syncAccuracy":"153500"}]},
    "procid":null, "msg":"Weeeeh. It works :D"}
```
