---
title: Support for the Syslog Protocol
slug: LFX-Blog-Nupur
author: Nupur Agrawal
author_title: Tremor 2021 Spring Mentee
tags: [codecs, mentorship, cncf]
categories: [general]
draft: false
hide_table_of_contents: false
description: Nupur's experience contributing to Tremor and work overview.
--- 

## Introduction

Hey folks, I am Nupur Agrawal, a third year student at Indian Institute of Technology Roorkee. This blog describes my experience of contributing to Tremor,
CNCF sandbox project in the 2021 spring chapter of [LFX Mentorship Program](https://lfx.linuxfoundation.org/tools/mentorship/), under the mentorship of
Matthias Wahl, Anup Dhamala and Heinz Gies.

## Project Abstract

[Tremor](https://www.tremor.rs/) is an event processing system originally designed for the needs of platform engineering and infrastructure. It is built for
the users that have a high message volume to deal with and want to build pipelines to process, route, or limit this event stream.

<!-- alex ignore he -->
At the beginning of the program, I was given walkthrough of the project by Matthias and he patiently explained me the components and working of tremor.
Tremor is nicely documented and the [docs](https://www.tremor.rs/) can be very useful for referring many things.

## My Project

My project's aim was to enable tremor to receive and send [Syslog Protocol Messages](https://tools.ietf.org/html/rfc5424), a standard protocol used to send 
system log or event messages. It was desired to support both the standard IETF format and the old BSD format via UDP and TCP/TLS. More detailed description
can be found [here](https://github.com/tremor-rs/tremor-runtime/issues/12).

<!--truncate-->

## Work-Summary

### Syslog codec (support via UDP)

The syslog codec encodes and decodes sylog messages (IETF and BSD format) to and from `Value` respectively. Tremor can now receive syslog data via UDP (onramp) and turn syslog messages into structured events. Also, structured events can be turned into textual syslog messages and send out via UDP (offramp).

For example, the following Syslog message 

```text
<165>1 2021-03-18T20:30:00.123Z mymachine.example.com evntslog - ID47 [exampleSDID@32473 iut=\"3\" eventSource=\"Application\" eventID=\"1011\"] BOMAn
application event log entry..."
```

gets translated to:

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

Code for the syslog codec can be found [here](https://github.com/tremor-rs/tremor-runtime/pull/856).

### textual-length-prefix pre and postprocessor 

In order to support syslog messages over TCP, it was needed to add support for the [RFC 5425](https://datatracker.ietf.org/doc/html/rfc5425) transport protocol, that contains a textual length prefix before each message.
textual-length-prefix `preprocessor` and `postprocessor` were implemented to handle the buffers accordingly. The message starts with a number of digits, denoting the message length followed by a space and then the message. The processor gets the length and then wait until the buffer is long enough, to extract the right amount of bytes.
The implementation can be found [here](https://github.com/tremor-rs/tremor-runtime/pull/957).

[Proptest](https://github.com/altsysrq/proptest) is something new and amazing I learnt while working on this. It is a property testing framework which allows to test certain properties of code for arbitrary inputs. We utilised this for testing the functioning of our preprocessor for all types of inputs possible.

### TLS support for TCP

Unlike UDP, Tremor did not support TLS over TCP onramp, which was needed to add. This work can be broadly divided into two parts:

**Add support for receiving TLS encrypted data via TCP onramp**

`tls` option was added to the tcp onramp configuration options which addresses the keys and certificate required for authentiction.

An example of TCP onramp config with TLS is as follows:

```yaml
onramp:
  - id: tls
    type: tcp
    preprocessors:
      - lines
    codec: string
    config:
      host: "127.0.0.1"
      port: 65535
      tls:
        cert: "path/to/cert.pem"
        key: "path/to/key.pem"
```

The code can be found [here](https://github.com/tremor-rs/tremor-runtime/pull/1055).

**Add support for sending TLS encrypted data via TCP offramp**

`tls` option added to offramp tls config contains either the tls config or boolean value indiacting the use of TLS session for transport level encryption. If false is provided then the default TCP stream will be used and if true is provided then TLS stream will be used with default certificates and domain same as hostname. Other option is to provide tls config with `domain` and `cafile`. In case of `domain` not being specified, the hostname will be used.

An example of TCP offramp config with TLS:

```yaml
offramp:
  - id: tls
    type: tcp
    codec: json
    config:
      host: "127.0.0.1"
      port: 65535
      tls:
        cafile: "path/to/cafile"
```

The code can be found [here](https://github.com/tremor-rs/tremor-runtime/pull/1057).

## Concluding Thoughts

The tremor community is very helpful and friendly. The mentors helped me a lot from silly rust doubts to nerve breaking code debugging and testing. There were periodic code reviews and live coding sessions which motivated me to improvise and keep going. The key focus was always on the learning rather than getting the work done.

It was undoubtedly one of the most fruitful and learning experiences I had have and I wish to continue the contribution to community and project.
