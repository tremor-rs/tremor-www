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

* [runtime::tremor](/docs/artefacts/operators#runtimetremor)
* [grouper::bucket](/docs/artefacts/operators#grouperbucket)
* [generic::backpressure](/docs/artefacts/operators#generic::backpressure)
* [generic::batch](/docs/artefacts/operators#generic::batch)

Some special Operators also exist

* [passthrough](/docs/artefacts/operators#passthrough) - internal use
* [debug::history](/docs/artefacts/operators#debughistory) - development

Additional information can be found in the [docs](/docs/artefacts/).
