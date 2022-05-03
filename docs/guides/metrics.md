# Metrics

One case in which tremor can be deployed is to work with metrics. Not as a store but as a preprocessor, aggregator, and filter for metrics stores.

In this guide, we'll see how to use tremor for this. We'll set up an example where tremor batch, aggregates, and then forwards metrics. In addition we'll take a look at tremors own metrics.

:::note
   This example expects that you have some knowledge of tremor or went through the [basics guide](basics). Concepts explained there would not be explained again here.

   In addition, we use `docker compose` for this guide as it requires additional software, and we want to avoid you having to install and configure a bunch of other services. Some familiarity with this is expected as we will not explain the details of this.
:::

All code for this guide can found [on github](__GIT__/../code/metrics/).


## Topics

This guide introduces the following new concepts

* codecs
* Post- and Preprocessors
* Connector configuraiton
* pipeline operators
* streams
* aggregation
* time based windows
* tremors internal metrics

## Foundation

Let us start with the basic deployment:

* influxdb for storage
* chronograph for display
* telegraf as an agent to collect some data
* tremor for aggregation and filtering

```
telegraf -udp-> tremor -http-> influxdb -> chronograf -> YOU!
```

The docker-compose file for this is [here](__GIT__/../code/metrics/basic.yaml).


### UDP Server

Something new here is that we fully define our connectors instead of using a canned connector that was pre-defined.

For the input, we use a [`udp_server`](../reference/connectors/UDP.MD) connector. In the `with` clause, we can pass in the configuration.

Here are the fields of interest we have not discussed before.

`codec` is an option that can be passed to (nearly) all connectors, and it defines how data that arrives over this connection is being decoded. In our case we use [`influx`](../reference/codecs/influx.MD) to decode the influxdb line protocol.

`preprocessors`, as well, is an option that can be passed to (nearly) all connectors. Preprocessors are used to perform some kind of processing on the byte stream that the connector provides. In our case, we use [`separate`](../reference/preprocessors/separate.MD). This preprocessor will separate the byte stream with a given character or byte, by default, the `\n` newline.

:::note
   Some connectors provide structured output instead of a byte stream. Those connectors can't be given a `codec`, `preprocessors` or `postprocessor` - after all, their output is already well defined.
::::

The `config` section holds a configuration that is specific to the connector type selected. In this case, since we use the [`udp_server`](../reference/connectors/udp.md), we only have to specify the `URL` we want to listen on.

With this, we get:

```troy
define flow metrics
flow
  # define the udp server
  define connector upd_in from udp_server
  with
    # define the codec we use, in this case `influx` for the influx wire protocol
    codec = "influx",
    # define the preprocessors, we use separate to seperate events by lines
    preprocessors = ["separate"],
    # configure the connector itself, we listen to `0.0.0.0` on port `4242`
    config = {
      "url": "0.0.0.0:4242",
    }
  end;
end;
```

### HTTP Client

On the other side we use a [`http_client`](../reference/http.md). Since influxdb does not have a custom transport we are not forced to implement a `influx` connector. Instead we can use the [`influx` codec](../reference/codecs/influx.md) and a http or udp connectors.

:::info
   Connector naming follows a scheme here. Generally, something is named `server` if it accepts connections and `client` if it initiates connections.
   While there is a correlation between clients writing and servers reading, this is incidental and not a rule. A `client` that connects could very well be reading and not a writing connector.
:::

Our connector config here is slightly more elaborate. In addition to the `URL`, defining the target to write to, we also have a `headers` map that defines the HTTP headers. This demonstrates nicely that more complex configurations are possible.

```troy
define flow metrics
flow
  # define the udp server
  define connector upd_in from udp_server
  with
    # define the codec we use, in this case `influx` for the influx wire protocol
    codec = "influx",
    # define the preprocessors, we use separate to seperate events by lines
    preprocessors = ["separate"],
    # configure the connector itself, we listen to `0.0.0.0` on port `4242`
    config = {
      "url": "0.0.0.0:4242",
    }
  end;
  
  # define our http client
  define connector influx_out from http_client
  with
    # we use the influx codec here as well
    codec = "influx",
    # configure the endpoint we're writing to
    config = {
      "url": "http://influxdb:8086/write?db=tremor",
      # We use a custom header to identify that we're tremor
      "headers": {"Client": ["Tremor"]}
    }
  end;
end;

deploy flow metrics;
```

### Pipeline, wiring up and running

As in the basics tutorial, we're going to use the `passthrough` pipeline from the `troy::pipelines` module. If you went through the [basics guide](basics.md), this is the same as before.

```troy
define flow metrics
flow
  # import the pipeline module
  use troy::pipelines;
  # define the udp server
  define connector upd_in from udp_server
  with
    # define the codec we use, in this case `influx` for the influx wire protocol
    codec = "influx",
    # define the preprocessors, we use separate to seperate events by lines
    preprocessors = ["separate"],
    # configure the connector itself, we listen to `0.0.0.0` on port `4242`
    config = {
      "url": "0.0.0.0:4242",
    }
  end;
  
  # define our http client
  define connector influx_out from http_client
  with
    # we use the influx codec here as well
    codec = "influx",
    # configure  the endpoint we're writing to
    config = {
      "url": "http://influxdb:8086/write?db=tremor",
      # We use a custom header to identify that we're tremor
      "headers": {"Client": ["Tremor"]}
    }
  end;

  # Create the UDP server
  create connector upd_in;

  # Create the HTTP client
  create connector influx_out;

  # Create our pipeline
  create pipeline passthrough from pipelines::passthrough;

  # Connect the udp server to the pipeline
  connect /connector/upd_in to /pipeline/passthrough;
  # Connect the pipeline to the inflix client
  connect /pipeline/passthrough to /connector/influx_out;

end;

# start our 
deploy flow metrics;
```

Now with taht set you can grab [the entire config from github](__GIT__/../code/metrics/) and start it with `docker-compose -f  basic.yaml up`.

The chronograf ui can be found at (`http://localhost:8888`)[http://localhost:8888].

You can look at 

## Batching

Tremor processes events one by one, meaning that each metric is considered it's own event. The upside of this is that how events arrive, if it's one event per UDP message or 100 makes no difference. The downside is that InfluxDB requires events to be submitted in batches to maintain performance.

Since InfluxDB isn't the only destination that benefits from events being batched, tremor provides a [batching operator](../queries/operators#genericbatch).

:::note
   Batching using the [batching operator](../queries/operators#genericbatch) is handled inside of the connector, HTTP for example will combine a batch into a single request, but different connectors might handle this differently.
:::

### Adding the Batch operator

Operators are small pices of logic that are written in rust, they can be put inside of a pipeline to perform certain actions. In our example we use the batch operator.

Their use is quite similar to what you know already from piepelines and connectors, they first are defined with a set of configuration prameters, then are created to be used.

We then use `select` to wire it up in the pipeline.

For our operator we use a a maximum of `3000` events and a maximum delay of `5s`.

Note that we select from `in` into `batch` and from `batch` into `out`, wiring up the event chain.

We also need to update our HTTP Client to use a postprocessor, namely the `seperate` one to join batch elements back together with newlines.

```troy
define flow metrics
flow

  # define the udp server
  define connector upd_in from udp_server
  with
    # define the codec we use, in this case `influx` for the influx wire protocol
    codec = "influx",
    # define the preprocessors, we use separate to seperate events by lines
    preprocessors = ["separate"],
    # configure the connector itself, we listen to `0.0.0.0` on port `4242`
    config = {
      "url": "0.0.0.0:4242",
    }
  end;


  # define our http client
  define connector influx_out from http_client
  with
    # we use the influx codec here as well
    codec = "influx",
    # define the postprocessor, we use separate to seperate events by lines
    postprocessor = ["separate"],       
    # configure  the endpoint we're writing to
    config = {
      "url": "http://influxdb:8086/write?db=tremor",
      # We use a custom header to identify that we're tremor
      "headers": {"Client": ["Tremor"]}
    }
  end;

  # define our metrics pipeline to batch metrics
  define pipeline metrics
  pipeline
    # define our batch operator.
    # A batch will collect up to 3000 events, but never wait more then 5 seconds
    # before emitting.
    define operator batch from generic::batch
    with
      count = 3000,
      timeout = 5
    end;

    create operator batch;

    select event from in into batch;
    select event from batch into out;
  end;

  # Create the udp server
  create connector upd_in;

  # Create the http client
  create connector influx_out;

  # Create our pipeline
  create pipeline metrics from metrics;

  # Connect the udp server to the pipeline
  connect /connector/upd_in to /pipeline/metrics;
  # Connect the pipeline to the inflix client
  connect /pipeline/metrics to /connector/influx_out;

end;

# start our 
deploy flow metrics;
```

### Running

Now with taht set you can grab [the entire config from github](__GIT__/../code/metrics/) and start it with `docker-compose -f  batching.yaml up`.

The chronograf ui can be found at (`http://localhost:8888`)[http://localhost:8888].

## Aggregation

Let's talk about aggregation. Sometimes it's helpful to aggregate some metrics before they're stored in a database. One reason could be to downsample the input, another could be to create histograms for databases that don't natively support them.

:::note
   The techniques used for aggregation aren't specific to metrics, the same methods can be applied to any event stream.
:::

The aggregation we're looking for is "The histogram for each metric over a 10s and 1min windo"


### Grouping

To aggregate the metrics we get in a useful we need to group our data by the `"each metric"` from our definition. Since we're using influx data as our input a metric is identified by three fields:

* The `measurement`
* The `tags`
* The `field`

Since influx combines multiple fields in a message we first have to unroll this into each field being a single event.

::: note
    We use `create stream` here, streams are just named nodes that have no own function, nor overhead, they serve as a way to chain up selects.
:::

```troy
    # use types for checking if values are a number
    use std::type;

    # use record for exploding keys
    use std::record;

    # create our pre-aggregation stream
    create stream aggregate;

    # We change the structure of our event to be easier digestible for aggregation
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
```

What we do here is for `each` `key` in `fields` we create a metric so if our record has two fields we flatten that out and have two events. We then create a set of this field, the tags for the metric and the measurement for the metric. This gives us a unique identifyer for the metric/

This is needed to not confuse the values for different fields.

:::note
   We use `group[2]` here, which referes to the the second element of the current group (indexing starts at 0). For a string of the entire group you can access `n+1`( in our example, since we have 3 elements it would be `group[3]`).
:::

### Windowing

To aggregate over a time range we use time based tumbling windows. We can define them the same way we define everything else, a `define` statement. They are however, not creatd, instead they're bound to the select statment they're used in.

```troy
    # use nanos for time
    use std::time::nanos;

    # define a 10 second window
    define window `10secs` from tumbling
    with
      interval = nanos::from_seconds(10)
    end;

    # define a 1 minute window
    define window `1min` from tumbling
    with
      interval = nanos::from_minutes(1)
    end;
```

### Aggregating

Once we have defined the windows we can now use them to agregate our data. We do this in a new select statement. After the `from` section we have a suqare bracket and then the window names. This syntax is what we call tilt frames, basically they're chained dinows that will emit based on conditions.

We use the  [`aggr::stats::hdr`](../library/aggr/stats#hdrnumber-array) fimctopm that creates a histogram from the incoming data and outputs the given set of percentiles.

In addition we use the [`aggr::win::first`](../library/aggr/win#first) to get the first timestamp.

:::note
   We are using two windows here, a 10s one and a 1min one. The upside of using the tilt framing mechanism here is that we can do this without a loss in precision, as in the 1min window is not an aggregate of six 10s windows but rather an aggregate of the raw data of them without having to duplicate it.
:::

```troy
    # create a stream for normalisation
    create stream normalize;

    select
    {
        "measurement": event.measurement,
        "tags": patch event.tags of insert "window" => window end,
        "stats": aggr::stats::hdr(event.value, [ "0.5", "0.9", "0.99", "0.999" ]),
        "field": event.field,
        "timestamp": aggr::win::first(event.timestamp), # we can't use min since it's a float
    }
    from aggregate[`10secs`, `1min`]
    group by set(event.measurement, event.tags, event.field)
    into normalize;
```

### Normalisation

Last but not least we need to normalize this data basck to something the [influx codec](../connectors/codecs/influx.md) understands.

We can do this with another select statement.

```troy
select {
  "measurement":  event.measurement,
  "tags":  event.tags,
  "fields":  {
    "count_#{event.field}":  event.stats.count,
    "min_#{event.field}":  event.stats.min,
    "max_#{event.field}":  event.stats.max,
    "mean_#{event.field}":  event.stats.mean,
    "stdev_#{event.field}":  event.stats.stdev,
    "var_#{event.field}":  event.stats.var,
    "p50_#{event.field}":  event.stats.percentiles["0.5"],
    "p90_#{event.field}":  event.stats.percentiles["0.9"],
    "p99_#{event.field}":  event.stats.percentiles["0.99"],
    "p99.9_#{event.field}":  event.stats.percentiles["0.999"]
  },
  "timestamp": event.timestamp,
}
from normalize
into batch;
```


### Running

Now with taht set you can grab [the entire config from github](__GIT__/../code/metrics/) and start it with `docker-compose -f  aggregation.yaml up`.

The chronograf ui can be found at (`http://localhost:8888`)[http://localhost:8888].


## Tremor metrics