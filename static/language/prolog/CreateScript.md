The `CreateScript` rule creates an operator based on a Tremor script.

A script operator is a query operation composed using the scripting language,
DSL, rather than the built-in operators provided by Tremor, written in the
Rust programming language.

The rule causes an instance of the referenced script definition to be
created and inserted into the query processing execution graph.

