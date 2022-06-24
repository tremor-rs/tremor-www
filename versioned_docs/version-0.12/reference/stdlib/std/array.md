
# array

 The array module contains functions to work for arrays.
## Functions

### zip(left, right)

Zips two arrays, returning a new array of tuples for the first element
being part of the left array and the second element part of the right
array.

**Note**: left and right need to have the same length.

> ```tremor
> let left = [1, 2, 3];
> let right = ["a", "b", "c"];
> array::zip(left, right) == [[1, "a"], [2, "b"], [3, "c"]]
> ```

Returns an `array`.

### concatenate(left, right)

Concatenates two arrays returning a new array. The new array is not a set,
i.e. it can contain duplicates depending on the input arrays.

> ```tremor
> array::concatenate([1, 2, 3], [3, 4]) == [1, 2, 3, 3, 4]
> ```

Returns an `array`

### flatten(array)

Flattens a nested array recursively.

> ```tremor
> array::flatten([[1, 2, 3], ["a", "b", "c"]]) = [1, 2, 3, "a", "b", "c"]
> ```

Returns an `array`.

### push(array, element)

Adds an `element` to the end of `array`.

Returns an `array`.

### is_empty(array)

Returns if `array` is empty.

Returns an `bool`.

### unzip(array)

Unzips an array of tuples into an array of two arrays.

**Note**: array's elements need to be arrays of two elements.

> ```tremor
> array::unzip([[1, "a"], [2, "b"], [3, "c"]]) ==  [[1, 2, 3], ["a", "b", "c"]]
> ```

Returns an `array`.

### sort(left, right)

Sorts an array

> ```tremor
> array::concatenate([3, 2, 3, 1, 4]) == [1, 2, 3, 3, 4]
> ```

Returns an `array`

### len(array)

Returns the length of `array`.

Returns an `integer`.

### coalesce(array)

Returns the array for null values removed.

> ```tremor
> array::coalesce([1, null, 2, null, 3]) = [1, 2, 3]
> ```

Returns an `array`.

### join(array, string)

Joins the elements of an array (turing them into Strings) for a given
separator.

> ```tremor
> array:join(["this", "is", "a", "cake"], " ") => "this is a cake"
> ```

Returns a `string`.

### contains(array, element)

Returns if `array` contains an `element`.

Returns an `bool`.
