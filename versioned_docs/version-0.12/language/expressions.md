---
sidebar_position: 4
---

# Expressions

This section will give you an overview over all the expressions available in Tremor, be it [Select] statements, [Script] or [Connector] definitions.

## Comments

Comments in Tremor are single-line comments that begin with a '#' symbol and continue until end of line.

```tremor
# I am a comment
```

### Doc Comments

Doc comments are used for producing documentation for entities in Tremor. They consist of a single line beginning with '##' token and continue until end of line. Multiple consecutive lines will be combined to form a documentation text.

```tremor
## I am a doc-comment, documenting the const below
const FALSE = true;
```

### Module Doc Comments

Module doc comments are used for producing documentation for Module files in Tremor. They consist of a single line beginning a `###` token and continue until the end of line. Multiple consecutive lines will be combined to forma module documentation text.

```tremor
### I am a module doc comment
###
### This is my third line, cool innit?
```


## Literals

Literal in Tremor are equivalent to their sibling types supported by the JSON format. In fact, any well-formed JSON document is a valid Tremor literal.

### Null

The null literal which represents the absence of a defined value

```tremor
null
```

### Boolean

Boolean literal.

```tremor
true
```

```tremor
false
```

### Integer Numerics

Integers in Tremor are signed and are limited to 64-bit internal representation

```tremor
404
```

The stdlib provides useful function for integers in [`std::integer`](../reference/stdlib/std/integer).

```tremor
use std::integer;
integer::parse("42") == 42
```

### Floating-Point Numerics

Floating point numerics in Tremor are signed and are limited to 64-bit IEEE representation

```tremor
1.67-e10
```

The stdlib provides useful function for floats in [`std::float`](../reference/stdlib/std/float).

### Character and Unicode Code-points

The language does not support literal character or Unicode code-points at this time.

### UTF-8 encoded Strings

```tremor
"I am a string"
```

The standard library provides useful function for string manipulation in [`std::string`](../reference/stdlib/std/string):

```tremor
use std::string;
string::uppercase(string::substr("snotty", 0, 4)) == "SNOT"
```

#### String Interpolation

For strings tremor allows string interpolation, this means embedding code directly into strings to create strings out of them.

```tremor
"I am a #{ "string with #{1} interpolation." }"
```

A hash sign followed by a curly bracket needs to be escaped `\#{` hash signs themselves do not need to be escaped.


#### HereDocs

To deal with pre formatted strings in tremor script we allow for **heredocs** they are started by using triple quotes `"""` that terminate the line (aka `"""bla` isn't legal). Heredocs do not truncate leading indentation, only the first leading linebreak after the leading triple-quote `"""` stripped.

```tremor
"""
    I am
   a
    long
    multi-line
    string with #{ "#{1} interpolation" }
"""
```

Since Tremor 0.9 Heredocs also support [String Interpolation](#string-interpolation). A hash sign followed by a curly bracket needs to be escaped `\#{` hash signs themselves do not need to be escaped.

### Arrays

Array grammar:

> ![array grammar](./reference/svg/list.svg)

Array literals in Tremor are a comma-delimited set of expressions bracketed by the square brackets '[' and ']'.

```tremor
[ 1, 2, "foobar", 3.456e10, { "some": "json-like-document" }, null ]
```

The standard library provides several useful functions to work with arrays in [`std::array`](../reference/stdlib/std/array):

```tremor
use std::array;

array::push(["snot"], "badger") == ["snot", "badger"]
```

### Records

Record grammar:

> ![record grammar](./reference/svg/record.svg)

Field grammar:

> ![field grammar](./reference/svg/field.svg)

Record literals in Tremor are syntactically equivalent to JSON document objects

```tremor
{
  "field1": "value1",
  "field2": [ "value", "value", "value" ],
  "field3": { "field4": "field5" }
}
```

Check out the stdlib [`std::record`](../reference/stdlib/std/record) module for some helpful function for working with records.

### Binary

Binaries are based on the [Erlang bit syntax](https://erlang.org/doc/programming_examples/bit_syntax.html).

Binary grammar:

> ![binary literal grammar](./reference/svg/bytesliteral.svg)

Bytes grammar:

> ![binary segments grammar](./reference/svg/bytes.svg)

Bytes Part
> ![field grammar](./reference/svg/bytespart.svg)


Parts of each field are: `<value>:<size>/<type>` where both `size` and `type` are optional. Without `size` or `type`,
the field defaults to an unsigned big endian integer with 8 bits (aka 1 byte).

The binary types consists of up to three parts. That is 2 prefixes and 1 main type identifier. Examples: `unsigned-big-integer`, `signed-integer`, `binary`. The types currently supported are:

* `binary` - this can handle both binaries and strings, `size` here refers to the number of bytes
* `integer` - this can represent integers, `size` here means size in bits. In addition the type can be prefixed with `big` and `little` for indianness and `signed` and `unsigned` for signedness.


Some examples would be:

* `<<1:1, 42:7>>`
* `<<(1 + 1)/unsigned-big-integer>>`
* `<<1:4, "badger"/binary, -2:4/signed-little-integer>>`


We could construct a TCP package this way:

```tremor
# constructing a TCP package
# using made up, non-correct values

let event = {
  "src": {"port": 1234},
  "dst": {"port": 2345},
  "seq": event,
  "ack": 4567,
  "offset": 1,
  "res": 2,
  "flags": 3,
  "win": 4,
  "checksum": 5,
  "urgent": 6,
  "data": "snot badger!"
};

<<
  event.src.port:16,  event.dst.port:16,
  event.seq:32,
  event.ack:32,
  event.offset:4, event.res:4, event.flags:8, event.win:16,
  event.checksum:16, event.urgent:16,
  event.data/binary
>>

```

See also:

 - [`std::binary`](../reference/stdlib/std/binary) for useful function for working with binary data.
 - [`std::string::into_binary`](../reference/stdlib/std/string#into_binarybytes) and [`std::string::from_utf8_lossy`](../reference/stdlib/std/string#from_utf8_lossybytes)
 - [`std::base64`](../reference/stdlib/std/base64) for encoding and decoding binary data to string using base64.


## Operators

List of binary and unary operators in Tremor, ordered by precedence (from low to high):

| Symbol       | Name                                                  | Example                                                 | Types                          |
|--------------|-------------------------------------------------------|---------------------------------------------------------|--------------------------------|
| or           | Logical OR                                            | `true or false`                                         | bool                           |
| and          | Logical AND                                           | `true and false`                                        | bool                           |
| \|           | Bitwise OR                                            | _Bitwise OR has not been implemented yet_               | -                              |
| ^            | Bitwise XOR                                           | `42 ^ 42, true ^ true`                                  | integer, bool                  |
| &            | Bitwise AND                                           | `42 & 0, true & false`                                  | integer, bool                  |
| ==, !=       | Equality, Inequality                                  | `"snot" != "badger"`                                    | all                            |
| <, <=, >, >= | Comparison Operators                                  | `42 > 0`                                                | integer, float, string, binary |
| <<, >>, >>>  | Bitwise shift -- Left, Right(signed), Right(unsigned) | `42 >> 2`                                               | integer                        |
| +, -         | Addition, Subtraction                                 | `42 + 0`                                                | integer, float, string         |
| \*, /, %     | Multiplication, Division, Modulus                     | `42 * 1`                                                | integer, float (no modulo)     |
| +, -         | Unary Plus, Unary Minus                               | `+42`                                                   | integer, float, string         |
| not , !      | Unary Logical NOT, Unary Bitwise NOT                  | `not false`, _Bitwise NOT has not been implemented yet_ | bool                           |


:::warning

These should not be confused with the higher level [Operators](../reference/operators/index.md) that are part of a [Pipeline](./pipelines).

:::

## Paths

Path grammar:

> ![path grammar](./reference/svg/path.svg)

Path Segments grammar:

> ![qualified segment grammar](./reference/svg/pathsegments.svg)

ArraySegment grammar:

> ![array grammar](./reference/svg/selector.svg)

Path-like structures in Tremor allow referencing local variables, ingested events, event meta-data, script-local state etc. and also indexing into them if they are records or arrays.

### Reserved paths

_Normal_ paths are used to referring to local variables created with [let](#let), but Tremor offers a set of reserved paths used to refer to commonly needed entities:

- `event`: Always referring to the currently handled event.
- `$`: Referring to the event metadata. Values inside the event metadata can only be accessed via a top-level name like: `$udp.port`. Its contents are usually either `null` or a record.
- `state`: Referring to the script's state, which will persist across the lifetime of a pipeline, but not across tremor reboots. So it can be used as state kept across different events. Default value is `null`.
- `args`: Referring to a record of arguments passed into the [script definition](./pipelines#embedded-script-definitions) or [create script](#embedded-script-definitions).
- `window`: Referring to the name of the [window](./pipelines#tumbling-windows) this event is emitted from. This is `null` if the event is not handled inside a [select](./pipelines#select-queries) statement with a [window](./pipelines#tumbling-windows).
- `group`: Referring to the current group if the event is handled inside a [select](./pipelines#select-queries) statement with a `group by` clause. It will be `null` outside of a `group by` select, if used inside, it will be an array where the first element is the value of the current group, and the second element is the stringified _name_ of the group, derived from the group value.

### Example

Example event for illustration purposes:

```json
{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J.R.R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  },
  "expensive": 10
}
```

Grab the entire event document:

```tremor
let capture = event;
```

Grab the books from the store (the same using key, index and escaped key notation for field lookup):

```tremor
let capture = event.store.book;
# index and escaped notation can accommodate keys that include 'odd' characters such as whitespaces or dots.
let capture = event.store["book"];
let capture = event.store.`book`;
```

Grab the first book:

```tremor
let capture = event.store.book[0];
```

Grab the title of the 3rd book:

```tremor
let capture = event.store.book[2].title
```

Grab the range of books from 0 ( the first ) to 2 ( the last ), exclusive of the last book:

```tremor
let capture = event.store.book[0:2];
```

The type of a path is equivalent to the type of the data returned by a path expression. So in the above examples, a reference to a book title would return the value at that path, which in the reference event document is a `string`.

Path's in Tremor are themselves expressions in their own right.

## Const

Const grammar:

![const grammar](./reference/svg/const.svg)

Const can be used to define immutable, constant values that get evaluated at compile time. This is more performant than `let` as all logic can happen at compile time and is helpful for setting up lookup tables or other never changing data structures.

## Let

Let grammar:

> ![let grammar](./reference/svg/let.svg)

The let expression allows data pointed to by a path to be destructively mutated, and the pointed-to value reassigned. If the path does not yet exist, it will be created in-situ:

Set a local variable `a` to the literal integer value 10:

```tremor
let a = 10;
```

Set a local variable `a` to be the ingested event record

```tremor
let a = event;
```

Set the metadata variable `a` to be the value of the local variable `a`:

```tremor
let $a = a;
```

## Drop

Drop expressions enable short-circuiting the evaluation of a [Script] when badly formed data is discovered. If no argument is supplied, `drop` will return the event record. If an argument is supplied, the result of evaluating the expression will be returned. Tremor or other processing tools can process dropped events or data using purpose-built error-handling.

As the content of the dropped event is user-defined, operators can standardise the format of the error emitted on drop from Tremor

```tremor
drop;
drop; # As the first drop always wins, this expression never runs
```

## Emit

Emit grammar:

> ![emit grammar](./reference/svg/emit.svg)

Emit expressions enable short-circuiting the evaluation of a [Script] when processing is known to be complete and further processing can be avoided. If no argument is supplied, `emit` will return the event record. If an argument is supplied, the result of evaluating the expression will be returned. Tremor or other processing tools can process emitted events or data using their default flow-based or stream-based data processing pipelines.

As the content of the emitted event is user-defined, operators can standardise the format of the event emitted on emit from a [Script].

:::note
By default, if no `emit` or `drop` expressions are defined, all expressions in a correctly written [Script] will be evaluated until completion and the value of the last expression evaluated will be returned as an `emit` message.
:::

Implicit emission:

```tremor
"badgers" # implicit emit
```

Explicit emission of `"snot"`:

```tremor
"badgers" # literals do not short-circuit processing, so we continue to the next expression in this case
emit "snot"
```

```tremor
emit "oh noes!"
emit "never happens"; # As the first emit always wins, this expression never runs
```

There are times when it is necessary to emit synthetic events from a [Script] within a tremor `pipeline` to an alternate `operator` port than the default success route. For example, when data is well-formed but not valid and the data needs to be **diverted** into an alternate flow. The emit clause can be deployed for this purpose by specifying an optional named port.

```tremor
emit {
  "event": event,
  "status": "malformed",
  "description":
  "required field `loglevel` is absent"
} => "invalid";
```

## Match

Match grammar:

> ![match grammar](./reference/svg/match.svg)

Match case grammar:

> ![case grammar](./reference/svg/predicateclause.svg)

Match expressions enable data to be filtered or queried using case-based reasoning. Match expressions take the form:

```tremor
match <target> of
case <case-expr> [ <guard> ] => <block>
...
default => <block>
end
```

Where:

- target: An expression that is the target of case-based queries
- case-expr: A predicate test, literal value or pattern to match against
- guard: An optional predicate expression to gate whether or not an otherwise matching case-clause will in fact match
- block: The expressions to be evaluated if the case matches, and any supplied guard evaluates to true

Examples:

Discover if the `store.book` path is an array, record or scalar structure:

```tremor
match store.book of
  case %[] =>
    let msg = "store.book is an array-like data-structure",
    msg
  case %{} => "store.book is a record-like data-structure"
  default => "store.book is a scalar data-type"
end
```

Find all fiction books in the store:

```tremor
let found = match store.book of
  case fiction = %[ %{ category ~= "fiction" } ] => fiction
  default => []
end;
emit found;
```

### Matching literal expressions

The simplest form of case expression in match expressions is matching a literal value. Values can be any legal Tremor type and they can be provided as literals, computed values or path references to local variables, metadata or values arriving via events.

```tremor
let example = match 12 of
  case 12 => "matched"
  default => drop "not possible"
end;
```

```tremor
let a = "this is a";
let b = " string";
let example = match a + b of
  case "this is a string" => "matched"
  default => drop "not possible"
end;
```

```tremor
let a = [ 1, "this is a string", { "record-field": "field-value" } ];
match a of
  case a => a
  default => drop "not possible"
end;
```

### Matching on test predicate expressions

It is also possible to perform predicate based matching

```tremor
match "this is not base64 encoded" of
  case ~ base64|| => "surprisingly, this is legal base64 data"
  default => drop "as suspected, this is not base64 encoded"
end;
```

These are often referred to informally as `tilde expressions` and tremor supports a variety of micro-formats that can be used for predicate or test-based matching such as logstash dissect, json, influx, perl-compatible regular expressions.

Tilde expressions can under certain conditions elementize ( extract ) micro-format data. The elementization or extraction is covered in the [Extractors](#extractors) section of this document and in the Extractor reference.

### Match and extract expressions

It is also possible to elementize or ingest supported micro-formats into Tremor for further processing. For example, we can use the `~=` and `~` operator to perform a predicate test, such as the base64 test in the previous example, which upon success, extracts ( in the base64 case, decoding ) a value for further processing.

For example if we had an embedded JSON document in a string, we could test for the value being well-formed json, and extract the contents to a local variable as follows:

```tremor
let sneaky_json = "
{ \"snot\": \"badger\" }
";

match sneaky_json of
  case json = ~ json|| => json
  default => drop "this is not the json we were looking for"
end;
```

### Matching tuple patterns

:::tip
A *tuple pattern* matches a *target* value if the *target* is an array and **each** test matches the positionally correspondent value in the *target*. The *target* needs to be **at least as long** as the *pattern* but **can be longer** if the *pattern* ends with `...`.

If you are looking for a more set like operation look at the [array pattern](#matching-array-patterns).
:::

> ![tuple case grammar](./reference/svg/tuplepattern.svg)

Tuple Pattern filter grammar:

> ![tuple filter grammar](./reference/svg/tuplepredicatepatterns.svg)

In addition to literal array matching, where the case expression tuple literal must exactly match the target of the match expression one for one, tuple patterns enable testing for matching elements within an array and filtering on the basis of matched elements.


```tremor
let a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
match a of
  case %( 0 ) => "is a zero"
  case %( 0, .. ) => "starts with a zero"
  case %( _, 1, .. ) => "has 1 one at index 1"
  default => "does not contain zero's"
end;
```

### Matching array patterns

:::tip
An *array pattern* matches a target value if the *target* is an array and **each** test in the pattern matches **at least for one** element in the *target* indiscriminate of their positions.

If you are looking for a more array like / positional operation look at the [tuple pattern](#matching-tuple-patterns).
:::


> ![array case grammar](./reference/svg/arraypattern.svg)

Array Pattern filter grammar:

> ![array filter grammar](./reference/svg/arraypredicatepattern.svg)

In addition to a subset match, where the elements of the pattern must be included in the target of the match expression, array patterns enable testing for matching elements within an array and filtering on the basis of matched elements.

```tremor
let a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
match a of
  case %[ 0 ] => "contains zero's"
  default => "does not contain zero's"
end;
```

Predicate matching against supported micro-formats is also supported in array pattern matching.

```tremor
let a = [ "snot", "snot badger", "snot snot", "badger badger", "badger" ];
match a of
  case got = %[ ~re|^(P<hit>snot.*)$| ] => got
  default => "not snotty at all"
end;
```

### Matching record patterns

:::tip
A record pattern matches a target if the target is a record that contains **at least all declared keys** and the tests for **each of the declared key** match.
:::

> ![record case grammar](./reference/svg/recordpattern.svg)

Record Pattern Fields grammar

> ![record pattern field grammar](./reference/svg/patternfields.svg)

Similarly to record literal matching where the case expression record must exactly match the target of the match expression, record patterns enable testing for matching fields or sub-structures within a record and extracting and elementizing data on the basis of matched predicate tests ( via `~=` ).

We can check for the presence of fields:

```tremor
match { "superhero": "superman", "human": "clark kent" } of
  case %{ present superhero, present human } => "ok"
  default => "not possible"
end
```

We can check for the absence of fields:

```tremor
match { "superhero": "superman", "human": "clark kent" } of
  case %{ absent superhero, absent human } => "not possible"
  default => "ok"
end
```

We can test the values of fields that are present:

```tremor
match { "superhero": "superman", "human": "clark kent" } of
  case %{ superhero == "superman" } => "we are saved! \o/"
  case %{ superhero != "superman" } => "we may be saved! \o/"
  default => "call 911"
end;
```

We can test for records within records:

```tremor
match { "superhero": { "name": "superman" } } of
  case %{ superhero ~= %{ present name } } => "superman is super"
  case %{ superhero ~= %{ absent name } } => "anonymous superhero is anonymous"
  default => "something bad happened"
end;
```

We can also test for records within arrays within records tersely through nested pattern matching:

```tremor
match { "superhero": [ { "name": "batman" }, { "name": "robin" } ] } of
  case id = %{ superhero ~= %[ %{ name ~= re|^(?P<kind>bat.*)$|} ] } => id
  default => "something bad happened"
end;
```

### Guard clauses

> ![guard clause grammar](./reference/svg/whenclause.svg)

Guard expressions in Match case clauses enable matching data structures to be further filtered based on predicate expressions. For example they can be used to restrict the match to a subset of matching cases where appropriate.

```tremor
match event of
  case record = %{} when record.log_level == "ERROR" => "error"
  default => "non-error"
end
```

### Effectors

Effectors grammar:
> ![effectors grammar](./reference/svg/effectors.svg)

Block:
> ![block grammar](./reference/svg/block.svg)

Effectors are the expressions evaluated when a case pattern and guard succeeded. When we have to use multiple expressions to do some more complex processing, we need to separate those expressions with commas `,`:

```tremor
use std::string;
match event of
  case record = %{ present foo } =>
    let foo_content = record["foo"],
    let replaced = string::replace(foo_content, "foo", "bar"),
    let record["foo"] = replaced
  default => null
end
```

## Merge

> ![merge grammar](./reference/svg/merge.svg)

Merge expressions define a difference against a targeted record and applies that difference to produce a result record. Merge will result in an error if any of the operands are not records.

### Merge rules

The table below is read with each row replacing the variables in the following statement:

```tremor
let result = merge given of merge end;
```

| given                | merge        | result               | Explanation                          |
|----------------------|--------------|----------------------|--------------------------------------|
| `{"a":"b"}`          | `{"a":"c"}`  | `{"a":"c"}`          | Insert/Update field 'a'              |
| `{"a":"b"}`          | `{"b":"c"}`  | `{"a":"b", "b":"c"}` | Insert field 'b'                     |
| `{"a":"b","b":"c"}`  | `{"a":null}` | `{"a":null,"b":"c"}` | Set field 'a' to 'null'              |
| `{"a": [{"b":"c"}]}` | `{"a": [1]}` | `{"a": [1]}`         | Replace field 'a' with literal array |


Example:

```tremor
let event = merge event of {"some": "record"} end;
```

## Patch

> ![patch grammar](./reference/svg/patch.svg)

Patch operation grammar

> ![patch operation grammar](./reference/svg/patchoperations.svg)

Patch expressions define a set of record level field operations to be applied to a target record in order to transform a targeted record. Patch allows fields to be: inserted where there was no field before; removed where there was a field before; updated where there was a field before; or inserted or updated regardless of whether or not there was a field before. Patch also allows field level merge operations on records or for the targeted document itself to be merged. Merge operations in patch are syntax sugar in that they are both based on the merge operation.

Patch follows the semantics of [RFC 6902](https://tools.ietf.org/html/rfc6902) with the explicit exclusion of the `copy` and `move` operations and with the addition of an `upsert` operation the variant supported by Tremor

| Example                               | Expression                               | Result                      | Explanation                                               |
|---------------------------------------|------------------------------------------|-----------------------------|-----------------------------------------------------------|
| `let foo = {"foo":"bar"}`             | `patch foo of insert "baz" => "qux" end` | `{"foo":"bar","baz":"qux"}` | Add baz field                                             |
| `let foo = {"foo":"bar","baz":"qux"}` | `patch foo of erase "foo" end`           | `{"baz":"qux"}`             | Erase foo and add baz field                               |
| `let foo = {"foo":"bar"}`             | `patch foo of upsert "foo" => null end`  | `{"foo":null}`              | Set foo to null, or reset to null if field already exists |

## For comprehensions

> ![for grammar](./reference/svg/for.svg)

For Case Clause grammar

> ![for case clause grammar](./reference/svg/forcaseclause.svg)

For expressions are case-based record or array comprehensions that can iterate over index/element or key/value pairs in record or array literals respectively.

Given our book store example from above:

```tremor
let wishlist = for store.book of
  case (i,e) =>
    for e of of
      case (k,v) when k == "price" and v > 20.00 => { "title": e.title, "isbn": e.isbn }
      default => {}
    end
end
```

## State

As part of the tremor `pipeline` processing, there are times when it's necessary to track state across events over time (eg: in order to exploit stateful algorithms for session tracking, or building and maintaining application state). For this purpose, a tremor `pipeline` is equipped with operator node-level state management and storage capabilities that persists for the running lifetime of a pipeline deployed into the tremor runtime.

From a [Script], this shared storage is accessible via the `state` keyword, which allows for accessing the storage contents via [path](#paths) expressions, akin to how the `event` keyword works (with the key difference being that the state storage is shared across events). On pipeline initialization, the state is initialized as `null` and users are free to set it to arbitrary value over the course of processing.

Here's a [Script] example demonstrating the usage of the `state` keyword -- it maintains a counter for the events coming in and emits the count alongside the event:

```tremor
define script with_state
script
  match type::is_null(state) of
    case true =>
      let state = {"count": 1}
    default =>
      let state.count = state.count + 1
  end;

  {
    "count": state.count,
    "event": event
  }
end;
```

A key thing to note is that by design, state is not shared across operator nodes in the pipeline. Therefore, if we have scripts across multiple nodes in the pipeline, the `state` keyword in each script allows access only to the local node-specific state storage, and not the state from any other operator nodes or something global to all the nodes.

Since the state storage lives for the lifetime of a pipeline, state will not be persisted when the pipeline is undeployed or the main process is shut down.

## Extractors

> ![test expression grammar](./reference/svg/testexpr.svg)

TEST_LITERAL Grammar:
> ![test literal grammar](./reference/svg/testliteral.svg)

The language has pluggable support for a number of microformats with two basic modes of operation that enable predicate tests ( does a particular value match the expected micro-format ) and elementization ( if a value does match a specific micro-format, then extract and elementize accordingly ).

The general form of a supported micro-format is as follows:

```text
<name>|<format>|
```

Where:

- name - The key for the micro-format being used for testing or extraction
- format - An optional multi-line micro-format specific format encoding used for testing and extraction

Formats can be spread out over multiple lines by adding a `\` as a last character of the line. Spaces at the start of the line will be truncated by the lowest number of leading spaces. So if 3 lines respectively have 2, 4, and 7 spaces then 2 spaces are going to be removed from each line leaving 0, 2, and 5 spaces at the start.

The set of supported micro-formats at the time of writing is available in the [Extractors Reference](../reference/extractors)

[Script]: ../language/scripts
[Select]: ../language/pipelines.md#select-queries
[Connector]: ../reference/connectors
