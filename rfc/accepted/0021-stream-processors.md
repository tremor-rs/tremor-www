# Stream Processors

- Feature Name: stream-processors
- Start Date:  2024-07-11
- Tremor Issue: [tremor-rs/tremor-runtime#0000](https://github.com/tremor-rs/tremor-runtime/issues/0000)
- RFC PR: [tremor-rs/tremor-rfcs#0000](https://github.com/tremor-rs/tremor-rfcs/pull/0000)

## Summary
[summary]: #summary

The current limitation of processors, being able to work only on event-sized packets, is limiting. This RFC introduces a new concept of byte-stream-level processors.

To do this, we split the interceptor chain into two regions: packet and streaming regions.

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│          │       │          │       │          │◀──────┤  stream  │◀──────┤  stream  │
│          │◀──────┤          │◀──────┤          │       │processors│       │connector │
│          │       │          │       │          ├──────▶│          ├──────▶│          │
│ Pipeline │       │  codec   │       │  packet  │       └──────────┘       └──────────┘
│          │       │          │       │processors│                          ┌──────────┐
│          │       │          │       │          │──────────────────────────┤  packet  │
│          ├──────▶│          ├──────▶│          │                          │connector │
│          │       │          │       │          ├─────────────────────────▶│          │
└──────────┘       └──────────┘       └──────────┘                          └──────────┘
```

Note: Structured connectors can be ignored in this RFC as they do not allow users to define codecs or processors and are not affected by that.

### A short interlude on naming


Naming is always hard, and it often leads to the problem of overloading names—it does here, too. The reason to choose **packet processors** and **stream processors** is hopefully well-reasoned.

It adopts its name from the underlying transport technology and the terminology commonly used in algorithms.

The stream processors do not know the start and end of packages; they neither know the start of an `event` nor its length or end. This mirrors the behavior of streaming network protocols (such as TCP), streams like stdio, or Unix sockets. In addition, the continuous compression, for example, of a byte stream is commonly refered to as `streaming compression' [^1] [^2][^3].

The packet naming is less obvious. It borrows its naming from packet-based protocols, such as UDP, where the overall data is sent in individual, well-defined packages that stand on their own. Block or framed processors would be an alternative naming.

## Motivation
[motivation]: #motivation

Currently, Tremor is weak when it comes to dealing with large datablocks that need a processor applied. For example, we have implemented decompression in the file connector since to use the decompress processor, we'd need to read the entire file, then decompress it, and then keep processing it. This model is inefficient and goes against the general high-frequency streaming design of Tremor.
```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│          │       │          │       │          │       │          │       │          │       │          │       │          │
│ file_xz2 ├──────▶│ seperate ├──────▶│   json   ├─e────▶│ Pipeline ├─e────▶│   json   ├─p────▶│ seperate ├─s────▶│ file_xz2 │
│          │       │          │       │          │       │          │       │          │       │          │       │          │
└──────────┘       └──────────┘       └──────────┘       └──────────┘       └──────────┘       └──────────┘       └──────────┘
```

By introducing streaming processors, we can, for example, stream the content of a compressed file into a streaming decompressor, separate new lines, and decode each line as JSON to process it. Then, we encode it as JSON, add newline separations, compress the stream, and write it to a new file.

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│          │       │          │       │          │       │          │       │          │       │          │       │          │       │          │       │          │
│   file   ├───s──▶│decompress├───s──▶│ seperate ├─p────▶│   json   ├─e────▶│ Pipeline ├─e────▶│   json   ├─p────▶│ seperate ├─s────▶│ compress ├───s──▶│   file   │
│          │       │          │       │          │       │          │       │          │       │          │       │          │       │          │       │          │
└──────────┘       └──────────┘       └──────────┘       └──────────┘       └──────────┘       └──────────┘       └──────────┘       └──────────┘       └──────────┘
```

The advantage this brings is that with every processor we add, we enable the implemented capability. We only need to implement the stream compressor/decompressor once, and we can use it on files, stdio, TCP, aws s3, and GCP block storage. In the current model, we'd need to add the capability to every connector.

## Guide-level Explanation
[guide-level-explanation]: #guide-level-explanation


### packet processors

Packet processors take the bytes provided by the codec and transform them as a whole into a new 'packet' of bytes without breaking the association of event to package of bytes. This means package processors have a 1:1 relationship between their input and their output. The correlating output is always returned immediately; no data is buffered.

#### 'pure' packet processors

```
                   ┌────────────────────────┐
───package data───▶│ pure package processor │───package data───▶
                   └────────────────────────┘
                   ┌────────────────────────┐
◀──package data────│ pure package processor │◀──package data────
                   └────────────────────────┘
```

Pure packet processors take package data as an input and return package-shaped data as an output. An example would be the `base64` processor.

#### 'framing' packet processors

```
                  ┌─────────────────────────┐
                  │                         ├──package data─▶
───package data──▶│framing package processor│
                  │                         ├──stream data──▶
                  └─────────────────────────┘
```

Framing packet processors take package data and return new package data, but with framing information, their output can either be treated as streaming or packet data. These packet processors are required for transitioning from one model to another, but they only work in the outbound direction—they have an analougus 'framing' stream processor on the inbound side. An example here would be the `separate` processor delemiting events by newlines or the `length-prefix` processor.

### stream processors

Stream processors have no notion of events. They operate on a stream of bytes and produce a transformed stream of bytes.

#### 'pure' stream processors

```
                   ┌────────────────────────┐
────stream data───▶│ pure stream processor  │────stream data───▶
                   └────────────────────────┘
                   ┌────────────────────────┐
◀───stream data────│ pure stream processor  │◀───stream data────
                   └────────────────────────┘
```
'pure' stream processors take and produce stream data. Any boundaries between event data in the stream are ignored and likely change as data is passed through the processor. An example would be streaming zx2 compression of events into an S3 object.


#### 'framing' stream processors

```
                   ┌─────────────────────────┐
◀───package data───┤                         │
                   │framing stream processor │◀──stream data───
◀──streaming data──┤                         │
                   └─────────────────────────┘
```

Framing stream processors take streaming data and subdivide it into framed package data. The result can be treated as packet data or subdivided as stream data. This stream processor is required to transition from one model to another. Still, they only work in the inbound direction - they have an analogous 'framing' packet processor on the outbound side. An example here would be the `separate` processor splitting a stream into events delimited by newlines, or the `length-prefix` processor that reads the length of the framed event and extracts as many bytes.

### changes to codecs

To enable codecs to produce hygenic errors and avoid misconfiguration codecs need to be able to declare if they produce or accept stream or package data. Any codecs, impemented as of the writing of this RFC, purely act on packet data.

### changes to connectors

Just  as codecs, connectors need to be able to declare if they work with stream or package data, below a survey of a supset of connectors implemented today. As mentioned above, structured connectors are not affected.

| Connector |  type  |
|-----------|--------|
| tcp       | stream |
| udp       | packet |
| stdio     | stream |
| sockets   | stream |
| kafka     | packet |
| ws        | packet |
| s3        | stream/packet |
| gcs       | stream/packet |
| file      | stream/packet |

Stream/packet: While those connectors produce a stream, it is finite. It has a well-known, definite end close end. They are noteworthy because we might need a `collect stream` processors that collect the entire stream content into a single packet (for example to read a prettified json config file). An alternative would be for those connectors to define their reading mode which might make more sense then to generalize it as they are well bounded to 'file like connectors'.


### Errors & UX

With this implemented, we can check at compile time:
- that a connector with a stream/packet interface gets data that is the right shape
- that we do not pass data of incompatible shapes between connectors

We also ensure
- that framing/deframing is handled with thought 
- implications of packet and streaming connectors become more evident in configuration

## Reference-level Explanation
[reference-level-explanation]: #reference-level-explanation


We implement:
- input/output types for processors
- input/output types for connectors
- input/output types for codecs
- checks for incompatible type chains
- add potentially new processors if  the opportunity arises
  - streaming compression
  - streaming-encryption
  - new framing tools?
- remove potentially no longer needed processors if  the opportunity arises
  - chunk
  - collect


## Drawbacks
[drawbacks]: #drawbacks

The drawback here is that any added concepts also add complexity. However, this should be outweighed by removing some existing limitations, confusion, and unexpected behavior of the current model. Since, at the core, this is a UX project (it adds typing to processors), it has few other drawbacks.

## Rationale and Alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

- we don't do streaming processors

## Prior Art
[prior-art]: #prior-art

Inspirations come from the OSI model along with the interceptor concept.

## Unresolved Questions
[unresolved-questions]: #unresolved-questions

Naming is a big one.

## Future Possibilities
[future-possibilities]: #future-possibilities

This RFC is relatively self-contained and complete.

[^1]: https://facebook.github.io/zstd/zstd_manual.html#Chapter7
[^2]: https://fuchsia.googlesource.com/third_party/lz4/+/refs/tags/v1.8.3/examples/streaming_api_basics.md
[^3]: https://jpf91.github.io/lzmad/api/lzma_stream_flags.html
