
# string

The string module contains functions that primarily work with strings.
## Functions
### format(format)

The placeholder {} is replaced by the arguments in the list in order.

```tremor
string::format("the {} is {}.", "meaning of life", 42)
```

would result in the string

```tremor
"the meaning of life is 42"
```

To use `{` or `}` as string literals in your format string, it needs to be
escapedby adding another parenthesis of the same type.

```tremor
string::format("{{ this is a string format in parenthesis }}")
```

this will output:

```tremor
"{ this is a string format in parenthesis }"
```

Returns a `string`

### is_empty(input)

Returns if the input string is empty or not.

Returns a `bool`

### len(input)

Returns the length of the input string (counted as utf8 characters not
bytes!).

Returns an `integer`

### bytes(input)

Returns the number of bytes composing the input string (may not be equivalent
to the number of characters!).

Returns an `integer`

### replace(input, from, to)

Replaces all occurrences of from in Input to to.

Returns a `string`

### trim(input)

Trims whitespaces both at the start and end of the input string.

Returns a `string`

### trim_start(input)

Trims whitespaces at the start of the input string.

Returns a `string`

### trim_end(input)

Trims whitespaces at the end of the input string.

Returns a `string`

### lowercase(input)

Turns all characters in the input string to lower case.

Returns a `string`

### uppercase(input)

Turns all characters in the input string to upper case.

Returns a `string`

### capitalize(input)

Turns the first character in the input string to upper case. This does not
ignore leading non letters!

Returns a `string`

### substr(input, start, end)

Get all characters from index start to end-1.

Returns a `string`

### split(input, separator)

Splits the input string at every occurrence of the separator string and turns
the result in an array.

Returns a `string`

### contains(input, string)

Returns if the input string contains another string or not.

Returns a `bool`

### from_utf8_lossy(bytes)

Turns a `binary` into a utf8 string, potentally discarding invalid codepoints

Returns a `string`

### into_binary(bytes)

Turns a `string` into it's binary representation

Returns a `binary`
