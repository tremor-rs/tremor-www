- Feature Name: `correlation_linked_transport`
- Start Date: 2021-03-12
- Tremor Issue: [tremor-rs/tremor-runtime#0000](https://github.com/tremor-rs/tremor-runtime/issues/0000)
- RFC PR: [tremor-rs/tremor-rfcs#0000](https://github.com/tremor-rs/tremor-rfcs/pull/0000)

# Summary
[summary]: #summary

Linked Transports enable integrating request-response based communications with tremor event-streams. Events coming from pipelines can be turned into requests and responses are turned into events and sent on to other pipelines.
Nonetheless we currently can't correlate them, that is have request event data present in the context of the response event handling. This RFC is suggesting new means for convenient correlating of events,
i.e. the special `$correlation` metadata key.

# Motivation
[motivation]: #motivation

When we introduced [Linked Transport](0003-linked-transports.md) we enabled request-response communication patterns with the outside world, like HTTP or some Websocket protocols. Right now request and response handling need to either be done in two different pipelines or in the same and be dispatched within the trickle/tremor-script logic. If any part of the request event needs to be around for response handling, the only option is to handle both in 1 pipeline and use the `state` mechanism to store and retrieve the request event data upon response handling.

We are currently adding some correlation data e.g. for the `elastic` offramp, where we store the whole origin `event_id`, `origin_uri` and the `payload` of the document indexed. Or the `rest` offramp, where we include the HTTP request metadata into the response event. Those are in no means complete in that we can only correlate metadata that is also being sent to as the event itself (HTTP headers, elastic document payload). We want the correlation mechanism to be more flexible and to not affect the actual event payload or outgoing protocol unit. Correlation should be an internal mechanism to your tremor application logic.

# Guide-level explanation
[guide-level-explanation]: #guide-level-explanation

Every Linked Transport onramp or offramp will for every incoming event take the `Value` at the metadata key `$correlation`, if any and inject it into the response event metadata under the same key.

This way users can pass correlation data from request to response without the need to manipulate the event payload and thus the application data to be sent out. Also we only need to keep as much correlation data around as we have in-flight events and most of all we don't require users to write complex and error-prone correlation logic in tremor-script, which will blow up code bases, possibly beyond reasonable maintainability.

Usage example using the `rest` offramp:

Here we have the request handling pipeline, that moves some event field into the special `$correlation` metadata field.

```trickle
# request handling
define script extract_correlation_id
script
    # extract application key and put it into correlation
    let $correlation = $request.headers["X-Application-Key"] ;
    event
end;

select event from in into extract_correlation_id;
select event from extract_correlation_id/out into out;
select event from extract_correlation_id/err into err;
```

 This is the response handling pipeline which uses the `$correlation` metadata field in further event processing:

```trickle
# response handling
define script correlation
script
    # preparation for sending this response further down the road via another rest offramp
    let $request.headers["X-Application-Key"] = $correlation;
    let $request.endpoint = "http://example.org/application";
    event
end;

select event from in into correlation;
select event from correlation/out into out;
select event from correlation/err into err;
```

For cases where the event payload should remain unaffected

# Reference-level explanation
[reference-level-explanation]: #reference-level-explanation

As for the implementation, every linked transport needs to be touched and needs to keep around the correlation `Value`s for each in-flight event and inject it into the response event.

This also includes cleaning up the correlation state in case of errors of the external systems, in case of timeouts and the like, so we ensure that we never grow beyond the bounds of the configured concurrency.

We need to take care that no offramp/onramp uses that field for its own metadata.

# Drawbacks
[drawbacks]: #drawbacks

The state we need to keep at the Linked Transport offramp/onramp will grow with the supported concurrency (in-flight requests).

Implementing this will further complicate the already quite complex Linked Transport implementations. Maybe we should consider implementing this as part of the [Connectors RFC](https://github.com/tremor-rs/tremor-rfcs/pull/32).

# Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

In the initial ideas for this RFC we came up with a `correlate` operator for "joining" a number of events based on some expression, say `$correlation`. This was equipped with a `timeout`, so we take care to not keep to much state around and put a limit to the correlation window.

I decided against coding this as an operator as it can be implemented with core language features of `tremor-query`, with a size based tumbling window and a group_by:

```
define tumbling window size_2
with
  size = 2,
  eviction_period = 1000
end;

select aggr::win::collect_flattened(event) from in[size_2] group by $correlation into out;
```

To get exactly the same timeout behaviour the operator would have, we might need to tweak the current `eviction_period` handling logic, as it currently only gets rid of groups after `2 x eviction_period`. But as the operator can only live in 1 pipeline, we need to pass both events through the same pipeline anyways, and the above code is much more idiomatic and feels more native and less cumbersome.

This pattern for correlation will find its way into the docs.

# Prior art
[prior-art]: #prior-art

Correlating events is a key mechanism for enabling event tracing, which is usually achieved by adding trace ids to events. This is how e.g. [zipkin](https://zipkin.io) tracing works. So there is a whole ecosystem around enabling observability with proper tracing that relies on those ids being present and be delivered and maintained across boundaries. While most applications will already include a trace id like this in the event payload, it might still be required to enable keeping those ids while accessing external services via a linked transport. So this enables better tracing scenarios for Tremor.

# Unresolved questions
[unresolved-questions]: #unresolved-questions

None.

# Future possibilities
[future-possibilities]: #future-possibilities

One road to take this RFC idea down is to bake the correlation and event tracing mechanism even deeper into the runtime.
What we have now with the internal `EventId` is some form of limited tracing in that it tracks the minimum and maximum of event ids per source.
We could extend this to build causal tracing chains. This is necessary, as at places like a windowed select query, a `generic::batch` operator we emit new events, with a new id. They do keep track of the events that make up the current one, but we cannot properly trace every single event with this mechanism. Such a tracing chain would be usable for the correlation feature, if made accessible to user pipeline code.
