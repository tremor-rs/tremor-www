
# system

 The system namespace contains functions that provide information about the
 tremor runtime system.
## Functions

### ingest_ns()

Returns the ingest time into tremor of the current event.

> ```tremor
> use tremor::system;
> let ingest_ns = system::ingest_ns();
> ```

Returns an `int`

### hostname()

Returns the name of the host where tremor is running.

> ```tremor
> use tremor::system;
> let hostname = system::hostname();
> ```

Returns a `string`

### version()

Returns the tremor version as a string

> ```tremor
> use tremor::system;
> let version = system::version();
> ```

Returns a `string`

### nanotime()

Returns the current time in epoch nanoseconds

> ```tremor
> use tremor::system;
> let now = system::nanotime();
> true == system::nanotime() >= now
> ```

Returns an `int`

### instance()

Returns the instance name of this tremor process.

> ```tremor
> use tremor::system;
> match system::instance() of
>   case "tremor" => "default"
>   # Instance names can be customized by users
>   # TREMOR_PATH=/path/to/lib tremor -i "bob" ...
>   default => "changed by user"
> end
> ```

Returns a `string`
