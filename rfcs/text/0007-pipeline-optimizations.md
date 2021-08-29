- Feature Name: pipeline-optimizations
- Start Date: 2020-01-29
- Tremor Issue: [tremor-rs/tremor-runtime#0033](https://github.com/tremor-rs/tremor-runtime/issues/0033)
- RFC PR: [tremor-rs/tremor-rfcs#0011](https://github.com/tremor-rs/tremor-rfcs/pull/0011)

# Summary
[summary]: #summary

As part of tremors execution engine, we transform the logic described in trickle query scripts into Directed Acyclic Graph (DAG) based pipelines. Each operation, operator, or action inside the query gets represented as a node in this graph. Every event passed through tremor traverses this graph of operators depth first. When an event arrives at an operator, this operator can alter, discard, or route the event to influence which following subgraph ( or subgraphs ) the event traverses afterward.

The initial construction of the pipeline DAGs is naive and done in the most simplistic way possible to make extending/evolving it relatively painless during development. After the construction of the initial graph, it may undergo one or more transformations to optimize execution; for example, it may apply constant folding to migrate some runtime calculations to compile time where possible.

This RFC aims to discuss these transformations and more complex transformations.

As transformations may involve more than a single pass, and as tremors evolution may open new avenues for optimization, may introduce new domain languages, this RFC is not meant to be exhaustive but to refect the current and near-future state of optimizations.

# Motivation
[motivation]: #motivation

The executable pipeline is an integral part of tremor, quite literally every event that passes through it. This makes it a prime target for optimization as even small improvements, when gained on every event, sum up to significant gains. It is worth revisiting this topic regularly to see if additional cases present themselves.

## Problem case 1
[case-1]: #case-1

As part of constructing the initial DAG we insert what we call pass through operators. They allow us to simplify the trickle language by not requiring all operators to have a connection logic or addressable name as well as form the edges of our DAG.

Let us look at the following trickle script taken from the influx example in the docs and annotate it with passthrough operators and graph connections.

```trickle

# a passthrough[1] `in` is created
# a passthrough[2] `out` is created
# a passthrough[3] `err` is created

define tumbling window `10secs`
with
   interval = datetime::with_seconds(10),
end;

define tumbling window `1min`
with
   interval = datetime::with_minutes(1),
end;

# a passthrough[4] `normalize` is created
create stream normalize;

# a passthrough[5] `aggregate` is created
create stream aggregate;

define generic::batch operator batch
with
  count = 3000,
  timeout = 5
end;

create operator batch;

# the select operator is connected to the passthrough[1] `in`
# and connects to the passthrough[5] `aggregate`
select {
    "measurement": event.measurement,
    "tags": event.tags,
    "field": group[2],
    "value": event.fields[group[2]],
    "timestamp": event.timestamp,
}
from in
group by set(event.measurement, event.tags, each(record::keys(event.fields)))
into aggregate
having type::is_number(event.value); 


# the select operator is connected to the passthrough[5] `aggregate`
# and connects to the passthrough[4] `normalize`
select 
{
    "measurement": event.measurement,
    "tags": patch event.tags of insert "window" => window end,
    "stats": stats::hdr(event.value, [ "0.5", "0.9", "0.99", "0.999" ]),
    "field": event.field,
    "timestamp": win::first(event.timestamp), # we can't use min since it's a float
}
from aggregate[`10secs`, `1min`, ]
group by set(event.measurement, event.tags, event.field)
into normalize;

# the select operator is connected to the passthrough[4] `normalize`
# and connects to the operator `batch`
select {
  "measurement":  event.measurement,
  "tags":  event.tags,
  "fields":  {
    "count_{event.field}":  event.stats.count,
    "min_{event.field}":  event.stats.min,
    "max_{event.field}":  event.stats.max,
    "mean_{event.field}":  event.stats.mean,
    "stdev_{event.field}":  event.stats.stdev,
    "var_{event.field}":  event.stats.var,
    "p50_{event.field}":  event.stats.percentiles["0.5"],
    "p90_{event.field}":  event.stats.percentiles["0.9"],
    "p99_{event.field}":  event.stats.percentiles["0.99"],
    "p99.9_{event.field}":  event.stats.percentiles["0.999"]
  },
  "timestamp": event.timestamp,
}
from normalize
into batch;

# This select statement itself is optimised to a passthrough[6] that
# connects the operator `batch` with the passthrough[2] `out`
select event from batch into out;

# This select statement itself is optimised to a passthrough[7] that
# connects the passthrough[1] `in` with the passthrough[2] `out`
select event from in into out;
```

To visualize the above, we can draw the graph as following where items in square brackets are passthrough operators, items in round brackets are 'active' operators and arrows are connections between them, double arrows represent the edges.

```text
=> [in] -> (select 1) -> [aggregate] -> (select 2) -> [normalize] -> (select 3) -> (batch) -> [select 4] -> [out] =>
    `-------------------------------------------------[select 5]----------------------------------------------'
```

Other then connectivity, passthrough operators serve no direct value other than serving as a connection point. Looking at the example above, we can see that even a simple script like that can mean that an event traverses 6 passthrough operators and only 4 operators that affect the graph.

As Passthrough operators do not modify the event, nor do they affect how the event traverses the graph, it is possible to remove them from the graph without any impact on the function of the graph itself. In result, the above graph could be rewritten as:

```text
=> (select 1) -> (select 2) -> (select 3) -> (batch) =>
 `---------------------------------------------------'
```

# Drawbacks
[drawbacks]: #drawbacks

Concerning [Problem case 1](#case-1), we lose a one to one mapping between the script and the executable graph. It presents no further drawbacks.

# Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

Concerning [Problem case 1](#case-1), an alternative approach for this would be not to introduce some of the pass-throughs in the first place. While in the short term this would yield the same results, there is a benefit to create a first a more verbose and general form and then reduce it down. This additional step makes it easier to apply other optimizations in later iterations.

# Prior art
[prior-art]: #prior-art

- [Graph rewriting](https://en.wikipedia.org/wiki/Graph_rewriting)
- [Compiler optimizations](https://en.wikipedia.org/wiki/Optimizing_compiler)
- Internally we are using similar techniques of rewriting parts of the tremor-script AST as part of the optimization step.

# Future possibilities
[future-possibilities]: #future-possibilities

The topic of pipeline optimization is never-ending endeavour as there are always further optimizations to be done. In the future, this could take the form of integration and interaction between different operators, extending pipeline level optimizations or go all the way to introducing a compiler.

While those future possibilities might not be of direct concern for any case, it is important to keep them in mind to ensure optimizations done today do not block off possibilities in the future.
