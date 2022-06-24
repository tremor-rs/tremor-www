
# math

 The math module contains functions for common mathematical operations.
## Functions

### max(n1, n2)

Returns the maximum of two numbers.

> ```tremor
> math::max(41, 42) == 42
> ```

Returns a `number` (`integer` or `float`)

### ceil(n)

Returns the largest `integer` value greater than or equal to n.

> ```tremor
> math::ceil(41.1) == 42
> ```

Returns an `integer`

### trunc(n)

Returns the `integer` part of `n`.

> ```tremor
> math::trunc(41.4) == 41
> math::trunc(41.5) == 41
> ```

Returns an `integer`

### floor(n)

Returns the smallest integer value less than or equal to n.

> ```tremor
> math::floor(42.9) == 42
> ```

Returns an `integer`

### min(n1, n2)

Returns the minimum of two numbers.

> ```tremor
> math::min(41, 42) == 41
> ```

Returns a `number` (`integer` or `float`)

### round(n)

Returns the `integer` nearest to.

> ```tremor
> math::round(41.4) == 41
> math::round(41.5) == 42
> ```

Returns an `integer`
