---
title: Operators
description: Operators specialise Tremor pipelines; allow for highly custom behaviour.
hide_table_of_contents: true
---

### Concept

Some behaviour is either so performance critical or so specialized that it can't or shouldn't be expressed using  [Tremor Script](https://tremor.rs/getting-started/scripting/#h-script).

The solution to this is custom operators. Unlike tremor script that is interpreted at run time they are written in [rust](https://rust-lang.org) and can take advantage of the rust ecosystem and natively compiled performance.

### Operators

Currently tremor supports the following Operators:

* [runtime::tremor](/docs/Artefacts/operators#runtimetremor)
* [grouper::bucket](/docs/Artefacts/operators#grouperbucket)
* [generic::backpressure](/docs/Artefacts/operators#generic::backpressure)
* [generic::batch](/docs/Artefacts/operators#generic::batch)

Some special Operators also exist

* [passthrough](/docs/Artefacts/operators#passthrough) - internal use
* [debug::history](/docs/Artefacts/operators#debughistory) - development

Additional information can be found in the [docs](/docs/Artefacts/).
