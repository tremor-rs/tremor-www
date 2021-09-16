
# array

The array module contains functions to work for arrays.
## Functions
### len(array)

Returns the length of `array`.

Returns an `integer`.

### is_empty(array)

Returns if `array` is empty.

Returns an `bool`.

### contains(array, element)

Returns if `array` contains an `element`.

Returns an `bool`.

### push(array, element)

Adds an `element` to the end of `array`.

Returns an `array`.

### zip(left, right)

Zips two arrays, returning a new array of tuples for the first element
being part of the left array and the second element part of the right
array.

**Note**: left and right need to have the same length.

```tremor
let left = [1, 2, 3];
let right = ["a", "b", "c"];
array::zip(left, right) == [[1, "a"], [2, "b"], [3, "c"]]
```

Returns an `array`.

### unzip(array)

Unzips an array of tuples into an array of two arrays.

**Note**: array's elements need to be arrays of two elements.

```tremor
array::unzip([[1, "a"], [2, "b"], [3, "c"]]) ==  [[1, 2, 3], ["a", "b", "c"]]
```

Returns an `array`.

### flatten(array)

Flattens a nested array recursively.

```tremor
array::flatten([[1, 2, 3], ["a", "b", "c"]]) = [1, 2, 3, "a", "b", "c"]
```

Returns an `array`.

### coalesce(array)

Returns the array for null values removed.

```tremor
array::coalesce([1, null, 2, null, 3]) = [1, 2, 3]
```

Returns an `array`.

### join(array, string)

Joins the elements of an array (turing them into Strings) for a given
separator.

```tremor
array:join(["this", "is", "a", "cake"], " ") => "this is a cake"
```

Returns a `string`.
