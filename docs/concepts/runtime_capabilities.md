---
draft: true
---

# Runtime Capabilities
## Circuit Breaking

Tremors runtime was built to enable traffic shaping and improving quality of service for high volumetric data streams. It was built with very real possibility of failure in mind. In a system of many connected computers, either any coputer or the network could fail in arbitrarily scary and harmful ways. Tremor, as the safeguard of downstream systems, the harbinger of quality of service, needs to be a good citizen and stop pounding downstream systems that are already known to be out of service.

To that end, the contraflow mechanism was built to allow signals to be propagated back along the [Pipeline graph](../language/pipelines.md) to all upstream [Connectors].

TBD

## Garuanteed Delivery

TBD

## Pause / Resume

TBD

## Quiescence

TBD

[Connectors]: ../reference/connectors/index.md