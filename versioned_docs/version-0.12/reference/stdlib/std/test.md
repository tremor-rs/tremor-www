
# test

 The `test` module is used for writing tremor unit tests.
## Functions

### test()

The `test` function is an entrypoint into tremor's
integrated unit testing framework


### assert(name, expected, got)

Runs an assertion for a test, ensures that `expected` and `got` are the
same. If not errors.

**WARNING**: Do not run assertions in production code!

> ```tremor
> assert("one equals one", 1, 1) == true; # suces
> assert("one equals one", 1, 2); # errors
> ```

Returns an `bool`.

### suite()

The `suite` function is an entrypoint into tremor's
integrated unit testing framework

