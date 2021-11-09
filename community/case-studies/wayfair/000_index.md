# Wayfair

![wayfair](./media/wayfair.png)

Development on tremor started in the autumn of 2018 as a point solution
for introducing a configurable traffic shaping mechanism for our
infrastructure platform engineering organization.

There were two use cases being considered at the time - the traffic-shaping use case,
which had the highest priority, and the distributed data replication use case for our
Kafka-based environments.

## The Origin of Tremor

The [Traffic Shaping](./traffic-shaping)
use case required that log information streaming from various systems be
categorized and classified in-flight, so that temporally bound rate
limits could be applied if, or rather when, our production estate has a
working set that is in excess of our current capacity.

As a 24x7x365 eCommerce environment with year on year higher peaks,
higher volumetrics and higher loads on our systems - this is a frequent
occurrence. Tremor was designed to remove the burden of scaling these
systems from our system reliability and network operations center
engineers.  
  
This use case saw the birth of tremor. It was inflexible - only
supported connectivity kafka for ingres and elasticsearch downstream.
And the classification and rate limiting logic was more or less
hardwired.

But, it was delivered in 6 weeks just in time for its first Cyber 5 (
the long bank-holiday weekend in the US centered around Thanksgiving
where US folk go peak shopping! ) - and it worked flawlessly.

Although designed with our logging systems in mind, our metrics systems
team saw that the same system would work for their environment (
InfluxDB downstream rather than ElasticSearch, but the logic was
basically the same ).

Tremor was designed to detect or sense when downstream systems are
suffering back-pressure and based on user defined logic - to react
to events by adaptively tuning the data distribution to selectively
discard or forward data based on a classification system and rate limits.

## The Rise of event processing

The user defined logic required by our logging and metrics teams very
quickly became sophisticated. A fairly quick succession of releases saw
the logic change from fairly simple filtering, classification (
enrichment ) and rate limiting ( selective dropping due to backpressure
) to richer needs to slice and dice nested JSON-like data, to normalize
these datasets.

The rising processing sophistication and the adoption of Tremor to
displace and replace Logstash and other log shipping frameworks in our
source hosts, and to displace and replace telegraf in our metrics
environments gave birth to tremor as an [event processing
engine](./data-distribution)
in its own right.

With richer programming primitives Tremor advanced from traffic shaping,
and log and metrics shipping to log and cleansing, normalization,
enrichment and transformation to impose a common symbology and structure
on logs and metrics generated from many different programming languages,
platforms and tools across our production estate - from system logs
originated via syslog, or via an application as Graylog Extended Logs,
or via prometheus.

The YAML based configuration of the query pipelines quickly became error
prone and cumbersome as the sophistication, complexity and size of
application logic grew. In parallel, the success of the scripting
language
[<u>tremor-script</u>](/docs/next/getting-started/scripting)
and its hygienic set of tooling and IDE integration supported adding a
query language - giving birth to [<u>data flow
processing</u>](./data-flow)
with tremor.

## Cloud native migration

In parallel, our technology organisation was preparing for migration
from on-premise data-centres to cloud-based systems. Our legacy VM-based
systems were now being containerized and deployed via Kubernetes in our
on-premise environments.  
  
Simultaneously, our cloud-native infrastructure, configuration as code,
secrets management, developer scaling and many other infrastructure and
development platform teams were building out the services that would
allow our line of business service engineers to migrate to the cloud.

Tremor was already battle-hardened as a sidecar deployment and this was
extended to cloud-native deployments by our kubernetes team who packaged
tremor for kubernetes as a set of [<u>helm
charts</u>](./kubernetes-sidecars).

As a relatively fast-paced technology organization - our logging and
metrics teams weren’t standing still - the scripting and query languages
enabled rapid development but lack of native support in tremor to
modularise and reuse logic became a limiting factor.

Thus, over the span of approximately a year most of the [<u>modularity
mechanisms</u>](./modularity)
now standard in tremor today were developed.

Tremor was now battle tested, battle hardened and widely adopted having
gone through many enhancements and replacing many disparate tools and
frameworks with a single easy to operate solution.  
  
Tremor is the first major component of in-house critical infrastructure
that was open sourced by Wayfair and contributed to the Linux Foundation
under the Cloud Native Compute Foundation.

The tremor team selected a panel of experts and friends who had early
access to tremor and assisted with the open sourcing process.

## Tremor today

Today, tremor is planned and progresses in the open. Anyone can
contribute, and with contribution comes maintainership. Tremor is now a
community project of the CNCF and maintainership has grown beyond
Wayfair.

At Wayfair, tremor has been adopted for our search environments. Our
search domain has some complex use cases for audited document
elementization and indexing that are multi-participant and that need to
occur transactionally.

Tremor’s QoS mechanisms were extended to support [<u>transaction
orchestration</u>](./search)
to enable this and similar use cases. Our search teams are also
leveraging tremor for its traditional areas of strength in traffic
shaping and adaptive rate limiting.

Our logging and metrics teams are now recalibrating our technology
organizations philosophy and core infrastructure that supports
observability across our production estate. The rise of CNCF
OpenTelemetry offers developers a consistent and stable set of
primitives for logs, metrics and distributed tracing. It’s a lingua
franca that offers developers consistency.  
  
Even more important to large or extreme scale organizations is
flexibility to make infrastructure and service decisions based on
capacity, cost, or other concerns. Through CNCF OpenTelemetry as a core
building block, now natively supported in tremor, our observability
teams can now unify our production support, operations and services
around tremor-based OpenTelemetry - preserving the key values that
tremor adds, whilst opening up the cloud native new possibilities that
OpenTelemetry and [<u>OpenTelemetry based
services</u>](./uop)
offer.

## Tremor tomorrow

As tremor continues to evolve and grow in adoption inside Wayfair and
in the wider Tremor and Open Source community we know that clustering
primitives and better flexibility in composing distributed event based
systems are an important and common and shared concern across the tremor
use cases we’ve seen at Wayfair and the adoptions of Tremor in other
organizations.

As the tremor community grows, we have seen great contributions from the
growing tremor community adding support for many different types of
systems - ranging from the addition of AMQP support by Nokia
Communications through to our ongoing collaboration with Microsoft
Research on the `snmalloc` allocator which tremor defaults to.  
  
The tremor maintainers also work on the rust port of simd-json - SIMD
accelerated JSON, which is a sister project to tremor. Mentorships via
the Linux Foundation are also producing some wonderful new capabilities
and enhancements to the system ranging from better support for
developing gRPC based connectors in tremor, through to GCP connectivity
or work to add a plugin development kit to tremor.  
  
Wayfair is already benefiting from community interest and contributions
to the project - and the tremor team has hired its newest member as a
result of open sourcing the project. We are hoping to package and open
source more components of Wayfair’s tremor-based systems through the
tremor project, and through other open source projects at Wayfair
through our new Open Source Programming Office.

If you are interested - hop on over to our [<u>community chat
server</u>](https://chat.tremor.rs/) and say hello!
