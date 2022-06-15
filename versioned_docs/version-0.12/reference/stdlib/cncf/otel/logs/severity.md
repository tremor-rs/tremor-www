
# severity

 The `severity` module defines `severity_number` values
 and associated utility functions

## Constants

### trace2

*type*: U64

Trace - level 2

### warn3

*type*: U64

Warning - level 3

### warn4

*type*: U64

Warning - level 4

### info

*type*: U64

Informational - default level

### info3

*type*: U64

Informational - level 3

### info2

*type*: U64

Informational - level 2

### unspecified

*type*: U64

The severity wasn't specified

### info4

*type*: U64

Informational - level 4

### warn

*type*: U64

Warning - default level

### debug3

*type*: U64

Debug - level 3

### error

*type*: U64

Non-fatal ( recoverable ) Error - default level

### error2

*type*: U64

Non-fatal ( recoverable ) Error - level 2

### warn2

*type*: U64

Warning - level 2

### trace

*type*: U64

Trace - default level

### error3

*type*: U64

Non-fatal ( recoverable ) Error - level 3

### fatal

*type*: U64

Fatal ( recoverable ) Error - default level

### fatal2

*type*: U64

Fatal ( recoverable ) Error - level 2

### fatal3

*type*: U64

Fatal ( recoverable ) Error - level 3

### fatal4

*type*: U64

Fatal ( recoverable ) Error - level 4

### debug2

*type*: U64

Debug - level 2

### debug4

*type*: U64

Debug - level 4

### trace4

*type*: U64

Trace - level 4

### debug

*type*: U64

Debug - default level

### error4

*type*: U64

Non-fatal ( recoverable ) Error - level 4

### trace3

*type*: U64

Trace - level 3
## Functions

### make_default()

Returns the default severity_number

The default severity_number

### to_string(severity_number)

Given a `severity_number` returns its normative string representation

Returns a `string`

### indicates_error(severity_number)

Given a `severity_number` is it indicative of a non-fatal or fatal error

Returns a `bool`
