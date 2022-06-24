
# severity

 The `severity` module defines `severity_number` values
 and associated utility functions

## Constants

### debug

*type*: U64

Debug - default level

### trace3

*type*: U64

Trace - level 3

### debug4

*type*: U64

Debug - level 4

### error

*type*: U64

Non-fatal ( recoverable ) Error - default level

### info

*type*: U64

Informational - default level

### info3

*type*: U64

Informational - level 3

### error3

*type*: U64

Non-fatal ( recoverable ) Error - level 3

### fatal3

*type*: U64

Fatal ( recoverable ) Error - level 3

### debug3

*type*: U64

Debug - level 3

### error4

*type*: U64

Non-fatal ( recoverable ) Error - level 4

### fatal4

*type*: U64

Fatal ( recoverable ) Error - level 4

### trace

*type*: U64

Trace - default level

### error2

*type*: U64

Non-fatal ( recoverable ) Error - level 2

### warn

*type*: U64

Warning - default level

### fatal2

*type*: U64

Fatal ( recoverable ) Error - level 2

### warn2

*type*: U64

Warning - level 2

### trace2

*type*: U64

Trace - level 2

### info4

*type*: U64

Informational - level 4

### warn3

*type*: U64

Warning - level 3

### warn4

*type*: U64

Warning - level 4

### fatal

*type*: U64

Fatal ( recoverable ) Error - default level

### unspecified

*type*: U64

The severity wasn't specified

### trace4

*type*: U64

Trace - level 4

### info2

*type*: U64

Informational - level 2

### debug2

*type*: U64

Debug - level 2
## Functions

### to_string(severity_number)

Given a `severity_number` returns its normative string representation

Returns a `string`

### indicates_error(severity_number)

Given a `severity_number` is it indicative of a non-fatal or fatal error

Returns a `bool`

### make_default()

Returns the default severity_number

The default severity_number
