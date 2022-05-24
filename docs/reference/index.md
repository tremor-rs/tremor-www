# Reference

This is Tremors reference documentation.

* [Connectors] - for Connecting Tremor to the outside world.
* [Codecs](./codecs) - for decoding raw bytes into structured events and encode them back into raw-bytes. Configured on [Connectors].
* [Extractors](./extractors) - for extracting structured data from strings.
* [Postprocessors](./postprocessors) - for postprocessing encoded binary data (e.g. for compression). Configured on [Connectors].
* [Preprocessors](./preprocessors) - for preprocessing raw binary data before it gets decoded into structured events (e.g. split by lines). Configured on [Connectors].
* [Operators](./operators) - for handling events in Tremor [Pipelines](../language/pipelines).
* [Standard Library](./stdlib) - listing functions, constants and other definitions available in the Tremor standard library. 

[Connectors]: ./connectors