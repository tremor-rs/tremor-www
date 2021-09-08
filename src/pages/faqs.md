---
title: FAQs
description: Q&A.
hide_table_of_contents: false
draft: false
---

## What is Tremor?

Tremor is an event processing engine designed for high-density deployment in
mission-critical 24x7x365 environments.

It started life as a man-in-the-middle proxy retrofitting near real-time
traffic shaping to all logging and metrics capture, distribution and processing
systems at Wayfair.

The initial release of Tremor supported proactive rate limiting, classification
of data streams based on rules, and reactive backpressure handling processing in excess of 10TB per day of nested structured data.

Tremor has been extended to support rich extract, transform, load and filtering of data streams with a scripting language designed for expressive ETL on JSON-like data structures with SIMD-accelerated JSON processing.

Tremor has been extended to support aggregate query processing and quartile estimation of metrics data with a query language that builds on the scripting language.

Tremor is currently being extended with clustering support based on the RAFT protocol specification, ring-based topologies and V-Nodes inspired by riak-core from Basho Technologies.

Tremor is also a system of plugins, or a framework. Although it is in production for only 50+ production use cases, it is designed to be extended, bent or stretched to other purposes.

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
 

## What is the current state of the project?

Tremor is an early-stage project that is still under active development. It has been in production at scale at Wayfair since October 2018. Tremor has been open-source since February 22, 2020.

Tremor is transitioning from closed to fully open community based development.

