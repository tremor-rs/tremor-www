
# nanos

 Utilities for dealing with nanoseconds
## Constants

### NANOS_PER_MICROSECOND

*type*: U64

The amount of nanoseconds in a microsecond

### NANOS_PER_HOUR

*type*: U64

The amount of nanoseconds in an hour

### NANOS_PER_DAY

*type*: U64

The amount of nanoseconds in a day

### NANOS_PER_MILLISECOND

*type*: U64

The amount of nanoseconds in a millisecond

### NANOS_PER_WEEK

*type*: U64

The amount of nanoseconds in a week

### NANOS_PER_SECOND

*type*: U64

The amount of nanoseconds in a second

### NANOS_PER_MINUTE

*type*: U64

The amount of nanoseconds in a minute
## Functions

### to_days(nanos)

Convert the given nanoseconds to days

Returns an integer

### to_hours(nanos)

Convert the given nanoseconds to hours

Returns an integer

### to_micros(nanos)

Convert the given nanoseconds to microseconds

Returns an integer

### to_minutes(nanos)

Convert the given nanoseconds to minutes

Returns an integer

### to_seconds(nanos)

Convert the given nanoseconds to seconds

Returns an integer

### from_hours(hours)

convert the given hours to nanoseconds

> ```tremor
> use std::time::nanos;
> nanos::from_hours(1) # 3600000000000
> ```

Returns an integer

### to_weeks(nanos)

Convert the given nanoseconds to weeks

Returns an integer

### from_weeks(weeks)

convert the given weeks to nanoseconds

> ```tremor
> use std::time::nanos;
> nanos::from_weeks(1) # 604800000000000
> ```

Returns an integer

### from_days(days)

convert the given days to nanoseconds

> ```tremor
> use std::time::nanos;
> nanos::from_days(1) # 86400000000000
> ```

Returns an integer

### from_micros(micros)

Convert the given microseconds to nanoseconds

> ```tremor
> use std::time::nanos;
> nanos::from_micros(1) # 1000
> ```

Returns an integer

### to_millis(nanos)

Convert the given nanoseconds to milliseconds

Returns an integer

### from_millis(millis)

Convert the given milliseconds to nanoseconds

> ```tremor
> use std::time::nanos;
> nanos::from_millis(1) # 1000000
> ```

Returns an integer

### from_minutes(minutes)

convert the given minutes to nanoseconds

> ```tremor
> use std::time::nanos;
> nanos::from_minutes(1) # 60000000000
> ```

Returns an integer

### from_seconds(secs)

Convert the given seconds to nanoseconds

> ```tremor
> use std::time::nanos;
> nanos::from_seconds(1) # 1000000000
> ```

Returns an integer
