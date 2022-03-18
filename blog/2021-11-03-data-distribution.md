---
title: Case Study - Data Distribution
tags:  [case-study, wayfair]
author: The Tremor Team
author_url: https://github.com/tremor-rs
author_image_url: https://avatars.githubusercontent.com/u/60009416?s=200&v=4
image: ./media/wayfair.png
draft: false
hide_table_of_contents: false
---

# Data Distribution with Tremor

## Happened Before

After the initial production success of tremor as a point solution for capacity
management during our peak trading cycles at Wayfair, the focus shifted a little
to the next key set of issues with our traditional observability platforms.

The simplified architecture of our logging systems is currently:  
  
![old pipeline](./media/data-distribution/image1.png)

The traffic shaping use case was a huge win for Wayfair's SRE and operational
teams who manage our production estate.

## Identified Need

But we could do a lot better. The development lifecycle to capture, normalize,
enrich, enhance and standardize logs from 1000's of engineers, 1000's of applications
built in a diversity of programming languages was a have task for our observability
engineers.

Their environment still looks pretty grim:

![new pipeline](./media/data-distribution/image3.png)

Displace and replace a plethora of in-house, open-source and commercial
off the shelf log capture, metrics capture and data distribution
technologies with a single cost-effective at hyperscale dynamically
load-adaptive solution.

The decision was taken to expand the processing capabilities of tremor beyond
traffic shaping, classification and rate limiting rules to general purpose
data processing of unstructured hierarchic JSON-like data streams. The shape
of data most common within the observability domain we were focused upon.

## Required Outcome

Our systems specialists and service reliability engineers can
consolidate knowledge and tune to a unified operating experience and
center of excellence in our production estate based on a single well
known and cost efficient easy to operate alternative.

### Characteristics

It is understood that data will be captured from and distributed to a
diverse and ever-changing set of production systems - built in many
programming languages and environments and distributed to an unknowable
set of destination systems.  
  
These systems include, but are not limited to: Graylog Extended Log
Format, Syslog,  
Kafka, TCP, UDP, Telegraf, Influx Line Protocol, ElasticSearch and many
more...

> Connectivity must be flexible enough to capture data from and
> distributed data to synchronous, asynchronous protocols, transports
> and systems without developers needing to learn or integrate with a
> new technology. The solution must be invisible to developers.

The unit economics of the existing system is hard to measure, hard to
plan and hard to remediate; especially given the rising year on year
firehose volumetrics, with rising velocity and rising peak loads.

> 99% of the data either originates as JSON, or is transformed to JSON
> just in time.

The target systems for displacement and replacement have very well
understood and extract, load, transform, enrichment and normalization
algorithms that are coded and configured differently in each system.
This is difficult to maintain, enhance and evolve in an environment
where infrastructure and services are continuously evolving.

> A rich set of ETL and data manipulation and mutation primitives are
> required so that all existing methods used for data processing across
> the target systems can be replaced by a single easy to understand,
> easy to program and optimized alternative.

### Solution

Tremor has already established itself in the traffic shaping domain in
the logging and metrics domains - adding just-in-time traffic shaping
capabilities when needed; and preserving the original system’s
operational semantics and behaviours during normal operating conditions
when the system is operating within planned capacity constraints.

![new pipeline](./media/data-distribution/image2.png)

The mandate now expands to replacing many of our event capture systems
deployed on on-premise and cloud-native operating environments across
multiple data-centres globally.

Instead of our operations and service reliability teams needing to learn
and manage the service deployment and administrative lifecycle of
multiple components in this evolution we displace and replace those
systems - typically operating as sidecars on source systems where our
applications run on virtual machines, bare metal or containerized
environments with tremor.

The relatively primitive domain specific language developed as part of
the initial solution for traffic shaping is replaced with a new domain
specific language `tremor-script` designed for expressive data
filtration, extraction, enrichment and transformation to support:

-   Classification, Categorization and rate limiting for Traffic Shaping
-   Enrichment, Normalization and micro-format parsing
-   Structural pattern matching over hierarchical nested JSON-like data
-   The ability to patch, merge and iterate over JSON-like data
-   A familiar expression language like in regular programming languages
    with arithmetic, multiplicative and other common operations on
    numeric and string data
-   Testing string encoded data for regular expression and other
    micro-formats such as the logstash `grok`, `dissect`, `kv`
    or stringified embedded json

The resulting language and interpreter for `tremor-script` forms the
basis of the solution and is largely designed around the needs of the
logging domain - but delivered in a more generally useful incarnation
that is more widely applicable to other domains - such as in flight data
analytics, in flight ETL or processing metrics to name a few.

Most of the in-flight events are JSON or JSON-like. Inspired by a tweet
the tremor team happens upon the work of Daniel Lemire et al and
SIMD-accelerated JSON processing. Heinz ports this to rust and tremor’s
sister project and organization simd-lite is born. The tremor team also
maintains the rust port of simd-json with other maintainers interested
in fast and efficient data parallel parsing of JSON.

Finally, tremor undergoes a steady pace of innovation with benchmark
driven performance optimizations. The combined effect of an efficient
interpreter, the ability to easily benchmark synthetic analogs of real
world use cases in our benchmark system, and the adoption of more
workload appropriate and efficient low level memory allocators such as
`jemalloc`, then `mimalloc`, then `snmalloc` by Microsoft Research
results an order of magnitude level of infrastructure cost savings. The
production estate shrinks by 10x in terms of the number of deployed
systems, the compute capacity required, and the committed memory
required when compared to the displaced and replaced systems.  
  
Further - tremor uses far less memory and resources on the source
systems making it a much improved sidecar on our source hosts.

## Conclusion

Tremor’s core mission and mandate now extends from high quality of
service data distribution with load-adaptive traffic management for the
1% ( and typically less ) of time our systems are under-resourced; and,
the other 99% of the time is 10x more cost efficient.

Tremor preserves its facility to remain invisible to developers during
this phase of expansion whilst drastically improving the lives of our
operational engineers and service reliability engineers. The measured
and validated cost-efficiencies offer compounding value that further
drives the mandate of the project and pushes it into its next phase of
evolution.
