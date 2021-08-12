+++
title = "Specialize Tremor Pipelines"
date = "2020-02-05T10:01:00+01:00"
draft = false
weight = 300
description = "Operators"
bref= "Operators allow for highly custom behaviour"
toc= true
+++

### Concept

Some behaviour is either so performance critical or so specialized that it can't or shouldn't be expressed using  [Tremor Script](https://tremor.rs/getting-started/scripting/#h-script).

The solution to this is custom operators. Unlike tremor script that is interpreted at run time they are written in [rust](https://rust-lang.org) and can take advantage of the rust ecosystem and natively compiled performance.

### Operators

Currently tremor supports the following Operators:

* [runtime::tremor](https://docs.tremor.rs/artefacts/operators#runtimetremor)
* [grouper::bucket](https://docs.tremor.rs/artefacts/operators#grouperbucket)
* [generic::backpressure](https://docs.tremor.rs/artefacts/operators#generic::backpressure)
* [generic::batch](https://docs.tremor.rs/artefacts/operators#generic::batch)

Some special Operators also exist

* [passthrough](https://docs.tremor.rs/artefacts/operators#passthrough) - internal use
* [debug::history](https://docs.tremor.rs/artefacts/operators#debughistory) - development

Additional information can be found in the [docs](https://docs.tremor.rs/artefacts/).
