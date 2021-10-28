---
id: overview
title: Architecture Overview
sidebar_position: 100
---

# Overview

This page is an overview of the Tremor Project and the model it is built on.

## What is Tremor?

Tremor is an event processing system designed to process and distribute unstructured data at scale. It primarily supports structural pattern matching, filtering, and transformation of data.

## Functionality

Tremor is designed to handle the following:

- Data Bridging - Tremor bridges asynchronous sources with synchronous sinks. Its ability to bridge sync/async and vice-versa enables message flows to be classified, dimensioned, segmented, and routed using user defined logic while handling back-pressure and other distributed systems problems on behalf of its operators.
- Distribution at Scale - Tremor is designed for high volume messaging environments. Using proactive rate limiting and a novel algorithm to handle back-propagation, Tremor optimizes back-pressure handling at capacity up to 10x more efficiently than alternatives such as Logstash and Telegraf.
- In-flight Redeployment - Tremor can be reconfigured via its API to allow workload migration and reconfiguration without redeployment.
- Event processing - Tremor's primary goal is to operate as an Extract, Transform, and Loading (ETL) tool. While Tremor adopts principles from Distributed Event Based Systems (DEBS), Event Stream Processor (ESP) and Complex Event Processing (CEP) infrastructures, it is by no means an exhaustive system that encompasses all the aforementioned communities' features and requirements.

![Tremor Stats](https://www.tremor.rs/img/tremor/stats.png)

## Tremor URLs

Since Tremor v0.4, all internal artefacts and running instances of **onramps**, **offramps** and **pipelines** are dynamically configurable. Connection with these artefacts and the Tremor API is facilitated through Tremor URLs:

| Example URL                  | Description                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `tremor://localhost:9898/`   | A local Tremor instance<br />_ Accessible on the local host<br />_ REST API on port 9898 of the local host |
| `tremor:///`                 | Returns the current Tremor instance                                                                      |
| `tremor:///pipeline`         | Returns a list of pipelines                                                                                        |
| `tremor:///pipeline/pl_01`     | Returns a pipeline with identifier 'pl_01'                                            |
| `tremor:///onramp/on_1`     | Returns an onramp with identifier 'on_01'                                                       |
| `tremor:///offramp/off_01`  | Returns an offramp with identifier 'off_01'                                                       |
| `tremor:///binding/bn_01`     | A binding that connects two artefacts                                                |
| `tremor:///binding/bn_01/tl_01` | An active instance of data exchange between two artefacts                                         |
|                              |                                                                                                            |

The Tremor REST API and configuration file formats follow the same URL format.

The current configuration model uses a shorthand URL form. It discriminates artefacts by type, so it is often sufficient to infer the `tremor:///{artefact-kind}` component when specifying configuring artefacts.

For bindings, full URL path components are needed (ie.:`/pipeline/01`).

## Runtime Model

Tremor's runtime model is composed of tasks that communicate via queues managed through Tremor's REST API. A task is spawned per onramp, offramp, and pipeline.


Tremor uses an async task model on top of the [smol runtime](https://github.com/stjepang/smol) and
[async-rs](https://async.rs/).

:::note
The Processing model will likely evolve over time alongside concurrency, threading, async and other primitives available in the rust ecosystem.
:::

## Event Ordering

Events flow from onramps (sources), through pipelines (connectors) that ingest them into the system, to offramps (sinks) that push them to external systems.

Tremor imposes causal event ordering over ingested events and processes events deterministically, although, given its nature as a distributed system, it cannot impose a total ordering over all ingested events.

Events flowing into Tremor from multiple onramps and multiple clients are considered independent. However, events sent by a _specific_ client through a _specific_ onramp into a _passthrough_ pipeline will flow through Tremor in their _origin_ order and be passed to offramps in the same _origin_ order. Requests from multiple independent sources over the same pipeline may arbitrarily interleave, but will not re-order.

In pipelines, events are processed in depth first order. In cases where Tremor operators have no intrinsic ordering (such as a branch split), Tremor internally _imposes_ an order.

Operator's may reorder events. For example, a windowed operator might batch multiple events into a single batch. An iterator could then operate on the batch and forward the events in an order that is the reverse of the original ingested order.

It is important to remember that Tremor itself does not re-order events - the order they are processed in is strictly deterministic.

## Pipeline Model

The core processing model of Tremor is based on a directed-acyclic-graph based dataflow model.

Tremor pipelines are a graph of vertices (operators) with directed edges (connections) between operators in the graph.

Events from the outside world in a Tremor pipeline can only flow in one direction from input operators (connecting the pipeline to onramps) to output operators (connecting the pipeline to offramps).

Operators process events and may produce **zero to multiple** output events for each event processed. As the building block of Tremor's processing logic, operators are designed for extension.

Tremor pipelines are able to process three types of events:

- Data-flow
- Signal-flow
- Contra-flow

### Data Flow

Data flow constitute the majority of events that flow through Tremor's pipelines.

These events that carry transactional data are ingested via onramps from external upstream systems, processed through pipelines, then pushed via offramps to external dowstream systems.

### Signal Flow

Signal flow events are hidden from pipeline authors, but visible to onramp, offramp and operator developers. They are synthetic events generated by the tremor-runtime system that can be used by operators for advanced event handling purposes.

### Contraflow

Contraflow events are sythentic events delivered under conditions caused by processing events already in a Tremor system. Tremor handles back-pressure events by exploiting contraflow.

The asynchronous nature of distributed event-based systems causes complications when resolving back-propogation issues. Tremor employs a novel algorithm to handle back-pressure and other events that propagate _backwards_ through a pipeline.

Pipelines are directed-acyclic-graphs (DAGs), so how do we back-propagate events without introducing cycles?

Givens:
- There can be no cycles in a DAG.
- DAGS are traversed in depth-first-search (DFS) order.
- There can be no cycles in a DAG traversed in reverse-DFS order.

The proposed solution:
- If we join a DAG _d_ with its mirrored (reversed) DAG _d'_, we get another DAG where:
  - Every output in _d_ propogates events in _d'_ without cycles through its _d'_ mirrored input.
  - Branches in _d_ become combinators in _d'_.
  - Combinators in _d_ become branches in _d'_.
  - Any back-pressure detected in the processing of existing events can result in a synthetic signaling event injected into the reverse-DAG.
- The output-input pair at the heart of contraflow is called the 'pivot point'.
- Injected events are called 'contraflow' because they move _backwards_ against the primary data flow.

Result:
- The cost of not injecting a contraflow event is zero.
- The cost of an injected contraflow event, in Tremor, is minimized through pruning. For example, operators that are not contraflow aware do not receive or process contraflow events (Tremor optimizes for this case).

There are other alternatives to handle back-pressure (such as those utilized by Spark, Storm, Hazelcast Jet, etc), however, Contraflow provides a much simpler solution than all other reasonable mechanisms with far fewer negative side-effects. Contraflow allows the Tremor project to provide users a tool to develop verifiable systems while undertaking much of the work needed to produce a lasting solution.

## Guaranteed Delivery

Tremor supports guaranteed delivery as long as both onramps and offramps support it. For onramps that do not provide natural support, the [qos::wal](scripting/tremor-query/operators.md#qos::wal) can be used to introduce a layer of guaranteed delivery.

Each event has a monotonic growing ID. Once an event ID is acknowledged
as delivered, so are all other events with lower Id values. If an event ID
is marked as failed to deliver, all events up to its ID value will be redeployed.

## Runtime Facilities

Tremor's runtime is composed of multiple facilities that work together to provide service.

### Conductors

Tremor uses a REST-based API that allows its operators to manage the lifecycle of onramps, offramps and pipelines deployed into a Tremor based system.

The set of facilities in the runtime that are related to service lifecycle, activation, and management are  referred to collectively as the Tremor conductor or Tremor control plane.

Operators can conduct up to multiple Tremor servers through its REST based API.

The API in turn interfaces with registry and repository facilities. Tremor distinguishes between artefacts and instances. Artefacts have no runtime overhead.

Artefacts in Tremor are declarative specifications of:

- Onramps - a specific configuration of a supported onramp type
- Offramps - a specific configuration of a supported offramp type
- Pipelines - a specific configuration of a pipeline graph
- Bindings - a specefic configuration of how all other artefacts should be connected

Artefacts can be thought of as analagous to code. They are a set of instructions, rules or configurations. As such, they are registered with Tremor via its API and stored in Tremor's artefact repository.

Deployment in Tremor is achieved through a mapping artefact. The mapping artefact specifies how artefacts should be deployed into one or many runtime instances, activated, and connected to live instances of onramps or offramps.

In Tremor, publishing a mapping results in instances being deployed. By unpublishing or deleting a mapping, instances are undeployed.

### Metrics

Metrics in Tremor are implemented as a pipeline and deployed during startup. They are built-in and cannot be undeployed.

Operators are able to attach offramps to the metrics service to distribute metrics to external systems, such as InfluxDB or Kafka.

## Data Model

Tremor supports unstructured data which can be in the form of raw binary, JSON, MsgPack, Influx or other structures.

Data can be ingested into a Tremor pipeline in any **supported** format.

Tremor pipeline operators will assume _some_ structure. For hierarchic or nested formats such as JSON and MsgPack, Tremor uses `serde` serialisation and deserialisation capabilities.

Therefore, the _in-memory_ format for _JSON-like_ data in Tremor is effectively a `simd_json::Value`. This provides the advantage of allowing Tremor-script to work with YAML, JSON or MsgPack data with no changes or considerations in the Tremor-script based on the origin data's format.

For line-oriented formats such as the Influx Line Protocol or GELF, they are typically transformed into Tremor's in-memory format (currently based on `serde`).

For raw binary or other data formats, Tremor provides a growing set of codecs that convert external data into Tremor in-memory form or vice-versa.

In general, operators and developers should _minimize_ the number of encoding/decoding steps required for the transit of data through Tremor or between Tremor instances.

Since the major overhead in most Tremor systems is encoding and decoding and JSON is the dominant data format, we [ported](https://github.com/simd-lite/simdjson-rs) [simd-json](https://github.com/lemire/simdjson) to reduce the cost of encoding and decoding significantly compared to other JSON implementations in Rust.

### Distribution Model

Tremor does not yet have an out-of-the-box network protocol. A native Tremor protocol is planned for development in the immediate/mid-term.

As such, Tremor's distribution model is currently limited to the set of available onramp and offramp connectors.

However, the websocket [onramp](artefacts/onramps.md#ws) and [offramp](artefacts/offramps.md#ws) can be used for Tremor to Tremor communication.

### Client/Server

Tremor, is currently a client-server system. It uses a synchronous blocking RESTful API over HTTP to conduct operations related to its high throughput and high performance pipeline-oriented data plane.

In the near future we plan on developing clustering capability, making Tremor a fully distributed system. Tremor will still support client-server deployments through a standalone mode of clustered operation, which can be thought of as a cluster of one.
