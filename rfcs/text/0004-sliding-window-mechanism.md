- Feature Name: rfc_0004_sliding_window_mechanism
- Start Date: 2020-01-27
- Issue: [tremor-rs/tremor-rfcs#0007](https://github.com/tremor-rs/tremor-rfcs/issues/7)
- RFC PR: [tremor-rs/tremor-rfcs#0008](https://github.com/tremor-rs/tremor-rfcs/pull/8)

# Summary
[summary]: #summary

The tremor-query language currently supports temporal window processing based on a
provided system ( wall ) clock or data-driven intervals. Currently, however, the only
supported windowing style in `select` statements are tumbling.

There is no mechanism for tunbling windows where there may be multiple simultaneous
(overlapping) windows. The sliding window mechanism corrects this.

This RFC addresses these limitations by introducing a `sliding window` mechamism
that can be configured with a number of steps.

# Motivation
[motivation]: #motivation

The tremor-query language cannot currently easily define windowing mechanics such
as pair-wise comparisons or sliding data-driven windows that captures 'the last
seconds worth' of data that update on an event by event basis.

Sliding windows occur frequently in event processing algorithms and their addition
to tremor-query is a natural extension to the language.

# Guide-level explanation
[guide-level-explanation]: #guide-level-explanation

Definition of a simple sliding window of step size 2
```trickle
define sliding window pairs
with
  size = 2,
end;
```

Application of  the `pairs` window in a `select` statement

```trickle
select {
  "window": window,
  "count": stats::count(),
  "of": win::collect(event),
}
from in[pairs]
into out;
```

Sliding windows should work with tilt frames:

```trickle
select {
  "window": window,
  "count": stats::count(),
  "of": win::collect(event),
}
from in[sliding_pairs, tumbling_pairs, tumbling_triples, sliding_quads]
into out;
```

An interval based sliding window of duration 1 second:

```trickle
define sliding window last_second
with
  interval = datetime::with_seconds(1),
end;
```

The addition of a sliding window mechanism is a fairly cosmetic language change
but a fairly significant change to runtime facililities in window processing
semantics and mechanics, grouping mechanism, tilt framing and may involve other
enhancements or changes in order to manage memory pressure optimally.

This RFC does not concern itself with implementation specifics.

# Reference-level explanation
[reference-level-explanation]: #reference-level-explanation

None.

# Drawbacks
[drawbacks]: #drawbacks

Sliding window mechanism uses relatively more memory when compared with tumbling windows
and this should feature clearly in documentation and examples.

# Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

As described in the [summary](#summary).

# Prior art
[prior-art]: #prior-art

Sliding windows are a [common](https://www.researchgate.net/figure/Sliding-Window-in-CEP_fig2_283199451) feature in CEP/ESP and aggregation systems.

# Unresolved questions
[unresolved-questions]: #unresolved-questions

This RFC does not specify internals or implementation which is left to the
implementor. The motiviating example should be sufficient to drive a suitable
implementation.

# Future possibilities
[future-possibilities]: #future-possibilities

None known at this time.
