- Feature Name: `script` operator enhancements
- Start Date: 2021-04-28
- Tremor Issue: [tremor-rs/tremor-runtime#960](https://github.com/tremor-rs/tremor-runtime/issues/960) [tremor-rs/tremor-runtime#933](https://github.com/tremor-rs/tremor-runtime/issues/933)
- RFC PR: [tremor-rs/tremor-rfcs#0000](https://github.com/tremor-rs/tremor-rfcs/pull/0000)

# Summary

[summary]: #summary

This RFC aims to add quality of life improvements to the script operator. As it exists today, the operator works well for simple use-cases but-in light of the growing number of complex pipelines and the use of patterns like the configurator pattern it is cumbersome. When first implemented, `state` didn't exist, and ports were not used. Those are the areas of improvement this RFC tackles.

The improvements focus around handling of state and tackle two common cases:

1) decupling the control plane logic (setting / modifying state) and the data plane logic (using state to make decisions)
2) seeding the state with a value

# Motivation

[motivation]: #motivation

To demonstrate we will give a motivating example if the reduction of complexity for a simplified algorithm for distributed loadbalancing:

The original code has to contend with not knowing what ports data comes in and having to verify the initalization of state on every event.

```trickle
define grouper::bucket operator bucketing;

define script lb
with
  rate = 0,
  peer = {
    "host": "127.0.0.1",
    "port": 4242
  },
  self = {
    "host": "127.0.0.1",
    "port": 4243
  }
script
  # If the state isn't intialized, do this now
  match absent state.rate of
    case true => let state = {"quota": args.quota, "rate": 1.0 }
    default => null
  end;

  match event of
    # we got a delta message in reply that tells us how to adjust our quota
    case %{ present delta } =>
      let state.quota = state.quota + event.delta
    # we got a compare message asking us to figure out the adjustment required
    # apply it, and send it over to the requester
    case %{ present cmp } =>
      let delta = state.quota * (state.rate - event.rate),
      let state.rate = state.rate - delta,
      let $udp = event.udp,
      emit {"delta": delta} => "udp"
    case %{ present rate } =>
      let state.rate = event.rate,
      drop
    # we are asked to propage our rate
    case %{ id == "proagate" } =>
      emit { "quota": state.quota } => "config"
    # Tick event for periodic checks
    case %{ id == "tick" } =>
      let $udp = args.peer,
      emit {"cmp": state.quota, "udp": args.self } => "udp"
    case _ => emit => "dbg"
  end
end;


define script rate
script
  match event of
    case %{tags ~= %{node == "bucketing", port == "out", action == "pass"} } => let state.pass = event.fields.count
    case %{tags ~= %{node == "bucketing", port == "out", action == "overflow"} } => let state.overflow = event.fields.count
    case _ => drop
  end;

  match state of
    case %{ present pass, present overflow } when state.pass + state.overflow > 0 => {"rate": state.pass / (state.pass + state.overflow)}
    case _ => drop
  end
end;


define script apply
script
  let rate = match state of
    case null => let state = 0
    case _ => null
  end;
  match event of
    case %{ present quota } => let state = event.quota, drop
    case _ => null
  end;
  let $class =  "default";
  let $rate = state
end;

create operator bucketing;
create script apply;
create script rate;
create script lb;


# main data flow
select event from in into apply;
select event from apply into bucketing;
select event from bucketing into out;

# rate updates from bucketing metrics
select event from bucketing/metrics into rate;
select event from rate into lb/rate;

# rate updates from the load balancing logic
select event from lb/config into apply/config;

# udp coms for the load balancer
select event from in/udp into lb/udp;
select event from lb/udp into lb/out;
```

```trickle
define grouper::bucket operator bucketing;

define script lb
with
  rate = 0,
  peer = {
    "host": "127.0.0.1",
    "port": 4242
  },
  self = {
    "host": "127.0.0.1",
    "port": 4243
  }
state
  {"quota": args.quota, "rate": 1.0}
script from "udp"
  match event of
    case %{ present delta } =>
      let state.quota = state.quota + event.delta,
      drop
    # we got a compare message asking us to figure out the adjustment required
    # apply it, and send it over to the requester
    case %{ present cmp } =>
      let delta = state.quota * (state.rate - event.rate),
      let state.rate = state.rate - delta,
      let $udp = event.udp,
      emit {"delta": delta} => "udp"
  end;
# rate update event
script from "rate"
  let state.rate = event;
  drop
# propagation tick to send current quota to new
script from "propagate"
  emit { "quota": state.quota } => "config"
script from "tick"
  let $udp = args.peer;
  emit {"cmp": state.quota, "udp": args.self } => "udp"
script
  emit => "dbg"
end;

define script rate
state
  {}
script
  match event of
    case %{tags ~= %{node == "bucketing", port == "out", action == "pass"} } => let state.pass = event.fields.count
    case %{tags ~= %{node == "bucketing", port == "out", action == "overflow"} } => let state.overflow = event.fields.count
    case _ => drop
  end;

  match state of
    case %{ present pass, present overflow } when state.pass + state.overflow > 0 => state.pass / (state.pass + state.overflow)
    case _ => drop
  end
end;

define script apply
state  0
script for "config"
  let state = event;
  drop
script
  let $class =  "default";
  let $rate = state;
  event
end;

create operator bucketing;
create script apply;
create script rate;
create script lb;

# main data flow
select event from in into apply;
select event from apply into bucketing;
select event from bucketing into out;

# rate updates from bucketing metrics
select event from bucketing/metrics into rate;
select event from rate into lb/rate;

# rate updates from the load balancing logic
select event from lb/config into apply/config;

# udp coms for the load balancer
select event from in/udp into lb/udp;
select event from lb/udp into lb/out;

# ticks
select event from in/tick into lb/tick;
select event from in/propagate into lb/propagate;
```

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

This introduces two new parts to the to the seelct statement.

## `state`

The `state` section is introduced as an optional section to provide an initial state. One alternative would be calling it `init` however using that would introduce a new keyword and by that break backwards compatibility and reduce the number of possible idents.

The content of `state` would get executed as part of the initialisation and then set once before the script is executes for the first time.

## `script for "<port>"`

The addition of `script for "<port>"` allows to define different script path for the different ports connected to the script operator.

They would share a `state` but not share local variables or constants. This is an extremely handy pattern in scenarios like the configurator pattern where one set of messages is used to adjust state and the other set of messages being processas as events.

In other words, it allows seperating control and data plane of a script.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

## `state`

This will get executed at initiation time to take `args` into acount. Then never be executed again
in a running pipeline.

The `state` section will be optional.

This means the addition is backwards compatible.

## `script for "<port>"`

This would basically be a loopup table for `port` -> `script` with an additional "catch all" `script`
that gets executed if no port is specified.

All `script for` sections will be optional, `script` itself however madatory.

This means the addition is backwards compatible.

# Drawbacks

[drawbacks]: #drawbacks

Drawbacks are addition of additional language constructs and introducing the usage of input ports for the first time which might add complexity for users.

On the other hand as both additions are optional thos complexity is hidden unless explicitly used.

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

One alternative to the `state` keyword could be replaced by `init` which might be more intuitive but would add another keyword and break backwards compatibility by that.

Alternatives for `script for` would be adding a `port` keyword to access the port or a `system::port()` function. The addition of the `port` keyword would introduce the same backwards compatibility issues as the `init` keywoard so is likely not a good idea. However adding the `system::port()` (or a differently named) funciton would be possible in addition without negative impact.

# Prior art

[prior-art]: #prior-art

`init` or `state` pretty much has prior art in most of any language that uses constructors for data.

Since `select from "<port>"` is rather specific to the tremor runtime it isn't inspired by any prior art.

# Unresolved questions

[unresolved-questions]: #unresolved-questions

None at this point.

# Future possibilities

[future-possibilities]: #future-possibilities

A `system::port()` (or equivalent) function would be a good addition.

Another possibility this opens is to allow analyzing different script path and their respective ports. that way we can make a more detailed cycle analysis on a script that has a control plane and a data plane that do not overlap.

For example:

```
define script control_and_data
script for "control"
  let state = sevent;
  drop
script for event
  // do something with event
end;

select event from  control_and_data/metrics to control_and_data/control;
select event from in into out;
```

Here we could determine that the "control" section never emits data, so no loop is created.
