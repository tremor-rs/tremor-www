+++
title = "Talking To Other Systems"
date = "2020-02-05T10:01:00+01:00"
draft = false
weight = 100
description = "Connectivity"
bref= "Connecting different systems is an integral part of tremor."
toc= true
+++

### Concept

In order to provide a general purpose event processing facility to a broad base
of applications, tremor separates processing from connectivity and distribution.

Tremor further separates the syntax of external formats from the implied value type
semantics that are useful for filtering, processing, transforming, aggregating or
otherwise deriving synthetic events from streams of data ingested by tremor processes.

As tremor is primarily an event processing system we refer to connections to external
systems that are logically upstream of tremor as [`Onramps`](#h-onramps). We refer to connections
to external systems that are logically downstream of tremor as [`Offramps`](#h-offramps).

For example; the Kafka onramp subscribes to topics in a Kafka cluster and consumes event data
from those topics; the Kafka offramp publishes to topics in a Kafka cluster and contributes
event data to topics.

Application logic in tremor can be connected to multiple onramps and/or offramps originating from
or contributing to disparate systems. A simple passthrough application could enable bridging a
Kafka system with websockets. It could preserve or transform the external wire-form. It could
filter and partition event data using content based routing.

The application logic is always based on tremor internal representation of the data, never on
the external wire-format. This is by design.

Tremor has built-in support for metrics capture of data ingested and distributed ( metrics ) and
also for communicating back-pressure events to application logic so that quality-of-service can
be tuned adaptively.

### Onramps

Tremor supports a number of stable general purpose onramps:

* [Kafka](https://docs.tremor.rs/artefacts/onramps/#kafka)
* [TCP](https://docs.tremor.rs/artefacts/onramps/#TCP)
* [UDP](https://docs.tremor.rs/artefacts/onramps/#udp)
* [WS](https://docs.tremor.rs/artefacts/onramps/#WS)
* [File](https://docs.tremor.rs/artefacts/onramps/#File) - reads a singular file
* [Metronome](https://docs.tremor.rs/artefacts/onramps/#metronome) - periodic tick events
* [Crononome](https://docs.tremor.rs/artefacts/onramps/#crononome) - cron based tick events
* [Blaster](https://docs.tremor.rs/artefacts/onramps/#blaster) - Benchmarking onramp

And some early-access evolving production-grade onramps:

* [REST](https://docs.tremor.rs/artefacts/onramps/#REST)

### Offramps

Tremor supports a numbre of stable general purpose offramps:

* [File](https://docs.tremor.rs/artefacts/offramps/#File)
* [Kafka](https://docs.tremor.rs/artefacts/offramps/#Kafka)
* [REST](https://docs.tremor.rs/artefacts/offramps/#REST)
* [TCP](https://docs.tremor.rs/artefacts/offramps/#TCP)
* [UDP](https://docs.tremor.rs/artefacts/offramps/#UDP)
* [WS](https://docs.tremor.rs/artefacts/offramps/#WS)
* [BlackHole](https://docs.tremor.rs/artefacts/offramps/#REST) - benchmarking offramp
* [elastic](https://docs.tremor.rs/artefacts/offramps/#elastic) - ElasticSearch client
* [debug](https://docs.tremor.rs/artefacts/offramps/#REST) - tremor internal use for debugging
* [stdout](https://docs.tremor.rs/artefacts/offramps/#stdout)
