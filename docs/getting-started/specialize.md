---
title: Operators
description: Operators specialise Tremor pipelines; allow for highly custom behaviour.
hide_table_of_contents: false
---

### Concept

Some behaviour is either so performance critical, or so specialised that it can't or shouldn't be expressed using  [Tremor Script](https://tremor.rs/docs/next/getting-started/scripting/#h-script).

The solution to this is custom operators. Unlike Tremor Script that is interpreted at run time, they are written in [Rust](https://rust-lang.org), and can take advantage of the Rust ecosystem and natively compiled performance.

### Operators

Currently Tremor supports the following operators:

* [runtime::tremor](/docs/artefacts/operators#runtimetremor)
* [grouper::bucket](/docs/artefacts/operators#grouperbucket)
* [generic::backpressure](/docs/artefacts/operators#generic::backpressure)
* [generic::batch](/docs/artefacts/operators#generic::batch)

Some debug operators also exist:

* [passthrough](/docs/artefacts/operators#passthrough)- internal use.
* [debug::history](/docs/artefacts/operators#debughistory)- development.

Additional information can be found in the [docs](/docs/artefacts/).
