
# re

 The re module contains functions for regular expression handing. Please note
 that if applicable literal regular expressions are faster.
## Functions

### is_match(regex, input)

Returns if the regex machines input.

Returns a `bool`

### replace(regex, input, to)

Replaces the first occurrence of regex in the input string with to.

References to match groups can be done using `$`` as either numbered
references like `$1` inserting the first capture or named using `$foo`
inserting the capture named foo.

Returns a `string`

### replace_all(regex, input, to)

Replaces all occurrences of regex in the input string with to.

References to match groups can be done using `$` as either numbered
references like `$1` inserting the first capture or named using `$foo`
inserting the capture named foo.

Returns a `string`

### split(regex, input)

Splits the input string using the provided regular expression regex as
separator.

> ```tremor
> re::split(" ", "this is a test") == ["this", "is", "a", "string"].
> ```

Returns a `[string]`
