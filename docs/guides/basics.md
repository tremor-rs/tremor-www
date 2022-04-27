# Tremor Basics

This guide will walk you through the tremor basics, it'll be a starting point to learning how to get data into the system, work with this data and get it out again.

The example is completely synthetic and desiged to teach fundamentals but it can be used as a starting point for more complex systems.

We will go through this guide in steps, each building on the previous one but each step being a complete unit in itself - this will allow you to try and test at each step of the way, pause and continue another time.

At the end we'll have a little tremor application in which you can input text, it will capitalize and punctuate it and exit on command.

Runnable examples configuration for each of the steps is available [here](__GIT__/../code/basics).

## Passthrough


The simple most configuration in tremor is what we call `passthrough` as it takes data from one end passes it through and puts it out the other end.

The `in` and `out` is handle with what we call [connectors](TODO), the pocessing or passing is done by a [pipeline](TODO) and the whole configuration wrapped in a [flow](TODO).

### Flow

So lets start from the outside in, and define a flow, we'll call this flow `passthrough` and it'll do nothing to start.

```troy
# Our main flow
define flow main
flow
end;
```

### Connectors

With that lets start filling it, we will use `STDIN` and `STDOUT` for this example to read and write data. For that we have a #[`stdio` connector](TODO) that you could use. But since we know that it's a human reading and writing the text, we will instead use the pre-configured  #[`console` connector](TODO). The `console` connector can be found in the `troy::connectors` module of the standard library

:::note
The console connector is a configured instance of the `stdio` connector that uses the #[`separate` pre and postprocessor](TODO) to make it line based and the [`string` codec](TODO) to avoid any parsing of the input data.
:::

```troy
# Our main flow
define flow main
flow
  # import the `troy::connectors` module
  use troy::connectors;
  
  # create an instance of the console connector
  create connector console from connectors::console;
end;
```

### Pipeline

Now we have the connector that lets us recive and send data, next we need a pipeline to pass the data through.

We could write our own pipeline, but since `passthrough` pipelines are somewhat common we already have it defined in the `troy::pipelines` module, so we will be using that.

:::note
The definition of `troy::pipelines::passthrough` is just this:
```troy
define pipeline passthrough
pipeline
    select event from in into out;
end
```
:::

```troy
# Our main flow
define flow main
flow
  # import the `troy::connectors` module
  use troy::connectors;
  # import the `troy::pipelines` module
  use troy::pipelines;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the passthrough pipeline
  create connector passthrough from pipelines::passthrough;
end;
```


### Wiring

We now have all the components we need, a flow to host it all, a connector to read and write data and a pipeline to process (or pass) the data. With that all in place we need to wire those parts up, we can do that with `connect` in the flow.

:::note
   Connect allows connecting to different ports on connectors and pipleins, when omitted the ports default to `/out`  for the source of the connection to `/in` for the target of the connection. We will explore this more in a later step, for now we'll just ignore ports
:::

```troy
# Our main flow
define flow main
flow
  # import the `troy::connectors` module
  use troy::connectors;
  # import the `troy::pipelines` module
  use troy::pipelines;

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

We have already used pre-defined pipelines and connectors, and created instances of them. Flows are not much different, they have a definition and a instanciation phase. While the instanciating of pipelines and connectors is called `create`, for flows it is called `deploy` as it is the step where the theoretical configuration becomes acutal running code.

```troy
# Our main flow
define flow main
flow
  # import the `troy::connectors` module
  use troy::connectors;
  # import the `troy::pipelines` module
  use troy::pipelines;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the passthrough pipeline
  create pipeline passthrough from pipelines::passthrough;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/passthrough;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/passthrough to /connector/console;

end;
# Deploy the flow so tremor starts it
deploy flow main;
```

That's it, you can fetch this file from [git](__GIT__/../code/basics/passthrough.troy) and run it via:


```bash
$ tremor run passthrough.troy
hello
hello
world
world

```

## Transformation

We now have a way to passing data in our system, moving it through it and look at the result. Right now our result is rather simply the same as the input we have, lets change that and make the whole thing a bit more interesting.

Our goal will be to make each entry a "setnence" by capitalizing the frist letter and adding a period `.` or questionmark to the end.

:::note
Tremor has handy utility modules for most data types that provide a number of functions to work with them, the [reference documentation](TODO) gives a overfiew of them.
:::

### Defining our own pipeline

In the last step we've been using the `troy::pipelines::passthrough` pipeline, it, as the name suggests just passit it through. So the first thing we need to dois replacing this with our own, for simplicities sake we'll start with replacing it with our own pipeline, we will name this `main` as we will extend it to be more then a passthrough.

:::note
   Pipelines, by default use the ports `in` for input, `out` and `err` for outputs, just as with `connect` thos definitions can be omitted as long as the standard is used. For details on how to define your own ports you can refere to the [reference documentation](TODO).
:::

```troy
# Our main flow
define flow main
flow
  # import the `troy::connectors` module
  use troy::connectors;

  # define our own main pipeline
  define pipeline main
  pipeline
    select event from in into out;
  end;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the main pipeline
  create pipeline main;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/main;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/main to /connector/console;

end;
# Deploy the flow so tremor starts it
deploy flow main;
```

### Transforming in the select body

Now we have our own pipeline in which we will capitalize the text that's passed through the pipeline, [`std::string::capitalize`](TODO) will do that for us, and we can use it right in the select statement we:

:::note
In select statements you can do any kind of transformation that's creating new data but you can't do any mutating manipulations. Simplified you can think abouit it that `let` is not allowed.
:::

```troy
# Our main flow
define flow main
flow
  # import the `troy::connectors` module
  use troy::connectors;

  # define our own main pipeline
  define pipeline main
  pipeline
    # use the `std::string` module
    use std::string;
    # Capitalize the string
    select string::capitalize(event) from in into out;
  end;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the main pipeline
  create pipeline main;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/main;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/main to /connector/console;

end;
# Deploy the flow so tremor starts it
deploy flow main;
```


### Transforming in Scripts

Some transformations are a bit more complicated and instead of the select body we want a more elaborate script that makes the logic more redable.

:::note
The big advantage scripts give is alowing more complex mutation, chained logic and access to `state`. In this example we'll not touch on all of them.
:::

So our goal will be to check if our setnence already has a tailing punctuation, and if not decide if we add a `.` or a `?`.

Scripts are node in the pipeline and we use `select` statements to connect them, the same way that we use `connect` to connects nodes of a flow

```tremor
# Our passthrough flow
define flow main
flow
  # import the `troy::connectors` module
  use troy::connectors;

  # define our own main pipeline
  define pipeline main
  pipeline
    # use the `std::string` module
    use std::string;

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

    # Create our script
    create script punctuate;

    # Wire our capitailized text to the script
    select string::capitalize(event) from in into punctuate;
    # Wire our script to the output
    select event from punctuate into out;
  end;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the main pipeline
  create pipeline main;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/main;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/main to /connector/console;

end;
# Deploy the flow so tremor starts it
deploy flow main;
```


### Running

Same as before we can test our code, you can fetch the finished file from [git](__GIT__/../code/basics/transform.troy).

```bash
$ tremor run transfor.troy
hello
Hello.
why
Why?
```

## Filter

Aside of transformations filtering is an importan part of what tremor can do to event is filtering and routing. We'll use this feature to allow users to type `exit` and have the application stop.

:::note
Stopping tremor is usually not something you'll want to do on a life server as it might impact other users, but it's a nice feature for a example like this.
:::

### Adding the `exit` connector.

To terminate tremor programatically we use the [`exit` connector](TODO), this connector will stop the tremor isntance on every event it receives.

We'll also use a different port on the pipleine for this, the `exit` port, and wire this up to the `exit` connector.

We however stop short here from actually filtering just yet.

:::note
As mentioned before we can ommit `in` and `out` as ports as that's what tremor defaults to, for `exit` we have to be more specific.
:::

```troy
# Our main flow
define flow main
flow
  # import the `troy::connectors` module
  use troy::connectors;

  # define our own main pipeline
  define pipeline main
  pipeline
    # use the `std::string` module
    use std::string;

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

    # Create our script
    create script punctuate;

    # Wire our capitailized text to the script
    select string::capitalize(event) from in into punctuate;
    # Wire our script to the output
    select event from punctuate into out;
  end;
  # Define the exit connector
  define connector exit from exit;

  # create the exit connector;
  create connector exit;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the passthrough pipeline
  create pipeline main;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/main;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/main to /connector/console;

  # connect the `exit` port of our pipeline to the exit connector
  connect /pipeline/main/exit to /connector/exit;

end;
# Deploy the flow so tremor starts it
deploy flow main;
```

### Filtering out exit messages

The last thing left to do is filter out messages that read `exit` and forward them to the `exit` port instead of out.

To do that we need to add the `exit` port to the `into` part of the `pipeline` definition so it becomes available.

:::hint
For pipelines, `into` and `from` can be omitted, if done so it is treated as `into out, err` and `from in`. Replacing one will **not add** to this ports but replace them so if we want `out` and `exit` as ports we have to write `into out, exit`.

`from` and `into` are indepandant, overwriting one does not affect the other.
:::

Once that is done we can add the filter logic. To do that we create a new select statement with a `where event == "exit"` clause that will only forward events that read `exit` and add a `where event != "exit"` to our existing clause, forwarding the rest to the punctuate script.

```troy
# Our main flow
define flow main
flow
  # import the `troy::connectors` module
  use troy::connectors;

  # define our own main pipeline
  define pipeline main
  # the exit port is not a dafault port so we have to overwrite the built in port selection
  into out, exit
  pipeline
    # use the `std::string` module
    use std::string;

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

    # Create our script
    create script punctuate;

    # filter eany event that just is `"exit"` and send it to the exit port
    select {"graceful": false} from in where event == "exit" into exit;

    # Wire our capitailized text to the script
    select string::capitalize(event) from in where event != "exit" into punctuate;
    # Wire our script to the output
    select event from punctuate into out;
  end;
  # Define the exit connector
  define connector exit from exit;

  # create the exit connector;
  create connector exit;

  # create an instance of the console connector
  create connector console from connectors::console;

  # create an instance of the passthrough pipeline
  create pipeline main;

  # connect the console (STDIN) to our pipeline input
  connect /connector/console to /pipeline/main;

  # then connect the pipeline output to the console (STDOUT)
  connect /pipeline/main to /connector/console;

  # connect the `exit` port of our pipeline to the exit connector
  connect /pipeline/main/exit to /connector/exit;

end;
# Deploy the flow so tremor starts it
deploy flow main;
```

### Running

That all set we can run our script as before, just this time when entering `exit` tremor will terminate.

```bash
$ tremor run transfor.troy
hello
Hello.
why
Why?
exit
```