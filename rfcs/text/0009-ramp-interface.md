- Feature Name: ramp-interface
- Start Date: 2020-03-09
- Tremor Issue: [tremor-rs/tremor-runtime#0108](https://github.com/tremor-rs/tremor-runtime/issues/108) TBD
- RFC PR: [tremor-rs/tremor-rfcs#0018](https://github.com/tremor-rs/tremor-rfcs/pull/0018)

# Summary

[summary]: #summary

This RFC proposes a generalized interface for onramps(sources) and offramps(sinks). This interface can serve as a basis for the PDK as it unifies how tremor core addresses ramps. As a second benefit, it could serve as a de facto standard for sources and sinks in the broader rust event processing ecosystem.

# Motivation

[motivation]: #motivation

The [RFC 0006](https://rfcs.tremor.rs/0006-plugin-development-kit/) outlines the need and plan to implement a plugin development kit allow decoupling parts of tremor to make development less centered around a single artifact.

To enable plugins, plugins of the same type need to share a standard interface over which they communicate with the outside world. As of today, ramps are the least standardized component in tremor where each ramp, in no small degree, "does its own thing." A standardized interface paves the way to implement ramps in the PDK.

The secondary motivation is that there is an emerging event processing ecosystem in the rust world, providing a standardized interface that helps code reusability, quality, and sharing. For example, sharing code with timber.io's Vector project could become possible.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

We introduce a Sink and a Source trait. Those traits abstract over the following parts:

- configuration
- data handling
- status handling (errors, failures, backpressure for sinks)
- lifetime management (initialization and shutdown)
- event handoff (either to or from the onramp)
- circuit breaker control/signals/events
- support for guaranteed delivery

These interface changes trigger a redesign of the current codecs and pre/post processors as they would likely be outside of the scope of a sink or source.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

We should discuss the communication design at this part to provide reasoning as to why it is sound.

To enable circuit breakers and guaranteed delivery, we need to communicate from a source through a pipeline to an offramp. This model comes with a challenge of a possible live lock at the source and pipeline level. To elaborate, we look at the source as an example. The loop of communication creates the possibility that the source sends an event to the pipeline, blocking at a full queue. At the same time, the pipeline sends an insight to the source, also blocking at a full queue and thus locking forever.

To resolve the lock, we use an unbounded queue for insights. Without additional guarantees, unbounded queues hold the risk of uncontrolled risk. In the implementation we guard against that in two ways so we can guarantee a sound implementation:

1. In both pipelines and sources, we always process insights first, so forward flow only happens when there is no contraflow remaining to process. By that, we guarantee that before we send an event, we drain all pending insights (and their unbounded queues).

2. Events create insights. Neither sinks nor pipelines can create an insight without a corresponding event. If no events flow forward, there is a finite number of insights to be processed, so while we use unbounded queues, we bound the number of insights that can exist between two events.

# Drawbacks

[drawbacks]: #drawbacks

Generalized sinks and sources are less specialized than custom-built ones. The chances are good that it complicates some of the implementations and can have a slight negative impact on performance.

The implementation lends itself to adopt an async based implementation. A move from threads to async tasks puts a performance penalty on single pipeline deployments. The trade-off here is that an async implementation lends itself to higher concurrency situations and is less impacted when there are many more pipelines or ramps than available cores. Looking down the roadmap, this does provide the characteristics we need for clustering.

To put this in numbers here, a comparison of 0.8.0 compared with the async implementation. To do this, we ran the test with three physical cores and 42 threads (24 cores + 24 threads). We then run both 0.8.0 and current with 1, 2, 4, 8, 16, 32, and 64 pipelines and onramps against a single blackhole offramp and the throughput recorded.

| MB/s | 0.8 - 3 | cur - 3 | 0.8 - 48 | cur - 48 |
| ---: | ------: | ------: | -------: | -------: |
|    1 |   346.3 |   273.8 |    155.4 |    128.6 |
|    2 |   303.9 |   339.1 |    261.2 |    292.3 |
|    4 |   210.8 |   342.7 |    175.2 |    234.2 |
|    8 |    78.2 |   308.3 |    163.6 |    209.9 |
|   16 |    27.0 |   265.6 |    174.1 |    210.9 |
|   32 |     8.2 |   245.9 |    173.0 |    201.2 |
|   64 |     1.4 |   229.8 |    154.4 |    197.4 |

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

First of all, not generalizing ramps excludes them from the PDK.

The second rationale and alternative is the choice between a strictly threaded and an asynchronous model already described in the drawbacks section. It also details why the negative impact on single-threaded performance is a worthwhile trade-off.

# Prior art

[prior-art]: #prior-art

Generalized interfaces are a typical pattern. One example is the [ring](https://github.com/ring-clojure/ring), a common abstraction over web applications that allows the reuse of shared parts and logic. Other applications and domains use the same principle to create a more extensive ecosystem around a concept.

# Unresolved questions

[unresolved-questions]: #unresolved-questions

This RFC does not address linked on/offramps since they are a particular case.

# Future possibilities

[future-possibilities]: #future-possibilities

A further opportunity is to extend the concept of generalized ramps to linked on and offramps.

For the time being, Sinks and Sources exist as abstractions under the Onramp / Offramp model. We can remove this abstraction when we have ensured the model works with linked ramps.
