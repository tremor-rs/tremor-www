
# type

The type module contains functions that help inspecting types of values.
## Functions
### as_string(value)

Returns a string representation for the value type:

* "null"
* "bool"
* "integer"
* "float"
* "string"
* "array"
* "record"

Returns a `string`

### is_null(value)

Returns if the value is null.

Returns a `bool`

### is_bool(value)

Returns if the value is a boolean.

Returns a `bool`

### is_integer(value)

Returns if the value is an integer.

Returns a `bool`

### is_float(value)

Returns if the value is a float.

Returns a `bool`

### is_number(value)

Returns if the value is either a float or an integer.

Returns a `bool`

### is_string(value)

Returns if the value is a string.

Returns a `bool`

### is_array(value)

Returns if the value is an array.

Returns a `bool`

### is_record(value)

Returns if the value is a record.

Returns a `bool`

### is_binary(value)

Returns if the value is a binary.

Returns a `bool`
