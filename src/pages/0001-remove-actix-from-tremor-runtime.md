- Feature Name: rfc_0001_remove_actix
- Start Date: 2020-01-20
- Issue: [tremor-rs/tremor-rfcs#0001](https://github.com/tremor-rs/tremor-rfcs/issues/1)
- RFC PR: [tremor-rs/tremor-rfcs#0002](https://github.com/tremor-rs/tremor-rfcs/pull/2)

# Summary
[summary]: #summary

Actix should be replaced with a suitable alternative.

# Motivation
[motivation]: #motivation

The actix project in its current form has been discontinued.

Actix is used within the tremor-runtime for control plane facilities off the critical path,
such as hosting the tremor API and is used in some onramps/offramps.

A suitable replacement should be integrated replacing actix.

# Guide-level explanation
[guide-level-explanation]: #guide-level-explanation

The Tremor REST API uses the actix-web project.

The Tremor server uses actix, actix-files actix-cors and actix-web.

These projects are discontinued and need suitable replacements.

# Reference-level explanation
[reference-level-explanation]: #reference-level-explanation

REST API use case:

* Adopt (tide)[https://github.com/http-rs/tide] for REST and HTTP API purposes

WebSocket API use csae:

* Adopt (async-tungstenite)[https://crates.io/crates/async-tungstenite]

Control plane use case:

* Prefer interceptor interface insulating control plane from transport/data format choices
* Replace all uses of core actix actors with a suitable alternative
* Consider channels with event/run loops as an alternative pseudo-actor model
* Consider (bastion)[https://docs.rs/bastion]

# Drawbacks
[drawbacks]: #drawbacks

Tremor-runtime is a working system and is currently stable.

Replacing the control plane, API and websocket facilities will incur some
overhead and risk especially regarding differences in actor model implementations
and how they interoperate with asynchronous or channel based rust code which
tremor exploits heavily.

# Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

The existing test suites in EQC should be sufficient for API purposes to defend
against regression but no alternative is stable, and there is no guarantee that
current external frameworks will be supported in the longer term.

Actix may yet find alternative maintainers and/or it could be forked and maintained
by ourselves, worst case to preserve current investment in the actix project within
tremor.

Actix has an opinionated architecture and implementation which deviates from the goals
and needs of tremor sufficiently that its integration was not without compromise. Revisiting
areas of tremor code currently adopting actix may result in simplification and modernising to
current Rust style and idioms based on fully standards-based async rust, which was not
available when these facilities were implemented.

# Prior art
[prior-art]: #prior-art

As above.

# Unresolved questions
[unresolved-questions]: #unresolved-questions

Consider maintenance dynamics of libraries being considered for adoption with a preferential
biases for smaller libraries that would be easier to maintain if their maintainership changes
looking forward.

# Future possibilities
[future-possibilities]: #future-possibilities

Generalise on async for all facilities currently integrating actix and reconsider tremor
runtime, concurrency and other primitives with async rust as an optimising bias.
