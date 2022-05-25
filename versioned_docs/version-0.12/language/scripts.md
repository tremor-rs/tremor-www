---
sidebar_position: 1
---

# Scripts

Tremor scripts are user-defined pipeline [Operators]. They also have the standard ports `in`, `out` and `err` and are part of the [Pipeline] graph. Events are routed into and out of scripts using the [Select] statement inside a [Pipeline].

Scripts need to be defined using the [Script definition statement](./reference/full.md#rule-definescript) and created by using the [Script create statement](./reference/full.md#rule-createscript). They can have [Arguments](./index.md#arguments) that can be provided upon creation.

Example:

```tremor
define script add
args
    summand
script
    emit event + args.summand
end;

create script add_one from add
with
    summand = 1
end;
```


## Execution

Scripts are executed and evaluated for each event [Select]ed into its `in` port. They are interpreted statement by statement, at each execution step the [event], the script state and the local variable stack can be manipulated.

During execution, the payload of the current event is available via the special `event` [path](./expressions.md#paths). As on each other level inside the Tremor runtime [events] can be arbitrarily structured values, closely resembling JSON, but with some extensions. See the section on Tremors [Type System](./index.md#type-system).

### Local variables

Local variables are introduced with the [`let` statement](./reference/script.md#rule-let). The `let` statement is also used for assigning values to existing variables or for adding new fields to a [record](./expressions.md#records) value.

```tremor
use std::random;

# assign to new local variable
let new_local = event.field + 4;

# assign to an existing nested field
let event.existing_field = std::random::integer(1, 10);

# reassign
let new_local = new_local + 1;

# add a new record field
let event.new_field = "snot";
```

Local variables are scoped to the current script or function context. There is no variable shadowing.



### Emitting events

In Tremor, every [expression] and statement has a return value and the return value last statement in a script determines the payload of the output event. To explicitly control when and what is returned from a script, the [`emit`] statement can be used. The script execution terminates when an [`emit`] is hit in the script control flow. As such it can be used to exit a script early or to route events to different output ports.

The general form is:

```
emit [<EXPR>] [=> <PORT>]
```

where `EXPR` is any kind of [expression] and `PORT` is also an expression evaluating to a string.
Both can be omitted. The default value for `EXPR` is `event`, so it will emit the current event. The default value for `PORT` is `"out"`, so it will emit `EXPR` to the `out` port of the script.

The following example will emit `event` to the `out` port:

```tremor
emit;
```

The following example will emit a random number to the `rand` port:

```tremor
use std::random;

emit random::integer() => "rand";
```

The following example will emit the string "snot" to the port provided in the `port` field of the current event:

```tremor
emit "snot" => event.port;
```

The following example will emit an error message if a required field is missing and otherwise carries on with the control flow:

```tremor
match event of
  case %{ absent required_field } =>
    emit "'required_field' is missing" => "err"
  default => null
end;

do_something(event.required_field)
# ...
```


### Dropping events

The [`drop`] statement can be used to stop forwarding the current event and also stop execution of the current script. The input event will not be considered acknowledged or failed, but simply dropped and not passed on to the next pipeline [operator] or output port.

Example:

```tremor
match event of
  %{ action = "drop" } => drop;
  default => 
    # do something else
end;
```

### Errors

Every Script can error for many reasons, but the most common reasons for errors are:

* Treating some variable as a type (e.g. accessing field of a record) that it actually isnt.
* Accessing a field on a record that doesn't exist.
* Accessing an index on an array that is out of bounds.

When a script errors, the input event is discarded and a synthetic event is sent to stdout. The format of the error event is:

```tremor
{
    "error":"Error: \n   13 |           event.snot\n      |                 ^^^^ Conflicting types, got string but expected record\n\n",
    "event":"{}"
}
```

To make errors visible to users and to actually act upon them they need to be selected from the `err` port. A common pattern is to forward it to the pipeline `err` port:

```tremor
define script foo
script
    # trigger an error
    emit event.some_non_existing_field;
end;
create script foo;

select event from in into foo;
select event from foo into out;
# foward the script error to the pipeline `err` port
select event from foo/err into err;
```

[Pipeline]: ./pipelines.md
[Operators]: ../reference/operators
[Select]: ./pipelines.md#select-queries
[`emit`]: ./reference/script.md#rule-emit
[expression]: ./expressions.md
[event]: ./index.md#events
[events]: ./index.md#events