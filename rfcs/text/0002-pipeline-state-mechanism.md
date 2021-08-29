- Feature Name: rfc_0002_pipeline_state_mechanism
- Start Date: 2020-01-22
- Issue: [tremor-rs/tremor-rfcs#0003](https://github.com/tremor-rs/tremor-rfcs/issues/3)
- RFC PR: [tremor-rs/tremor-rfcs#0004](https://github.com/tremor-rs/tremor-rfcs/pull/4)

# Summary
[summary]: #summary

Legacy tremor YAML configured tremor pipeline and Trickle query language pipelines
currently do not track state across events over time. A mechanism is required to
introduce state management and storage facilities to the tremor runtime and made
available to pipeline implementations.

# Motivation
[motivation]: #motivation

The absence of a state mechanism limits the usefulness and extent of algorithms that
can be implemented by tremor to those that are stateless, or those that leverage builtin
custom operators that maintain state such as the 'bucket' or 'batch' operators.

A state mechanism and supporting user-facing facilities would allow users to exploit
stateful algorithms for session tracking, building and maintaining application state
or for the query language to evolve support for in memory or persistent tables.

# Guide-level explanation
[guide-level-explanation]: #guide-level-explanation

The state mechanism in tremor pipelines allows operator node-level state
management and storage that persists for the running lifetime of a pipeline
algorithm deployed into the tremor runtime.

The state mechanism introduces the `state` keyword into the tremor scripting
language. This new keyword provides access to the state storage contents via path
expressions (much like how the `event` keyword works, with the key difference
being that the state storage is shared across events). On pipeline initialization,
the state will be initialized as `null` and users are free to set it to arbitrary
value over the course of processing.

Here's a tremor-script example demonstrating the usage of state mechanism --
it maintains a counter for the events coming in and emits the count alongside
the event:

```tremor
  match type::is_null(state) of
    case true =>
      let state = {"count": 1}
    default =>
      let state.count = state.count + 1
  end;

  {
    "count": state.count,
    "event": event
  }
```

This will work as part of the `runtime::tremor` operator confguration in the legacy
pipeline yaml setup, and also as an embedded script in the trickle definition of
the pipeline.

Other pipeline operators can utilize the same underlying state storage. An example
is the new `generic::counter` operator that replicates the functionality above:

```trickle
define generic::counter operator my_counter;

create operator my_counter;

select event from in into my_counter;
select event from my_counter into out;
```

State is not shared across operator nodes i.e. we have separate state storage for
each operator instance and an operator can access only the storage associated with
the operator.


# Reference-level explanation
[reference-level-explanation]: #reference-level-explanation

A new struct to encapsulate state across each of the operator nodes should be
introduced. Example:

```rust
struct State {
    // this vector holds the state value for each operator node
    ops: Vec<Value<'static>>,
}
```

Inside the struct, the operator node-level state can then be ordered in the same
way as nodes in the pipeline graph, following the strategy we have in use already
for storing the node-level metrics in the graph. When the event is passed to
the operator node for processing, state specific to the operator can then be
passed on by keying on the index of the node in the graph. This ensures that
state is not shared across the operator instances.

The `State` struct will be initialialized on pipeline creation,
and will be destroyed on destruction of a pipline when it is undeployed or
the host process is shut down.

Effectively the `state` mechanism encapsulates the entire micro-state of
a pipeline and any captured user defined logic in a supported scripting
language or operator in a pipeline. This allows pipeline state to be recorded
in a snapshot to support advanced use cases such as pipeline migration through
coordinated passivation, serialization, migration, deserialization and re-activation
of a pipeline on a different tremor-runtime node without loss of state.

In the tremor scripting / query language the `state` keyword provides a reference
onto the associated operator specifc state managed by the runtime.


# Drawbacks
[drawbacks]: #drawbacks

Tremor-runtime is a working system and is currently stable. Since the implementation
of the state mechanism will touch the main event pathways throughout the pipeline
as well as across the scripting language, it has the potential to introduce
inefficiencies as well as instability, if not done right.

By consolidating on a single namespace `state` we remain consistent with
other specialized keyword forms such as `args`, `group`, `window` that have
special meaning in tremor in different contexts/situations. This introduces
cognitive dissonance to the user (but in a managed way).

Regarding the `generic::counter` operator that we have proposed to introduce as
a demonstration of the state mechanism usage in a custom in-built operator, it
may be that it won't find actual real-world usage and it will continue to languish
in our codebase just as an example. Even for the case when people need such a
functionality, it is trivially replicated from tremor-script (such an example was
presented above too).

# Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

In this RFC, the basic mechanism as outlined can be implemented and exposed
to the user with fairly minimal changes to the script / query language required
to support an implementation.

An alternative leveraging the metadata facility and usurping the `$state`
namespace would result in marginally less implementation effort, but risks
opening up other constraints to the metadata namespace. Such changes are
user-impacting and as such not desired.

# Prior art
[prior-art]: #prior-art

None.

# Unresolved questions
[unresolved-questions]: #unresolved-questions

This RFC does not specify full internals or implementation of the state mechanism
as it applies to operators. It is assumed that a `state` variable will be available
to event handlers by the runtime that are managed by the runtime and partitioned
by operator.

This RFC limits the state that an operator can have to the `Value` type, which may
not be suitable for all our operator state needs. An example is the LRU cache
currently in use by the bucketing operator, or the desire to seed and cache a
random number generator for use in tremor-script's random module functions. For
such needs, we can continue to implement stateful implementations outside of the
pipeline state mechanism and for the cases when we do need to store them somewhere
central (eg: to enable pipeline migrations as part of clustering effort), we can
opt to serialize these data structures into (and deserialize out) of the pipeline
state. We will revisit this topic in the future when such needs arise.

# Future possibilities
[future-possibilities]: #future-possibilities

This RFC normatively reserves the `state` keyword for pipeline state
management. The internal structure (schema) of the implied state struct
is managed by this RFC. This RFC should be updated if the internal structure
(schema) of the implied state record is further specified in the future (eg:
we add an attribute to the struct to support state global to the pipeline).

Other operators that maintain state can be migrated to use the new pipeline
state mechanism (eg: for the batch or backpressure operator) -- this would
be a necissity when we want to support pipeline migration to a different tremor
node, when we have clustering for tremor.
