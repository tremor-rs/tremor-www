
# span_id

Span Identifiers


## Functions
### is_valid(span_id)

Is the `span_id` valid

Checks the `span_id` argument to see if it is a valid
span id. A legal span id is one of:

* An array of integers in the range of [0..=255] of length 8
* A binary 8 byte value
* An array of 8 int values
* A 16-byte hex-encoded string
* Regardless of representation, the value must not be all zeroes

Returns a record when the representation is well-formed of the form:

```tremor
{
"kind": "string"|"binary"|"array", # Depends on input
"valid": true|false,               # True if well-formed and valid
"value": "<span_id>"               # Representation depends on `kind`
}
```

Returns an empty record `{}` when the representation not well-formed

