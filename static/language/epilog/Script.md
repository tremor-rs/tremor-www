### Type System

Tremor supports a data-oriented or value-based type system with a syntax
that is backward compatible with JSON.

Any well-formed and legal JSON document is a valid literal in Tremor.

Tremor literals for `null`, `boolean`, `string` (utf-8), integer (64-bit unsigned), float (64-bit IEEE), arrays and records are equivalent to their JSON counterparts.

Tremor also supports a binary literal for transporting and processing opaque binary data.

### Asymmetric

JSON literals are valid Tremor value literals.

However, Tremor literals MAY NOT always be valid in JSON.


```tremor
# The following literal is valid  in both JSON and Tremor:
[1, "snot", {}];

# The following literal is valid in Tremor only:
[1, "snot", {}, << data/binary >>, ];
```

So, what are the key differences?

- Tremor supports comments, JSON does not.
- Tremor supports trailing commas in arrays and records, JSON does not.
- Tremor supports binary literal data, JSON does not.


|             | **Tremor** | **JSON**    |
| :---        |    :----:   |          ---: |
| **Comments**      | :white_check_mark:      | :x:   |
| **Trailing commas**   | ::white_check_mark:    | :x:     |
| **Binary Literal Data**| :white_check_mark:     | :x:  |

:::note

By default, most connectors in Tremor serialise to and from `json` via a codec. The
type system in Tremor, however, is agnostic to the wire format of data that flows through
Tremor. So, data originates as `json`, as `msgpack`.

:::

### Computations

Tremor also supports a rich expression language with the same support for additive, mutliplicate,
comparitive, and logical unary and binary expressions as languages like `rust` and `java`.

As most of the data that flows through Tremor is hierarchically structured or JSON-like, Tremor
also has rich primitives for structural pattern-matching, structural comprehension or iterating
over data structures.

### Loops

Tremor does not support `while`, `loop` or other primitives that can loop, recurse or iterate
indefinitely.

In an event-based system, events are streaming continuously. So, infinite loops that can block
streams from making forward progress are considered harmful.

:::info

* There are no loops.

* We support iteration over finite arrays.

* We support depth-limited tail recursive functional programming.

:::

### Expression-oriented

Script processing is expression-oriented. This means that every structural
form supported by Tremor returns a data structure as a result.


### Event-oriented

Scripts in Tremor can `emit` or `drop` an event that is being processed.

The `event` keyword is the subject. It identifies the value currently being processed.

The `emit` keyword halts processing succesfully with a value.

The `drop` keyword halts processing by discarding the current event.


### Illustrative Example

```tremor
# Propagate events marked as important and convert them to system alerts:
match event of
  case %{ present important } => { "alert": event.message }
  default => drop
end;
```

