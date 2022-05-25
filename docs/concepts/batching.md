# Batching

Batching is a complex topic. It happens in many layers, and it's easy to confuse one with another. This makes it especially important to explain the concepts of batching the tremor engine uses.

In general, tremor is not a batching or micro batching engine. Every event is handled as it happens, when it happens, without combining it with outer events.

When we refer to batching, we refer to an event that comes out of the [batch operator](../reference/operators/batch.md). These events are special as they create a batch but retain information about the unique events in them. The engine has specific methods of handing them and some connectors to treat it differently - more to that later.

To explain how batching can come into play, let's look at the different parts of the engine.

## Inbound messages (Connectors)

Generally, tremor does not batch for inbound events. There are cases where the connector receives batched messages. There are two ways the tremor handles this, depending on the connector.

### Transparent unbatching

Some connectors use batching as a way of transport optimization, where the server sends many events in a single network package to reduce cost. The [kafka](../reference/connectors/kafka.md) connector would be an example of this. Here the batching behavior is transparent to tremors and users. Each event in the batch will be treated as if the batch didn't exist.

### Userland unbatching

Sometimes batching happens in userland, or the connector is not aware of it as it isn't an inherent part of the transport or protocol but rather something that was built on top of it. In these cases, tremor will treat the entire batch as a single event, and it's up to the user to implement this userland de-batching.

Sending several logs in a single UDP message would be an excellent example. From tremor's perspective, it is one message, so one event. Tremor can't know that, in this instance, the content of the message would reflect multiple events without being told. 

To bridge this, we offer the concept of [preprocessors](../reference/preprocessors/index.md), which allows taking a large message and splitting it into smaller ones. The most common one used is the [separate](../reference/preprocessors/separate.md), which allows separating the input given a specific byte (by default, the newline).

## Pipelines

In pipelines, we have multiple ways of turning a single event into many events (unlatching) or turning many events into a single one (batching). Again, we have the difference between a userland method and an engine-aware method.

### The batch operator

The batch operator is a very powerful operator that allows for performance optimizing downstream connections. For details on how to configure it please look at [it's documentation](../reference/operators/batch.md).

It generates a new event from several existing events, combining them so that the engine is aware this is a batch and can be handled transparently for the downstream connector in a way that's appropriate for the system it connects to.

### windows and aggregates

You can find more details on how aggregation is implemented in tremor in the [aggregation section](./aggregation.md) of the concepts. 

What windows and aggregates allow is to combine multiple events into a single event given user land logic. This means batches can be pretty cheap and fairly flexibly created. However, since the shape of these batches is opaque to the engine, the resulting event isn't considered a "batched" event. It's regarded as a regular event, so connectors will treat it like any other event.

### the script operator

Scripts allow for batching as they support complete and stateful control over events. For logic that goes beyond what a select and aggregate can do, they give complete control over how multiple events are combined into a single one. This is a lot more powerful than aggregates with a window, but it trades this for being more resource-intensive.

This is opaque to the engine like aggregates and windows, and the result is treated as a singular event.

### select and group by each

`select` and `group by each(...)` can be used to un-batch an event because it takes a singular event that in some shape can be turned into an array and processes separately after this. It is to preprocessors what scripts are to aggregates. It's more powerful but also more expensive.

## Outbound messages (Connectors)

The batching behavior of outbound connectors mostly mirrors the behavior of inbound connectors.

### Batched events

When an event arrives as a batched event, meaning it was generated using the [batch operator](../reference/operators/batch.md), the connector will treat it in a way that is most sensitive to the transport and the downstream application (if known).

So, for example, the [elastic](../reference/connectors/elastic.md) connector that receives a batched event will combine all included events into a batched request. We can do this since, for this specialty connector, tremor can be aware of the application layer contract.

On the other hand, in a system like [kafka](../reference/connectors/kafka.md), a batched event will be unrolled, and each included event will be sent as its own message.

Connectors like [http](../reference/connectors/http.md) form the middle ground. For batched events, they will concatenate the encoded events and send them in one message. This behavior can be influenced by [postprocessors](../reference/postprocessors/index.md) that allow modifying the data before it's being concatenated. An excellent example of this would be the [separate](../reference/postprocessors/separate.md) postprocessors that insert a separator between each batch event.

### userland batched events

Events batched using `select` or the `script` operator will always be treated as a singular event. It is up to the user to bring it in a form that is understood by the other sites' application layer.
