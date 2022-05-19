---
sidebar_position: 1
---

# Event Flows

This section tries to answer the question of how to get your events flow through Tremor, and convey the concepts to help understand how Tremor works and how to make it do what your want.

Whatever your actual use-case for trying out Tremor is, it nearly always boils down to getting events into Tremor, processing them and getting them out again, in the same way as all computer programs are *just* input, computation and finally (hopefully) output. So lets focus on this overly simplifying abstraction.

When the Tremor process starts it expects one or more [`.troy`](../language/troy.md) files as arguments. Each of these files defines how events should flow into, through and finally out of Tremor. There can be multiple different flows deployed to a Tremor process at the same time, no big deal. A [Flow](../language/troy.md#flow) is a distinct unit that can be deployed on its own. It encapsulates the definition of where to take events from and where to send them to in the form of [Connectors](../reference/connectors) and the definition of how to handle them in between in the form of Pipelines. And most importantly it defines who those are connected to allow events to flow through them.

Lets untangle all those

