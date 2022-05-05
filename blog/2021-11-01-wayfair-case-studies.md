---
title: Wayfair Case Study
tags:  [case-study, wayfair]
author: The Tremor Team
author_url: https://github.com/tremor-rs
author_image_url: https://avatars.githubusercontent.com/u/60009416?s=200&v=4
image: ./media/wayfair.png
draft: false
hide_table_of_contents: false
---

# Wayfair

![wayfair](./media/wayfair.png)

Development on Tremor started in the autumn of 2018 as a point solution
for introducing a configurable traffic-shaping mechanism for our
infrastructure platform engineering organization.

There were two use cases being considered at the time- the traffic-shaping use case, which had the highest priority; and a distributed data replication use case for our Kafka-based environments.

## The Origin of Tremor

The [Traffic Shaping](./2021-11-02-traffic-shaping.md)
use case required that log information streaming from various systems be
categorized and classified in-flight, so that temporally bound rate
limits could be applied when our production estate has a
working set that is in excess of our current capacity. As a
24x7x365 eCommerce environment with year-on-year higher peaks,
higher volumetrics and higher loads on our systems, this is a frequent
occurrence. Tremor was designed to remove the burden of scaling these
systems from our system reliability and network operations center
engineers.  
  
This use case saw the birth of Tremor, which was delivered in 6 weeks,
just in time for Cyber 5 (the long bank-holiday weekend in the US centered around Thanksgiving,
where US folk go peak shopping!). At the time, Tremor was inflexible; only
supported connectivity to Kafka for Ingres and Elasticsearch downstream; and, the classification
and rate-limiting logic was more or less hardwired- but it worked flawlessly!

Although designed with our logging systems in mind, our metrics systems
team saw that Tremor would work for their environment (InfluxDB downstream rather than Elasticsearch, but the logic was
basically the same). Tremor was designed to detect backpressure on downstream systems, and to intelligently- based on user defined
logic- react by adaptively tuning the data distribution to
selectively discard or forward data based on a classification system and rate limits.

## The Rise of Event Processing

The user-defined logic required by our logging and metrics teams very
quickly became sophisticated. A fairly quick succession of releases saw
the logic change from fairly simple filtering, classification (enrichment)
and rate limiting (selective dropping due to backpressure) to richer needs to slice and dice nested JSON-like data, to normalize
these datasets. This rising need for sophistication in processing along with the adoption of Tremor to replace Logstash and other log shipping frameworks in our
source nodes, and to replace Telegraf in our metrics environments, gave birth to Tremor as an [event processing engine](./2021-11-03-data-distribution.md) in its own right.

With richer programming primitives, Tremor advanced from traffic shaping,
and log and metrics shipping to log and metrics cleansing, normalisation,
enrichment and transformation, to impose a common symbology and structure
on logs and metrics generated from many different programming languages,
platforms and tools across our production estate- from system logs
originated via Syslog, to those via GELF, or Prometheus.

The YAML-based configuration of the query pipelines quickly became error-prone and cumbersome as the sophistication, complexity and size of
application logic grew. In addition, the success of our scripting
language, [tremor-script](docs/0.11/tremor-script/index),
and its hygienic set of tooling and IDE integration encouraged the addition a
query language, thus enabling [data flow processing](./2021-11-04-data-flow.md) with Tremor.

## Cloud Native Migration

At the same time, our technology organisation was preparing for migration
from on-premise data centres to cloud-based systems. Our legacy VM-based
systems were now being containerised and deployed via Kubernetes in our
on-premise environments. Simultaneously, our Cloud-native infrastructure, configuration as code,
secrets management, developer scaling and many other infrastructure and
development platform teams were building out the services that would
allow our line of business service engineers to migrate to the cloud.

Tremor was already battle-hardened as a sidecar deployment, and this was
extended to Cloud-native deployments by our kubernetes team who packaged
Tremor for kubernetes as a set of [helm charts](./2021-11-05-kubernetes-sidecars.md).

As a relatively fast-paced technology organisation, our logging and
metrics teams weren’t stalled- the scripting and query languages
enabled rapid development. However, lack of native support in Tremor to
modularise and reuse logic became a limiting factor. Thus, over the span of approximately a year, most of the [modularity mechanisms](./2021-11-06-modularity.md), now standard in Tremor, were developed.

Tremor was now battle-tested, battle-hardened and widely adopted, having
gone through many enhancements and replacing many disparate tools and
frameworks with a single, easy-to-operate solution.  
  
Tremor is the first major component of in-house critical infrastructure
that was open-sourced by Wayfair and contributed to the Linux Foundation
under the Cloud Native Computing Foundation.

The Tremor team then selected a panel of experts and friends, who had early
access to Tremor, to assist with the open-sourcing process.

## Tremor Today

Today, Tremor is planned and progresses in the open. Anyone can
contribute, and with contribution comes maintainership. Tremor is now a CNCF
community (sandbox) project, and maintainership has grown beyond
Wayfair.

At Wayfair, Tremor has been adopted for our search environments. Our
search domain has some complex use cases for audited document
elementisation and indexing that are multi-participant and that need to
occur transactionally.

Tremor’s QoS mechanisms were extended to support [transaction orchestration](./2021-11-07-search.md) to enable this and similar use cases. Our search teams are also
leveraging Tremor for its traditional areas of strength in traffic
shaping and adaptive rate limiting.

Our logging and metrics teams are now recalibrating our technology
organisation's philosophy and core infrastructure that supports
observability across our production estate. The rise of CNCF
OpenTelemetry offers developers a consistent and stable set of
primitives for logs, metrics and distributed tracing. It’s a lingua
franca that offers developers consistency.  
  
Even more important to large or extreme scale organisations is
flexibility to make infrastructure and service decisions based on
capacity, cost, or other concerns. Through CNCF OpenTelemetry as a core
building block, now natively supported in Tremor, our observability
teams can now unify our production support, operations and services
around Tremor-based OpenTelemetry- preserving the key values that
Tremor adds, whilst opening up the Cloud Native new possibilities that
OpenTelemetry and [OpenTelemetry-based services](./2021-11-08-uop.md) offer.

## Tremor Tomorrow

As the tremor community grows, we have seen great contributions from the
growing tremor community adding support for many different types of
systems - ranging from the addition of AMQP support by Nokia
Communications through to our ongoing collaboration with Microsoft
Research on the `snmalloc` allocator which tremor defaults to. 

The latest production solution based on tremor at Wayfair is from our
Developer Platforms technology organization - who have used an extension
to PHP to identify [dead code](./2021-11-09-php-dead-code-detection.md) in our legacy PHP monolith. This solution is
based on tremor and included contributions to tremor in the form of the
`unix_socket` connectivity. Thank you Ramona!

The Tremor maintainers also work on the Rust port of simd-json- SIMD
accelerated JSON, which is a sister project to Tremor. Mentorships via
the Linux Foundation are also producing some wonderful new capabilities
and enhancements to the system, ranging from better support for
developing gRPC-based connectors in Tremor, to GCP connectivity,
or work to add a plugin development kit to Tremor.  
  
Wayfair is already benefiting from community interest and contributions
to the project - and the Tremor team has hired its newest member as a
result of open-sourcing the project. We are hoping to package and open-source more components of Wayfair’s Tremor-based systems through the
Tremor Project, and through other open-source projects at Wayfair
through our new Open Source Program Office.

If you are interested, hop on over to our [community chat
server](https://chat.tremor.rs/) and say hello!
