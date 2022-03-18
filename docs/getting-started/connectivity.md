---
title: Connectivity
description: Talking to other systems- Connecting different systems is an integral part of Tremor.
hide_table_of_contents: false
---

### Concept

In order to provide a general-purpose event processing facility to a broad base
of applications, Tremor separates processing from connectivity and distribution.

Tremor further separates the syntax of external formats from the implied value type semantics that are useful for filtering, processing, transforming, aggregating or otherwise deriving synthetic events from streams of data ingested by Tremor processes.

As Tremor is primarily an event-processing system, we refer to connections to external systems that are logically upstream of Tremor as [`Onramps`](#h-onramps).

We refer to connections to external systems that are logically downstream of Tremor as [`Offramps`](#h-offramps).

For example, the Kafka onramp subscribes to topics in a Kafka cluster and consumes event data from those topics; the Kafka offramp publishes to topics in a Kafka cluster and contributes event data to topics.

Application logic in Tremor can be connected to multiple onramps and/or offramps originating from or contributing to disparate systems. A basic passthrough application could enable bridging a Kafka system with websockets. It could preserve or transform the external wire-form. It could filter and partition event data using content based routing.

The application logic is always based on Tremor-internal representation of the data, never on the external wire-format. This is by design.

Tremor has built-in support for metrics capture of data ingested and distributed (metrics) and also for communicating back-pressure events to application logic so that quality-of-service can be tuned adaptively.

### Onramps

Tremor supports a number of stable general purpose onramps:

* [Kafka](/docs/artefacts/onramps/#kafka)
* [TCP](/docs/artefacts/onramps/#tcp)
* [UDP](/docs/artefacts/onramps/#udp)
* [WS](/docs/artefacts/onramps/#WS)
* [File](/docs/artefacts/onramps/#file)- reads a singular file.
* [Metronome](/docs/artefacts/onramps/#metronome)- periodic tick events.
* [Crononome](/docs/artefacts/onramps/#crononome)- cron based tick events.
* [Blaster](/docs/artefacts/onramps/#blaster)- Benchmarking onramp.

And some early-access evolving production-grade onramps:

* [REST](/docs/artefacts/onramps/#rest)

### Offramps

Tremor supports a number of stable general purpose offramps:

* [File](/docs/artefacts/offramps/#file)
* [Kafka](/docs/artefacts/offramps/#kafka)
* [REST](/docs/artefacts/offramps/#rest)
* [TCP](/docs/artefacts/offramps/#tcp)
* [UDP](/docs/artefacts/offramps/#udp)
* [WS](/docs/artefacts/offramps/#ws)
* [BlackHole](/docs/artefacts/offramps/#rest)- benchmarking offramp.
* [elastic](/docs/artefacts/offramps/#elastic)- ElasticSearch client
* [debug](/docs/artefacts/offramps/#rest)- tremor internal use for debugging.
* [stdout](/docs/artefacts/offramps/#stdout)
