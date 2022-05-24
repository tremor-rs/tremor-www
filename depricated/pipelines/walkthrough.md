# Walkthrough

In this section we walk through increasingly complex Tremor Pipeline programming examples, introducing key concepts as we progress.

## Overview


Pipelines are compiled into DAGs to describe event processing graphs in
the Tremor runtime.

The most basic pipeline possible is:

```trickle
define pipeline passthrough
  # A basic passthrough query pipeline
  select event from in into out;
end;
```

The `event` keyword selects the event from the standard input stream `in`
and passes it through unchanged to the standard output stream `out`.

Pipelines are compiled and optimised and data is streamed though the graph formed by the select queries and operators. Data can be passed through, transformed, filtered, aggregated, branched or combined to form continuous stream processing algorithms.

Like other event processing systems Tremor pipelines _invert_ the relationship between
query and data when compared to normal RDBMS SQL languages. Instead of running a
dynamic query against static in memory or disk persisted data, we compile and
optimise queries and stream near real-time data through each query.

Data can be ingested from the outside world via the 'in' standard stream.
Data can be produced to the outside world via the 'out' standard stream.
Errors can be processed through the 'err' standard stream.

These three primitives are analogous to the `stdin`, `stdout` and `stderr` streams
in UNIX-like systems. These can be chained or interconnected via connecting multiple
statements together to form a directed acyclic graph.

We can branch inputs using `where` and `having` clauses as filters to logically
partition streams into independent processing streams.

In the below example we partition events by their `seq_num` field. If the number
is even, we branch the corresponding events into a stream named `evens`. If the
number is odd, we branch to a stream named `odds`.

The logical inverse of branching is to unify or union streams together, this operation
is also supported via the select operation and is demonstrated below. We combine
the `evens` and `odds` streams into the standard output stream

```trickle
# create private intermediate internal streams
create stream evens;
create stream odds;

# branch input into even/odd sequenced events using where clause
select { "even": event } from in where (event.seq_num %2 == 1) into evens;
select { "odd": event } from in where (event.seq_num %2 == 0) into odds;

# combine / union evens and odds into standard out stream
select event from evens into out;
select event from odds into out;
```

We can test this with a json event using the `tremor` command line tool

```json
{ "seq_num": 4, "value": 10, "group": "horse" }
```

Assuming the trickle query is stored in a file called `evenodd.trickle` with the sample event
in a file called `data.json`

```bash
$ tremor run evenodd.trickle -i data.json
```

The command line tool will inject all events from the file provided by the `-i` argument and we would
expect to see output from the tool as follows:

```bash
{"odd": {"seq_num": 4, "value": 10, "group": "horse"}}
```

## Scripts and Operators

Here's the logic for an entire backpressure algorithm that could be introduced as
a proxy between two systems, implemented by using a builtin operator called [`qos::backpressure`](../../reference/operators.md#qosbackpressure):

```trickle
define operator bp from qos::backpressure
with
    timeout = 10000,
    steps = [ 1, 50, 100, 250, 750 ],
end;

create operator bp from bp;
select event from in into bp;
select event from bp into out;
```

A slightly more complex example that uses both operators and the tremor scripting language
with the query language all together:

```tremor
define operator kfc from grouper::bucket;

define script categorize
script
  let $rate = 1;
  let $class = event.`group`;
  { "event": event, "rate": $rate, "class": $class };
end;

create operator kfc from kfc;

# where script definition and instance name are the same, we can
# omit the from clause in operator and script 'create' statements
create script categorize;

# Stream ingested data into categorize script
select event from in into categorize;

# Stream scripted events into kfc bucket operator
select event from categorize into kfc;

# Stream bucketed events into out stream
select event from kfc into out;
```

Operators are defined as `<module>::<name>` in the
context of an operator definition clause. Operators, like script definitions can take arguments.

Definitions in tremor are non-executing. They should be considered as templates or specifications.

In the query language, any `define` clause creates specifications, possibly with arguments for
specialization. They are typically incarnated via the `create` clause. Anything that is `create`ed
will form a stream or node in the query graph - these _do_ consume memory and participate in a
pipeline query algorithm.

So in the above example, the `categorize` script and the `categorize` node have both a definition
or specification **and** an instance node that participates in the graph at runtime. It is often
convenient to use the same name where there is only one instance of an operator of a given type.

## Building Query Graph Algorithms

Data streams can be branched and combined in the trickle query language via
the select statement. The resulting graphs must be acyclic with no direct or
indirect looping cycles.

