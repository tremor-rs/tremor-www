# json-sorted

The `json-sorted` codec supports the Javascript Object Notation format with a consistent sort order.

Specification: [JSON](https://json.org).

Deserialization supports minified and fat JSON. Duplicate keys are not preserved, the last key overwrites previous ones.

Serialization supports minified JSON only.

