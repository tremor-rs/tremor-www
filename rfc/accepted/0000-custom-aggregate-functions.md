# RFC Template (RFC Title goes here)

- Feature Name: custom-aggregate-functions
- Start Date: 2021-10-22
- Tremor Issue: [tremor-rs/tremor-runtime#0000](https://github.com/tremor-rs/tremor-runtime/issues/0000)
- RFC PR: [tremor-rs/tremor-rfcs#0000](https://github.com/tremor-rs/tremor-rfcs/pull/0000)

## Summary
[summary]: #summary

This RFC proposes to allow for defining userland aggregate functions in tremor-query. 

## Motivation
[motivation]: #motivation

For cases where aggregation other than what's provided in the standard library is needed, there are currently three ways of implementing that, but each of them has some serious disadvantages:
1. Implement the aggregation in Tremor itself - this does not always make sense, as the aggregation functions can often be very domain-specific, and not be usable of the specific use-case.
2. Use a script that iterates over the results of `aggr::win::collect_flattened(event)` - this uses high amounts of memory, which can be prohibitive for high event rates and/or big window sizes
3. Reimplement the windowing with a custom script, using `state` - this is generally complicated, error-prone and requires reimplementing things that Tremor already supports

## Guide-level Explanation
[guide-level-explanation]: #guide-level-explanation

Let's assume we'd like to create a custom function, that for records with string keys, and integer values, will merge the keys and sum the values, i.e. for the two messages:
1. `{"a": 1, "b": 7}`
2. `{"b": 2, "c": 3}`
The result will be `{"a": 1, "b": 9, "c": 3}`.
The end result that we'd like to achieve in terms of usage will be:

```
define tumbling window minute
with
  interval = core::datetime::with_seconds(60)
end;

select merge_records(event) from in[minute] into out;
```

To achieve this, we'll need to implement the aggregate function:
```
aggregate fn merge_records of
  # initialize the state, called at the beginning of a window, the lifetime of the state is until the results are emitted
  init() => 
    state = {}
  # called once for each event in the window        
  aggregate(state, event)  =>
    for event of
      case (key, value) =>
        match core::record::contains(state, key) of
          case false => let state[key] = value
          case _ => let state[key] = value + state[key]
        end
    end;
    state
  # this is called when two states are merged, the other state is in the variable called `other`
  merge(state, other) =>
    for other of 
      case (key, value) =>
        match core::record::contains(state, key) of
          case false => let state[key] = value
          default => let state[key] = value + state[key]
        end
    end;
    state
  # this is called at the end of the aggregation and must emit the result
  emit(state)
    state
end;
```

## Reference-level Explanation
[reference-level-explanation]: #reference-level-explanation

This could be implemented by creating an instance of a struct that implements `registry::TremorAggrFn`, and calls back to the script when the functions are called. This way of implementing the feature would be minimaly invasive and most likely require no changes in the runtime.

## Drawbacks
[drawbacks]: #drawbacks

As any other new syntax, this leads to additional complexity in the language. 

## Rationale and Alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

Alternatively similar results could be achieved by introducing the concept of lazily-evaluated streams, i.e. `aggr::win::collect_flattened` instead of an array would return a stream, which does not store the events in memory, instead the interation progresses as new events appear. This would require more significant runtime changes, and possibly adding new syntax (like lambdas) to allow for ergonomic manipulation of said streams (for example with functions like `map` or `accumulate`).

## Prior Art
[prior-art]: #prior-art

PostgreSQL allows users to define custom aggregate functions: https://www.postgresql.org/docs/current/xaggr.html

## Unresolved Questions
[unresolved-questions]: #unresolved-questions

- This is the first class-like object in the language. Is this syntax the best possible syntax? Should something more general be defined?

## Future Possibilities
[future-possibilities]: #future-possibilities

- To improve ergonomics, an operator that allows accessing record keys with a default value could be added (i.e. instead of doing the `match` on `core::record::contains`, the syntax could be along the lines of `state[key] = value + (state[key] ?? 0)`.