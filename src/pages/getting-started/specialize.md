---
title: Operators
description: Operators specialise Tremor pipelines; allow for highly custom behaviour.
hide_table_of_contents: false
---

### Concept

Some behaviour is either so performance critical, or so specialised that it can't or shouldn't be expressed using  [Tremor Script](https://tremor.rs/getting-started/scripting/#h-script).

The solution to this is custom operators. Unlike Tremor Script that is interpreted at run time, they are written in [Rust](https://rust-lang.org), and can take advantage of the Rust ecosystem and natively compiled performance.

### Operators

Currently Tremor supports the following operators:

* [runtime::tremor](../../../docs/Artefacts/operators#runtimetremor)
* [grouper::bucket](../../../docs/Artefacts/operators#grouperbucket)
* [generic::backpressure](../../../docs/Artefacts/operators#generic::backpressure)
* [generic::batch](../../../docs/Artefacts/operators#generic::batch)

Some debug operators also exist:

* [passthrough](../../../docs/Artefacts/operators#passthrough)- internal use.
* [debug::history](../../../docs/Artefacts/operators#debughistory)- development.

Additional information can be found in the [docs](../../../docs/Artefacts/).
