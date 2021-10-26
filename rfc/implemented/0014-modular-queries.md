# Modular Queries

- Feature Name: rfc-0014-modular-queries
- Start Date: 2021-07-24
- Tremor Issue: [tremor-rs/tremor-runtime#940](https://github.com/tremor-rs/tremor-runtime/issues/940)
- RFC PR: [tremor-rs/tremor-rfcs#55](https://github.com/tremor-rs/tremor-rfcs/pull/55)


## Summary

Add support for modular queries to Tremor's query language, Trickle, so that distinct subgraphs could be reused and composed into higher level queries.

## Motivation

Subqueries would allow composition of smaller, reusable queries into higher level queries.

## Guide-level explanation

### Definition

![DefineSubqueryDefn](/img/rfc/0014-modular-queries/DefineSubqueryDefn.png)

```
DefineSubqueryDefn ::= DocComment? 'define' 'query' Id ('from' Ports)? ('into' Ports)? WithPartialParams? Subquery
```

```
define query custom_subquery
## Documentation Comment
from input_stream_1, input_stream_2
into output_stream
with
 param1 = "foo",
 param2 = 42
query
 select event from input_stream_1 where event.name == args.param1 into output_stream;
 select event from input_stream_2 where event.id == args.param2 into output_stream;
end;
```

- The `with` clause can be used to pass in parameters when required.
    - The values given to the parameters in the with clause here act as their default values.
    - Parameters are accessible through `args` inside the subquery.
- The `from` clause can be used to define input streams.
    - If elided, `in` stream is attached.
- The `into` clause can be used to define output streams.
    - If elided, `out` and `err` streams are attached.  
&nbsp;
- **Note**
    - Although there are currently no restrictions on sending events into the `input_stream` or reading from the `output_stream`, it is **not** recommended to do so.
    - The streams named inside the `from` and `into` clauses are created inside the subquery implicitly. i.e. there is no need to `create stream output_stream` inside the subquery.

### Creation

![CreateSubqueryDefn](/img/rfc/0014-modular-queries/CreateSubqueryDefn.png)

```
CreateSubqueryDefn ::= 'create' 'query' Id ( 'from' ModularId )? WithParams?
```

```
# Short form
create query custom_subquery;

# Full form
create query my_custom_subq from custom_subquery
with
 param1 = "bar"
end;
```

- The short form can be used if you don’t need to give the subquery a custom id.
    - The `id` from the subquery definition is used, ie `custom_subquery` in this case.
- The full form allows you to give a custom id to the subquery.
- The `with` clause can be used with either form to specify some or all of the parameters. Default values from the definition will be used for those left unspecified.

### Use

```
select event from in into my_custom_subq/input_stream_1;
select event from in into my_custom_subq/input_stream_2;
select event from my_custom_subq/output_stream into out;
```

- We need to explicitly specify the ports with `my_custom_subq`  here because the subquery is not using the default `in`, `out` or `err` ports.

### Example 1

```
mod library with
 mod utils with

   define script mark_malformed
   script
     emit {
     "event": event,
     "status": "malformed"
   } => "invalid";
   end;

   define query select_minage
     with
       age = 18 # Parameter with default value of `18`
     query
       select event from in where in.age >= args.age into out;
   end;

 end;

 define query select_valid_people
 with
   age = 21,
   placeholder_name = "NA"
 query
   use utils;
   create script mark_malformed;
   create query select_min_age
   with
     age = args.age 
   end;

   select event from in into select_min_age;
   select event from select_min_age where event.name != args.placeholder_name into out;
 
   select event from select_min_age where event.name == args.placeholder_name into mark_malformed;
   select event from mark_malformed/invalid into err;

end;

create query valid_over_21 from library::select_valid_people
with
 placeholder_name = "John Doe" # Overrides the default value of "NA".
end;

select from in into valid_over_21;
select from valid_over_21 into out;
select from valid_over_21/err into err;

# Routes all events with age>=21 and name!="John Doe" to out
# Events with age<=21 are ignored
# Events with name=="John Doe" are marked as malformed and routed to err
```

Here, we have a subquery, `valid_over_21`, defined in the `library` module. The subquery itself is composed out of more generic components defined in the `utils` module and overrides their defaults with its own where appropriate.

- **Note**
    - It's not possible to access the `mark_malformed/invalid` stream from outside the subquery unless it's connected to `err` (or any other `into`) port.

### Example 2

```
define query custom_subquery
with
 interval = core::datetime::with_seconds(60),
 minimum_count = 0
query
 define tumbling window interval_window
 with
     interval = args.interval
 end;
 select aggr::stats::hdr(event.count)
 from in[interval_window]
 group by each(event.topic)
 into out
 having count > args.minimum_count;
end;

create query six_per_two_minutes from custom_subquery
with
 interval = core::datetime::with_seconds(120),
 minimum_count = 6
end;
```

The `custom_subquery` defined here contains its own scoped definition of a tumbling window, `interval_window`. This window is not accessible outside the subquery.

- **Note**
    - While it's possible to define and create a component inside a subquery, it's **not** possible to pass in an externally created component as a parameter.

## Reference-level explanation

The subqueries syntax builds upon the existing modularity features to enable the composition of smaller components into higher level queries. During the construction of the DAG nested subqueries are, recursively, flattened and inlined into their parent Query.

### Grammar Changes

- **Stmt**
    - Two new statement types are introduced in `Stmt` for defining and creating subqueries.
    - ![Stmt](/img/rfc/0014-modular-queries/Stmt.png)
```
Stmt ::= 
    ModuleStmt
    | DefineWindowDefn
    | CreateStreamDefn
    | DefineOperatorDefn
    | CreateOperatorDefn
    | DefineScriptDefn
    | CreateScriptDefn
    | DefineSubqueryDefn  // New
    | CreateSubqueryDefn  // New
    | SelectStmt
```

- **ModuleStmtInner**
    - The definition of `ModuleStmtInner` is extended to include subquery definitions.
    - ![ModuleStmtInner](/img/rfc/0014-modular-queries/ModuleStmtInner.png)
```
ModuleStmtInner ::=
    ModuleStmt
    | DefineWindowDefn
    | DefineOperatorDefn
    | DefineScriptDefn
    | DefineSubqueryDefn  // New
```

### Grammar Additions

-  **CreateSubqueryDefn**
    - A new keyword `query` is introduced.
    - ![CreateSubqueryDefn](/img/rfc/0014-modular-queries/CreateSubqueryDefn.png)
```
CreateSubqueryDefn ::= 'create' 'query' Id ( 'from' ModularId )? WithParams?
```
-  **DefineSubqueryDefn**
    - ![DefineSubqueryDefn](/img/rfc/0014-modular-queries/DefineSubqueryDefn.png)
```
DefineSubqueryDefn ::= DocComment? 'define' 'query' Id ('from' Ports)? ('into' Ports)? WithPartialParams? Subquery
```
- **Ports**
    - ![Ports](/img/rfc/0014-modular-queries/Ports.png)
```
Ports ::= Id ',' Ports | Id
```
- **Subquery**
    - ![Subquery](/img/rfc/0014-modular-queries/Subquery.png)
```
Subquery ::= 'query' SubqueryStmtInner 'end'
```
- **SubqueryStmtInner**
    - Currently, the definition of  `SubqueryStmtInner` is equivalent to that of `Query`.
    - ![SubqueryStmtInner](/img/rfc/0014-modular-queries/SubqueryStmtInner.png)
```
SubqueryStmtInner ::= ( Stmt ';' )+ | Stmt
```

## Drawbacks

- Introduction of subqueries would encourage deeper nesting which might increase compile time complexity.
- Unlike most other nodes, subqueries do not _always_ use the default (`in`, `out`, `err`) ports, this can seem unfamiliar and verbose to Tremor's users.

## Rationale and alternatives

- Why is this design the best in the space of possible designs?
    - The syntax is already familiar to Tremor users as it’s similar to the current syntax for Operators and Scripts.
    - The flattening of subqueries in the DAG allows for pipeline optimizations to apply to subqueries where applicable.
- What other designs have been considered and what is the rationale for not choosing them?
    - A function-like syntax was explored but was abandoned in early stages as it proved to be incongruous for this use case.
    - Subqueries could be implemented as Operator nodes inside the DAG but that would make them inscrutable.

## Prior art

- **Modularity RFC**
    - [https://rfcs.tremor.rs/0010-modularity/](https://rfcs.tremor.rs/0010-modularity/)
- **Operators and Scripts in Tremor**
    - [https://docs.tremor.rs/tremor-query/operators/](https://docs.tremor.rs/tremor-query/operators/)

## Unresolved questions

- None

## Future possibilities

- The subquery interface for parameters could be made more robust with introduction of typed parameters.
- It may be useful to add “mandatory parameters” to subqueries. That is, parameters that are **not** given a value during definition and **must** be defined on creation.
- Currently it is possible to both send and receive events on a stream, in the future we could restrict the direction of flow of events for streams inside `from` and `into`.
