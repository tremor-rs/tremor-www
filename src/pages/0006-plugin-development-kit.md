- Feature Name: plugin_development_kit
- Start Date: (fill me in with today's date, YYYY-MM-DD)
- Tremor Issue: [tremor-rs/tremor-runtime#0037](https://github.com/tremor-rs/tremor-runtime/issues/37)
- RFC PR: [tremor-rs/tremor-rfcs#0010](https://github.com/tremor-rs/tremor-rfcs/pull/0010)

# Summary
[summary]: #summary

A plugin development kit ( PDK ) enables modularization of tremor components decoupling their software development lifecycle. 

The two main requirements for the PDK are loading shared linked libraries via a standard plugin mechanism that expose the plugin artifacts and refactoring internal component registries to allow referencing plugins.

# Motivation
[motivation]: #motivation

The first benefit of a PDK is to decouple the deployment of the tremor executable and components. This enables shipping, deploying, or updating artifacts dynamically after initial deployment.

The second benefit is separating core and non-core or extended features development lifecycles. It stabilizes and standardizes how new artifacts are developed, shipped, tested, and deployed whilst normalizing packaging, operations and management.

Lastly, rust compile times are high. Partitioning out components as plugins from the core runtime allows them to be compiled separately, and only when there are significant changes, reducing build times, and offering faster development cycles whilst simultaneously reducing overall compile times. 

# Guide-level explanation
[guide-level-explanation]: #guide-level-explanation

The PDK supports plugins of the following kind:

- Onramps
- Offramps
- Codecs
- Preprocessors
- Postprocessors
- Operators
- Functions
- Extractors

The resulting plugins can be loaded into a tremor instance either at start-time or dynamically and then used in deployments.

# Reference-level explanation
[reference-level-explanation]: #reference-level-explanation

The PDK requires extending registries for various artifacts; we need to enable registering additional artefacts in addition to the supporting builtin ones. Nested namespaces may be of benefit to prevent collisions.

Plugin unloading needs careful consideration. In this revision, we are making unloading illegal to eliminate the complexity of dependency tracking and live usage tracking. Unloading a plugin in the initial implementation will require a restart of the runtime. Plugin lifecycle with support for etherealization, destruction and unloading is envisaged. A future RFC revision may replace this one for this purpose.

Developer tooling such as template projects, traits, examples, and eventually, testing frameworks to facilitate higher developer experience for plugin developers is out of scope in this revision. A future RFC should cover off plugin developer experience once the PDK and a set of plugins have been implemented as concrete needs will become clearer over time.

# Drawbacks
[drawbacks]: #drawbacks

Plugins add deployment complexity. Currently tremor is a single binary. A binary with plugins introduces versioning and dependency management complexities. For example, when to allow/disallow multiple versions in the same process.

Once the PDK is published, internal interfaces become public API surfaces. Binary compatibility, forward compatibility and separation of public from private or internal structures, types, behaviours and interfaces will be new concerns and constraints on the project.

Plugin ownership and maintenance. Aside from code-related issues, we need a process for managing officially maintained plugins and for managing the promotion, demotion/deprecation and changes to maintership or ownership. The governance of plugins will require explicit consideration with respect to standards, processes and community governance.

# Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

The simple alternative to a PDK, is to internalize every artifact explicitly. This limits scalability and effectivness and is not tenable in the medium to long term.

Another alternative is enhance tremor so that plugins can be 'soft coded' through a DSL. This may require extending existing languages, adding new DSLs and other changes to the tremor runtime. For some artifacts, such as codecs, or pre and post processors, this may be worth investigating. However, performance critical regions of the tremor runtime may limit the applicability of 'soft coded' plugins until the runtime evolves suitable APIs, facilities and development tooling.

Webassembly might be another way to get and deploy additional code to tremor without the need of linked libraries, however interaction with existing third party libraries is unresolved.

# Prior art
[prior-art]: #prior-art

- [Java package name conventions](https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html)
- [libloading rust crate for dynamic library loading](https://docs.rs/libloading/0.5.2/libloading/index.html)
- [Java WebStart](https://en.wikipedia.org/wiki/Java_Web_Start)
- [Mac OS X Universal Binaries](https://en.wikipedia.org/wiki/Universal_binary)
- [WebAssembly](https://webassembly.org/) [wasmer WebAssembly runtime](https://github.com/wasmerio/wasmer), [wasmtime WebAssembly runtime](wasmtime)

# Unresolved questions
[unresolved-questions]: #unresolved-questions

The impact of clustering on the PDK and plugin development and runtime lifecycle is unknown. As clustering support in tremor is in progress but not delivered at the time of writing, these questions are unexplored.

# Future possibilities
[future-possibilities]: #future-possibilities

Central plugin registry (eg: maven repository, cargo for crates, CPAN), cluster-aware PDK, bundles, and dependency/usage tracking, version management.
