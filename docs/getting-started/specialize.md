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

* [runtime::tremor](/docs/tremor-query/operators#script)
* [grouper::bucket](/docs/tremor-query/operators#grouperbucket)
* [generic::backpressure](/docs/tremor-query/operators#genericbackpressure)
* [generic::batch](/docs/tremor-query/operators#genericbatch)

Some debug operators also exist:

* [passthrough](/docs/tremor-query/operators#passthrough)- internal use.
* [debug::history](/docs/tremor-query/operators#debughistory)- development.
