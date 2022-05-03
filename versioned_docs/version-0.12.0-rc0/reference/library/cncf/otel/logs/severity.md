
# severity

The `severity` module defines `severity_number` values
and associated utility functions

## Constants
### unspecified

*type*: U64

The severity wasn't specified

### trace

*type*: U64

Trace - default level

### trace2

*type*: U64

Trace - level 2

### trace3

*type*: U64

Trace - level 3

### trace4

*type*: U64

Trace - level 4

### debug

*type*: U64

Debug - default level

### debug2

*type*: U64

Debug - level 2

### debug3

*type*: U64

Debug - level 3

### debug4

*type*: U64

Debug - level 4

### info

*type*: U64

Informational - default level

### info2

*type*: U64

Informational - level 2

### info3

*type*: U64

Informational - level 3

### info4

*type*: U64

Informational - level 4

### warn

*type*: U64

Warning - default level

### warn2

*type*: U64

Warning - level 2

### warn3

*type*: U64

Warning - level 3

### warn4

*type*: U64

Warning - level 4

### error

*type*: U64

Non-fatal ( recoverable ) Error - default level

### error2

*type*: U64

Non-fatal ( recoverable ) Error - level 2

### error3

*type*: U64

Non-fatal ( recoverable ) Error - level 3

### error4

*type*: U64

Non-fatal ( recoverable ) Error - level 4

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
