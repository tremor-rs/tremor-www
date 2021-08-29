- Feature Name: rfc_0005_circuit_breaker_mechanism
- Start Date: 2020-01-27
- Issue: [tremor-rs/tremor-rfcs#0008](https://github.com/tremor-rs/tremor-rfcs/issues/8)
- RFC PR: [tremor-rs/tremor-rfcs#0009](https://github.com/tremor-rs/tremor-rfcs/pull/9)

# Summary
[summary]: #summary

The tremor-runtime supports events from three different basic origins:
* Events are user-defined business data events that arrive ultimately via Onramps and depart ultimately via Oframps
* Signals are injected control events that are visible to operators and ramps.
* Contraflow are injected control events that are visible to operators and ramps and travel in the contra-sense of primary flow.

There is no mechanism to compensate for failures detected in externalising upstream or downstream components within
the deployed graph of tremor artefacts. The circuit-breaker operator defines an event protocol that standardises
how failure detection signals, events and actions are communicated across the tremor runtime.

# Motivation
[motivation]: #motivation

The absence of a standard and uniform circuit breaker interface prohibits authors of tremor-script / tremor-query
from writing compensating logic and behaviours that are adaptive to failures in the runtime environment. The
circuit breaker operator separates the signals, events and actions that are implied by circuit breakers with
an operator that allows circuit breaker events to be leveraged by user-defined logic in the tremor-runtime
regardless of the point of origin of those signals, events and actions.

# Guide-level explanation
[guide-level-explanation]: #guide-level-explanation

Definition of a circuit breaker with exponential backoff strategy
and a rate based failure detector.

```trickle
define qos::circuit_breaker operator cb
with
    backoff = "exponential",
    detector = "success_rate_over_time_window",
end
```

Application of a circuit breaker to external inbound events from an external non-reliable data source

```trickle
create operator blue_smoke from cb;

select event from in into cb;
select event from cb/cb into out/cb;
```

Circuit Breaker signals:
* Circuit breaker enabled
* Circuit breaker disabled

Circuit breakers events:
* Opened - The circuit breaker has transitioned from 'closed' to 'opened' for a named external endpoint.
* Closed - The circuit braeker has transitioned from 'opened' to 'closed' for a named external endpoint.

# Reference-level explanation
[reference-level-explanation]: #reference-level-explanation

None

# Drawbacks
[drawbacks]: #drawbacks

None

# Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

The introduction of circuit breakers enables finer grained control of compensating logic when
external sources or sinks are detected as failed. The circuit breaker operator encapsulates
runtime signals and contraflow so that circuit breaker's can be used simply in user defined
logic.

# Prior art
[prior-art]: #prior-art

[Circuit Breaker Design Pattern](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern)

[Crius](https://crates.io/crates/crius)

[Failsafe](https://crates.io/crates/failsafe)


# Unresolved questions
[unresolved-questions]: #unresolved-questions

A related concern in the tremor-runtime is backoff handling for back-pressure in downstream
systems ( eg: Influx, ElasticSearch ). These use contraflow to propagate context to a
back-pressure operator.

There may be an opportunity to refactor the backpressure operator, separating out backoff
handling logic. This should be considered by the implementor and this RFC updated accordingly.

This RFC does not specify internals or implementation which is left to the
implementor. The motiviating example should be sufficient to drive a suitable
implementation.

# Future possibilities
[future-possibilities]: #future-possibilities

None known at this time.
