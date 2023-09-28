---
sidebar_position: 0
---
# Basics

This guide is a walk through of tremor basics. It is a starting point to learn
how to stream data into the system, process this data stream, and produce a
stream of synthetic events based on the processing of the original stream of
data.

The example is illustrative and a construction to introduce fundemanetals, but it
may be useful as a string point for more complex works.

This guide has a number of progressive steps, each building on the fundamentals
introduced in the previous step.

After following the steps in this guide, you will have a small but complete and
runnable tremor application.

The source for the code in this guide is available in [github](__GIT__/../code/basics).

## Topics

This guide introduces the following new concepts

* Passthrough
* Flows
* Connectors
* Pipelines
* Scripts
* Queries with `select`, and the `with` and `where` clauses
* Modules and the `use` statement for importing library functions, pipelines and connectors

## Passthrough

This is a very useful streaming operation that consumes data streams from a a source and
relays each received event to a destination or target downstream. It distributes each
received event from the source to the destination.

```tremor
# Passthrough query
select event from in into out;
```

We call this `passthrough` as the data events stream or __pass through__ without modification.

The processing and data sources and destinations are decoupled. These are connected together in [flow](#Flow)
statements.

### Flow

The `flow` statement encapsulates instances of `connector` and `pipeline` that can be interconnected to provide
a runnable embedded service complete with connectivity.

We begin our study from the outside, and define a flow called `main`.

```tremor
# Our main flow
define flow main
  # ... We define and create connectors and pipelines here
flow
end;
```
### Connectors

A `connector` is a way to establish streams of data and use them to provide a useful flow.

A very useful set of connectors that ship as a part of tremor are the standard input/output
or [`stdio`](../reference/connectors/stdio) connectors. These pipe the standard input, output and error streams from the
console to processors.

We use pre-packaged definitions in this example from the `tremor::connectors` module from the standard library.

:::note
The console connector is a configured instance of the `stdio` connector that uses the `separate` pre and postprocessor to make it line-based and the [`string` codec](../reference/codecs/string) to avoid any parsing of the input data.
:::

```tremor
# Our main flow
define flow main
flow
  # import the `tremor::connectors` module
  use tremor::connectors;
  
  # create an instance of the console connector
  create connector console from connectors::console;

    # ... We have a means to read/write line delimited JSON, but have yet to define any processing logic
end;
```

### Pipeline

Lastly, we need to define the processing logic for this `main` flow.


:::note
We could define passthrough ourselves as follows, but it is in common use, so available through the
standard library in `tremor::pipelines` and called `passthrough`:

```tremor title="troy/pipelines.troy"
define pipeline passthrough
pipeline
    select event from in into out;
end
```
:::

We use the definition provided by the standard library

```tremor
# Our main flow
define flow main
flow
  # import the `tremor::connectors` module
  use tremor::connectors;
  # import the `tremor::pipelines` module
  use tremor::pipelines;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the passthrough pipeline
  create connector passthrough from pipelines::passthrough;

  # ... We still `need` to interconnect our `console` and `passthrough` instances
end;
```

### Wiring

We now have all the components we need, a flow to host it all, a connector to read and write data, and a pipeline to process (or pass) the data. With that all in place, we need to wire those parts up. We can do that with `connect` in the flow.

:::note
   Connect allows connecting to different ports on connectors and pipelines. When omitted, ports default to `/out`  for the connection's source and to `/in` for the connection's target. We will explore this more in a later step. For now, we'll ignore ports.
:::

```tremor
# Our main flow
define flow main
flow
  # import the `tremor::connectors` module
  use tremor::connectors;
  # import the `tremor::pipelines` module
  use tremor::pipelines;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the passthrough pipeline
  create pipeline passthrough from pipelines::passthrough;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/passthrough;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/passthrough to /connector/console;
end;
```

### Deploying the flow

We have already used pre-defined pipelines and connectors and created instances of them. Flows are not much different. They have a definition and an instantiation phase. While we call the instantiating of pipelines and connectors `create`, for flows, we use `deploy` as it is the step where the theoretical configuration becomes actual running code.

```tremor
# Our main flow
define flow main
flow
  # import the `tremor::connectors` module
  use tremor::connectors;
  # import the `tremor::pipelines` module
  use tremor::pipelines;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the passthrough pipeline
  create pipeline passthrough from pipelines::passthrough;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/passthrough;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/passthrough to /connector/console;

end;
# Deploy the flow, so tremor starts it
deploy flow main;
```

That's it, you can fetch this file from [git](__GIT__/../code/basics/passthrough/main.troy) and run it via:


```bash
$ tremor run passthrough/main.troy
hello
hello
world
world

```

## Transformation

We now have a way to pass data in our system, moving it through it and looking at the result. Our result is relatively simple, the same as the input we have. Let us change that and make the whole thing a bit more interesting.

Our goal will be to make each entry a "sentence" by capitalizing the first letter and adding a period `.` or question mark to the end.

:::note
Tremor has handy utility modules for most data types that provide several functions to work with them, the [reference documentation] gives an overview of them.
:::

### Defining our pipeline

We've been using the `tremor::pipelines::passthrough` pipeline in the last step. It, as the name suggests, passes it through. So the first thing we need to do is replace this with our own. For simplicities sake, we'll start by replacing it with our pipeline. We will name this `main` as we will extend it to be more than a passthrough.

To do this we create a new files named `lib/pipelines.tremor` and use this pipeline in our flow.

:::note
   Pipelines, by default, use the ports `in` for input, `out` and `err` for outputs. As with `connect`, those definitions can be omitted as long as we use the standard. For details on defining your own ports, you can refer to the [reference documentation].
:::

```tremor title="lib/pipelines.tremor"

# define our main pipeline
define pipeline main
pipeline
  select event from in into out;
end;
```

```tremor title="main.troy"
# Our main flow
define flow main
flow
  # import the `tremor::connectors` module
  use tremor::connectors;
  # import the `tremor::pipelines` module
  use lib::pipelines;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the passthrough pipeline
  create pipeline main from pipelines::main;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/main;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/main to /connector/console;

end;
# Deploy the flow, so tremor starts it
deploy flow main;
```

### Transforming in the select body

Now we have our pipeline in which we will capitalize the text that's passed through the pipeline, [`std::string::capitalize`](../reference/stdlib/std/string#capitalizeinput) will do that for us, and we can use it right in the select statement we:

:::note
In select statements, you can do any transformation that's creating new data, but you can't do any mutating manipulations. Simplified, you can think that `let` is not allowed.
:::

```tremor title="lib/pipelines.tremor"
# define our own main pipeline
define pipeline main
pipeline
  # use the `std::string` module
  use std::string;
  # Capitalize the string
  select string::capitalize(event) from in into out;
end;
```

### Transforming in Scripts

Some transformations are a bit more complicated, and instead of the select body, we want a more elaborate script that makes the logic more readable.

:::note
The significant advantage of scripts is to allow more complex mutation, chained logic, and access to `state`. In this example, we'll not touch on all of them.
:::

So our goal will be to check if our sentence has punctuation. Otherwise, decide if we add a `.` or a `?`.

Scripts are a node in the pipeline, and we use `select` statements to connect them, the same way that we use `connect` to connect nodes of a flow.

To do this we, again define a new file `lib/scripts.tremor` 

:::note
   The script could be inlined in the pipeline and the pipeline in the flow, but the model we use here creates nicer to manage applications.
:::

```tremor title="lib/scripts.tremor"
# define our script
define script punctuate
script
  # Short circuit if we already end with a punctuation
  match event of
    case ~re|[.?!]$| => emit event
    case _ => null
  end;

  # Find the right punctuation by looking at the first wird of the last sentence
  # yes this is a poor heuristic!
  let punctuation = match event of 
    case ~ re|.*[.?!]?(Why\|How\|Where\|Who)[^.?!]*$| => "?"
    case _ => "."
  end;
  event + punctuation
end;
```

```tremor title="lib/pipeline.tremor"
define pipeline main
pipeline
  # use the `std::string` module
  use std::string;
  use lib::scripts;

  # Create our script
  create script punctuate from scripts::punctuate;

  # Wire our capitalized text to the script
  select string::capitalize(event) from in into punctuate;
  # Wire our script to the output
  select event from punctuate into out;
end;
```


### Running

Same as before we can test our code, you can fetch the finished file from [git](__GIT__/../code/basics/transform.troy).

```bash
$ TREMOR_PATH="$TREMOR_PATH:${PWD}/transform" tremor run transform/main.troy
hello
Hello.
why
Why?
```

## Filter

Aside from transformations, filtering is an integral part of what tremor can do to an event. We'll use this feature to allow users to type `exit` and have the application stop.

:::note
Stopping tremor is usually not something you'll want to do on a life server as it might impact other users, but it's a nice feature for an example like this.
:::

### Adding the `exit` connector.

We use the [`exit` connector](../reference/connectors/exit). This connector will stop the tremor instance on every event it receives.

We'll use a different port on the pipeline, the `exit` port, and wire this up to the `exit` connector.

We, however, stop short here from actually filtering just yet.

:::note
We can omit `in` and `out` as ports as that's what tremor defaults to. For `exit`, we have to be more specific.
:::

```tremor title="main.troy"
# Our main flow
define flow main
flow
  # import the `tremor::connectors` module
  use tremor::connectors;
  use lib::pipelines;

  # Define the exit connector
  define connector exit from exit;

  # create the exit connector;
  create connector exit;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the passthrough pipeline
  create pipeline main from pipelines::main;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/main;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/main to /connector/console;

  # connect the `exit` port of our pipeline to the exit connector
  connect /pipeline/main/exit to /connector/exit;

end;
# Deploy the flow, so tremor starts it
deploy flow main;
```

### Filtering out exit messages

The last thing left to do is filter out messages that read `exit` and forward them to the `exit` port instead of out.

We need to add the `exit` port to the `into` part of the `pipeline` definition, so it becomes available.

:::hint
For pipelines, we can omit `into` and `from`. If done, it is treated as `into out, err` and `from in`. Replacing one will **not add** to these ports but replace them, so if we want `out` and `exit` as ports, we have to write `into out, exit`.

`from` and `into` are independent. Overwriting one does not affect the other.
:::

Once that is done, we can add the filter logic. To do that, we create a new select statement with a `where event == "exit"` clause that will only forward events that read `exit` and add a `where event != "exit"` to our existing clause, forwarding the rest to the punctuate script.

```tremor title="lib/pipelines.tremor"
define pipeline main
# The exit port is not a default port, so we have to overwrite the built-in port selection
into out, exit
pipeline
  # Use the `std::string` module
  use std::string;
  use lib::scripts;

  # Create our script
  create script punctuate from scripts::punctuate;

  # Filter any event that just is `"exit"` and send it to the exit port
  select {"graceful": false} from in where event == "exit" into exit;

  # Wire our capitailized text to the script
  select string::capitalize(event) from in where event != "exit" into punctuate;
  # Wire our script to the output
  select event from punctuate into out;
end;
```

### Running

That all set, we can run our script as before, just this time, when entering `exit` tremor will terminate.

```bash
$ TREMOR_PATH="$TREMOR_PATH:${PWD}/filter" tremor run filter/main.troy
hello
Hello.
why
Why?
exit
```

[reference documentation]: ../language
