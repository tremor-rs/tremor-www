# Features Overview

In this section we overview the features of the tremor domain specific languages.

## Scripting

### How do I extract content embedded in values?

Tremor supports extracting well-formed unstructured data from events streaming
through the runtime through the `extractor` language feature.

An extractor performs two basic operations:
* It performs a predicate test to see if the content being referenced conforms to
  the microformat specified.
* If the test passes, the content is extracted and passed to the runtime for processing.

Check out the [extractors overview](extractors/overview) for a walkthrough of the language feature.

### Can i write user defined functions?

Tremor supports functional programming with a depth-limited tail recursive
implementation that supports imperative style or `standard` function signatures
and pattern matching based function signatures that is more similar to erlang
style functions.


Check out the [functions overview](functions/overview) for a walkthrough of the language feature.

