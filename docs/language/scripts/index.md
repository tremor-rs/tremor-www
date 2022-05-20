# Scripts

Tremors scripting language is an interpreted expression-oriented language designed for the filtering, extraction, transformation and streaming of structured data in a stream or event-based processing system.

At its core, the language supports a structured type system equivalent to JSON. It supports integer, floating point, boolean and UTF-8 encoded string literals, literal arrays and associative dictionaries or record types in addition to a `null` marker.

A well-formed JSON document is a legal literal expression.

## Principles

### Safety

The language is explicitly not Turing-complete:

- there are no unstructured `goto` grammar forms
- there are no unbounded `for`, `while` or `do..while` looping constructs
- the language is built on top of rust, inheriting its robustness and safety features, without the development overheads

### Developer friendly

The language adopts a Fortran-like syntax for key expression forms and has a path-like syntax for indexing into records and arrays

### Stream-oriented / event-based

Tremor-script is designed to process unstructured ( but well-formed ) data events. Event data can be JSON, MsgPack or any other form supported by the tremor event processing system.

### Self-documenting

The fortran-like syntax allows rich operations to be computed against arbitrary JSON-like data. For example JSON documents can be `patch`ed and `merge`ed with operation and document based templates. Records and Arrays can be iterated over to transform them, merge them with other documents or to extract subsets for further processing

### Extensibility

The expression-based nature of `tremor-script` means that computational forms and any processing is transient. The language describes a set of rules ( expressions ) that process an inbound event document into an outbound documented emitted after evaluation of the script.

The core expression language is designed for reuse in other script-based DSLs and can currently be extended through its modular function subsystem.

The language also supports a pluggable data extraction model allowing base64 encoded, regular expressions and other micro-formats encoded within record fields to be referenced based on their internal structure and for subsets to be mapped accordingly.

In the future, `tremor-script` may be retargeted as a JIT-compiled language.

### Performant

Data ingested into tremor-script is vectorized via SIMD-parallel instructions on x86-64 or other Intel processor architectures supporting ssev3/avx extensions. Processing streams of such event-data incurs some allocation overhead at this time, but these event-bound allocations are being written out of the interpreter.

The current meaning of `performant` as documented here means that `tremor-script` is more efficient at processing log-like data than the system it replaces ( logstash - which mixes extraction plugins such as `grok` and `dissect` with JRuby scripts and a terse configuration format )

### Productive

The `tremor-script` parsing tool-chain has been designed with ease-of-debugging and ease-of-development in mind. It has builtin support for syntax-highlighting on the console with errors annotating highlighted sections of badly written
scripts to simplify fixing such scripts.

## Language

This section details the major components of the `tremor-script` language

