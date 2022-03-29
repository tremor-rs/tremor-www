
# range

The range module contains functions for common range generator operations.
## Functions
### range(a, b)

Returns an array from a min-inclusive to b max-inclusive.

```tremor
range::range(0, 3) == [0, 1, 2]
```

Returns `[integer]`

### contains(r, n)

Checks if an element is within a range.

```tremor
range::contains(range::range(0, 3), 2) == true
```

Returns `[integer]`
