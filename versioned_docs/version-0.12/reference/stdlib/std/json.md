
# json

 The json module contains functions that work with son structures.
## Functions

### encode(any)

Encodes a data structure into a json string using minimal encoding.

> ```tremor
> json::encode([1, 2, 3, 4]) = "[1,2,3,4]"
> ```

Returns a `string`

### encode_pretty(any)

Encodes a data structure into a prettified json string.

> ```tremor
> json::encode_pretty([1, 2, 3, 4]) =
> ```

Which produces:

> ```json
> "[
>  1,
>  2,
>  3,
>  4
> ]"
> ```

Returns a `string`

### decode(string)

Decodes a string containing a JSON structure.

> ```tremor
> json::decode("[1, 2, 3, 4]") => [1, 2, 3, 4]
> ```

Returns any type
