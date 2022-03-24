
# severity

The `severity` module defines `severity_number` values
and associated utility functions

## Constants
### unspecified

*type*: I64

The severity wasn't specified

### trace

*type*: I64

Trace - default level

### trace2

*type*: I64

Trace - level 2

### trace3

*type*: I64

Trace - level 3

### trace4

*type*: I64

Trace - level 4

### debug

*type*: I64

Debug - default level

### debug2

*type*: I64

Debug - level 2

### debug3

*type*: I64

Debug - level 3

### debug4

*type*: I64

Debug - level 4

### info

*type*: I64

Informational - default level

### info2

*type*: I64

Informational - level 2

### info3

*type*: I64

Informational - level 3

### info4

*type*: I64

Informational - level 4

### warn

*type*: I64

Warning - default level

### warn2

*type*: I64

Warning - level 2

### warn3

*type*: I64

Warning - level 3

### warn4

*type*: I64

Warning - level 4

### error

*type*: I64

Non-fatal ( recoverable ) Error - default level

### error2

*type*: I64

Non-fatal ( recoverable ) Error - level 2

### error3

*type*: I64

Non-fatal ( recoverable ) Error - level 3

### error4

*type*: I64

Non-fatal ( recoverable ) Error - level 4

### fatal

*type*: I64

Fatal ( recoverable ) Error - default level

### fatal2

*type*: I64

Fatal ( recoverable ) Error - level 2

### fatal3

*type*: I64

Fatal ( recoverable ) Error - level 3

### fatal4

*type*: I64

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
