- Feature Name: rfc_0003_linked_transports
- Start Date: 2020-01-27
- Issue: [tremor-rs/tremor-rfcs#0005](https://github.com/tremor-rs/tremor-rfcs/issues/5)
- RFC PR: [tremor-rs/tremor-rfcs#0006](https://github.com/tremor-rs/tremor-rfcs/pull/6)

# Summary
[summary]: #summary

The tremor-runtime supports ingress from and egress to external data sources and
sinks through adapters called `Onramps` and `Offramps` accordingly.

There is no mechanism currently that allows the underlying transport encapsulated
by `Onramps` or `Offramps` to share their respective underlying connections.

This RFC addresses these limitations by introducing `linked transports` notionally
and allowing `Onramp` and `Offramp` specifications to reference a common shared
underlying transport instance by reference.

# Motivation
[motivation]: #motivation

The absence of linked transports prohibits authors of tremor-script / tremor-query
from writing proxy applications where request/response style interactions can be
routed from a client request back to a client response in the same synchronous blocking
RPC transport connection context back to the originating ephemeral client.

This limitation also requires having multiple messaging endpoint connections
for asynchronous communications when a single connection may be sufficient.

# Guide-level explanation
[guide-level-explanation]: #guide-level-explanation

Given a linked transport configuration:

```yaml
transport:
  - id: rest
    codec: json
    config:
      port: 8080
      listen:
          - 0.0.0.0
      headers:
        'Content-type': 'application/json'
      methods:
        '/api/{id}': [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE' ]
```

An onramp referencing the transport:

```yaml
onramp:
  - id: rest_inbound
    ref: rest
```

An offramp referencing the same transport:

```yaml
offramp:
  - id: rest_outbound
    ref: rest
```

Then, user defined logic in the script or query language can fully proxy or
implement services for the underlying transport:

```tremor
match event of
  case %{ path == "/api/{id}", method == "GET" } => { "id": "{event.params.id}", "status": 200 },
  case %{ path == "/api/{id}", method == "POST" } => { "id": "{event.params.id}", "status": 201 },
  case %{ path == "/api/{id}", method == "PUT" } => { "id": "{event.params.id}", "status": 200 },
  case %{ path == "/api/{id}", method == "PATCH" } => { "id": "{event.params.id}", "status": 200 },
  case %{ path == "/api/{id}", method == "DELETE" } => { "id": "{event.params.id}", "status": 204 },
  default => { "error": "Service unavailable", "status": 503 }
end
```

The binding specification:

```yaml
binding:
  - id: api_gateway
    links:
      '/onramp/rest_inbound/{instance}/out': [ '/pipeline/api/{instance}/in' ]
      '/pipeline/api/{instance}/out': [ '/offramp/rest_outbound/{instance}/in'  ]
```

There is no facility in the current tremor-runtime to describe transport services that
effectively implement or proxy an underlying protocol fully as there is no mechanism
to intercept a request, process it through a pipeline, and route the response such that
it consummates a single transport level request/response or messaging interaction.

A shared transport fills this gap and allows the tremor-runtime to implement API gateways,
to act as a HTTP router, proxy, reverse proxy and to implement similar capabilities for
other transports.


# Reference-level explanation
[reference-level-explanation]: #reference-level-explanation

None.

# Drawbacks
[drawbacks]: #drawbacks

None.

# Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

The introduction of transports coupled with adding optional transport references
to onramp and offramp specifications enables the tremor-runtime to act as a
proxy or reverse proxy endpoint with logic implemented in the scripting or
query language.

# Prior art
[prior-art]: #prior-art

None.

# Unresolved questions
[unresolved-questions]: #unresolved-questions

This RFC does not specify internals or implementation which is left to the
implementor. The motiviating example should be sufficient to drive a suitable
implementation.

# Future possibilities
[future-possibilities]: #future-possibilities

None known at this time.
