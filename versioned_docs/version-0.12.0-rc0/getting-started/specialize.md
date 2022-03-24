# Specialize

Some behaviour is either so performance critical, or so specialised that it can't or shouldn't be expressed using  [Tremor Script](https://tremor.rs/docs/next/getting-started/scripting/#h-script).

The solution to this is custom operators. Unlike Tremor Script that is interpreted at run time, they are written in [Rust](https://rust-lang.org), and can take advantage of the Rust ecosystem and natively compiled performance.

### Operators

Currently Tremor supports the following operators:

* [runtime::tremor](/docs/queries/operators#script)
* [grouper::bucket](/docs/queries/operators#grouperbucket)
* [generic::backpressure](/docs/queries/operators#genericbackpressure)
* [generic::batch](/docs/queries/operators#genericbatch)

Some debug operators also exist:

* [passthrough](/docs/queries/operators#passthrough)- internal use.
* [debug::history](/docs/queries/operators#debughistory)- development.
