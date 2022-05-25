---
sidebar_position: 0
---

# Tremor

Think about Tremor as an event- or stream-processing engine. It receives input data from various [Connectors], turns the data into streams of structured events with the help of [Preprocessors](reference/preprocessors) and [Codecs]. Those events are then handled by one or more [Pipelines](language/pipelines), which can inspect, mutate and route the event and implement arbitrarily complex application logic. Events are either dropped (e.g. for rate-limiting or traffic-shaping) or sent to downstream systems via various [Connectors]. Before actually leaving the system, those streams of structured events need to be serialized using [Codecs] and [Postprocessors](reference/postprocessors).

How events come into your Tremor system, how they flow through it, how they change shape and leave it again, all this is encoded in a [Flow] written in Tremors own configuration language [Troy]. A Troy file can contain one or many [Flow Definitions](language#flow) and commands to `deploy` them. When Tremor starts, it reads the Troy files provided on the command line and actually deploys and starts those [Flows] in order to let events flow.

#### [**Get Started with Tremor**](./getting-started/index.md)
#### [**Check out our Guides**](./guides/index.md)
#### [**Consult the Reference documentation**](./reference/index.md)
#### [**Learn about Tremors own Configuration Language**](./language/index.md)


## What is Tremor?

Tremor is an event processing engine designed for high-density deployment in mission-critical 24x7x365 environments.

It started life as a man-in-the-middle proxy retrofitting near real-time traffic shaping to all logging and metrics capture, distribution and processing systems at Wayfair.

The initial release of Tremor supported proactive rate limiting, classification of data streams based on rules, and reactive backpressure handling processing in excess of 10TB per day of nested structured data.

Tremor has been extended to support rich extract, transform, load and filtering of data streams with a scripting language designed for expressive ETL on JSON-like data structures with SIMD-accelerated JSON processing.

Tremor has been extended to support aggregate query processing and quartile estimation of metrics data with a query language that builds on the scripting language.

Tremor is currently being extended with clustering support based on the RAFT protocol specification, ring-based topologies and V-Nodes inspired by riak-core from Basho Technologies.

Tremor is also a system of plugins, or a framework. Although it is in production for only 50+ production use cases, it is designed to be extended, bent or stretched to other purposes.

## Tremors Goals

Tremor is designed to keep the data-plane, that is the code-path handling the flow of events directly as fast as possible. We try to copy and allocate as few bytes as we can, make most of the given CPU we have by utilizing SIMD acceleration where we can (e.g. while parsing json or splitting input bytes).

While we are trying to be fast and have this affect our development process big time, our main goal actually is **Operator Satisfaction**. 

To achieve this goal we want to make Tremor as easy and pleasant to use as we can. We have our own, hopefully straightforward configuration language called [Troy], which we think is 1000 times better than YAML (at least) and it allows us to give you very good and helpful error messages and other static analysis on your configuration files. We even have our own [Language Server](https://github.com/tremor-rs/tremor-language-server) and VSCode plugin to make writing Tremor applications easy. Additionally we offer several tools for testing Tremor applications before pushing them to production.

A big part of **Operator Satisfaction** is good observability and easy troubleshooting. Tremor is inspectable via its [API], it exposes its runtime metrics as a separate [Connector] whose metrics events can be sent to any metrics store or time-series database for feeding them into your dashboards.

[Flow]: language/index.md#flows
[Flows]: language/index.md#flows
[Troy]: language/index.md
[Connectors]: reference/connectors
[Connector]: reference/connectors
[Codecs]: reference/codecs
[API]: pathname:///api/v0.12/

## When not to use Tremor?

Tremor displaces, disintermediates or replaces a number of commercial and open-source data processing and distribution solutions deployed at scale within Wayfair.

In Wayfair's case the benefits are:

* A single robust runtime solution with high UX for devops and SRE professionals working in a 24x7x365 environment.
* A scripting and query language with good tooling for debugging and troubleshooting fungible, frequently changing business logic.
* Powerful ETL abstraction and scripting language for slicing, dicing, pattern matching and transforming JSON-like data, with a fast JSON processor.
* A event processing language that supports aggregate functions suitable for many metrics and summary statistics computations.
* A growing but incomplete set of pluggable functions, operators, aggregate functions, and connectors to other systems and protocols.

But, tremor was built with some assumptions:

* Experienced SRE, security, infrastructure and devops folk are available to configure, operate and maximise leverage from Tremor.
* Tremor is not a commercial product, and as such, it has a roadmap that reflects production needs of an eCommerce environment.

And, the needs that drove us to build Tremor may not match your needs, if:

* You are a small team with 'full stack' developers.
  * Tremor was designed and built in an environment with an ecosystem of collaborating teams, each with specialisms.
* There are `missing` connectors, functions or other plugins that are important for your use case.
  * Please raise an issue, or open an RFC.
* You are already using proprietary, open-source or commercial products that are **good enough** for your purposes
  * We recommend following the YAGNI (You ain't gonna need it) principle.
* You see similarity between Tremor and other projects or products.
  * Tremor borrows from multiple domains and disciplines. Tremor has a query language that supports SQL-like queries and aggregate functions.
    This is similar to a CEP (Complex Event Processing) or ESP (Event Stream Processing) engine. It is very likely if you are already using such tools that they are more complete than Tremor today. For example, we do not support event correlation via combinators or temporal pattern matching logic at this time.

If these concerns do not dissuade you, then we would welcome your contributions via our issues list, community chat, via our twitter channel or via contributing and joining our community.