
# trace_id

Trace Identifiers


## Functions
### is_valid(trace_id)

Is the `trace_id` valid

Checks the `trace_id` argument to see if it is a valid
trace id. A legal trace id is one of:

* An array of integers in the range of [0..=255] of length 8
* A binary 16 byte value
* A 32-byte hex-encoded string
* An array of 16 int values
* Regardless of representation, the value must not be all zeroes

Returns a record when the representation is well-formed of the form:

```tremor
{
"kind": "string"|"binary"|"array", # Depends on input
"valid": true|false,               # True if well-formed and valid
"value": "<trace_id>"              # Representation depends on `kind`
}
```

Returns an empty record `{}` when the representation not well-formed

