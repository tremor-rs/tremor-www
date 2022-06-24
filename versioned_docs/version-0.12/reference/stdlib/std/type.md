
# type

 The type module contains functions that help inspecting types of values.
## Functions

### is_null(value)

Returns if the value is null.

> ```tremor
> use std::type;
> true == type::is_null(null);
> false == type::is_null(true);
> ```

Returns a `bool`

### is_binary(value)

Returns if the value is a binary.

> ```tremor
> use std::type;
> true == type::is_binary(<< 1/unsigned_integer >>);;
> false == type::is_binary(true);
> ```

Returns a `bool`

### is_array(value)

Returns if the value is an array.

> ```tremor
> use std::type;
> true == type::is_array([]);
> false == type::is_array({});
> ```

Returns a `bool`

### is_number(value)

Returns if the value is either a float or an integer.

> ```tremor
> use std::type;
> true == type::is_number(1.);
> true == type::is_number(1);
> ```

Returns a `bool`

### is_float(value)

Returns if the value is a float.

> ```tremor
> use std::type;
> true == type::is_float(1.);
> false == type::is_float(1);
> ```

Returns a `bool`

### is_bool(value)

Returns if the value is a boolean.

> ```tremor
> use std::type;
> false == type::is_bool(null);
> true == type::is_bool(false);
> ```

Returns a `bool`

### is_string(value)

Returns if the value is a string.

> ```tremor
> use std::type;
> false == type::is_string(null);
> true == type::is_string("goose");
> ```

Returns a `bool`

### is_record(value)

Returns if the value is a record.

> ```tremor
> use std::type;
> true == type::is_record({});
> false == type::is_record([]);
> ```

Returns a `bool`

### as_string(value)

Returns a string representation for the value type:

> ```tremor
> use std::type;
> "null" == type::as_string(null);
> "bool" == type::as_string(true);
> "integer" == type::as_string(1);
> "float" == type::as_string(1.e23);
> "string" == type::as_string("snot");
> "array" == type::as_string([null,true,"snot"]);
> "record" == type::as_string({"snot": [1, 1.e23, "badger"]});
> "bytes" == type::as_string(<< 1/unsigned_integer >>);
> ```

Returns a `string`

### is_integer(value)

Returns if the value is an integer.

> ```tremor
> use std::type;
> true == type::is_integer(1);
> false == type::is_integer(1.1);
> ```

Returns a `bool`
