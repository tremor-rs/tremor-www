# Metrics

One one case in which tremor can be deployd is to work with metrics. Not as a store but as a preprocessor, aggregator and filter for metrics stores.

In this guide we'll see how to use tremor for this, we'll set up an example where tremor filters, aggregats and then forwards metrics.

:::note
   This example expects that you have some knowledge of tremor or went through the [basics guide](basics). Concepts explained there will not be explained again here.

   In addition we will use `docker compose` for this guide as it requires additional software and we want to avoid you having to install and configure a bunch of other services. Some familarity with this is expected as we will not explain details of this.
:::

All code for this guide can found [on github](__GIT__/../code/metrics/).

## Foundation

Let us start with the basic deployment:

* influxdb for storage
* chronograf for display
* telegraf as a agent to collect some data
* tremor for aggregation and filtering

```
telegraf -udp-> tremor -http-> influxdb -> chronograf -> YOU!
```

The docker-compose file for this is [here](__GIT__/../code/metrics/basic.yaml).


### UDP Server

Something new here is that we fully define our connectors instead of using a canned connector that was pre-defined.

For the input we use a [`udp_server`](../reference/connectors/udp.md) connector, in the `with` clause we can pass in the configuration.

Here are a the fields of interest we have not discussed before.

`codec` is a option that can be passed to (nearly) all connectors, and it defines how data that arrives over this connection is being decoded. In our case we use [`influx`](../reference/codecs/influx.md) to decode the influxdb line protocol.

`preprocessors`, aswel, is a option that can be passed to (nearly) all connectors, preprocessors are used to perform some kind of processing on the byte stream that the connector provides. In our case we use [`separate`](../reference/preprocessors/separate.md), this preprocessor will seperate the byte stream with a given character or byte, by default the `\n` newline.

:::note
   Some connectors provide structured output instead of a bytestream, those connectors can't be given a `codec`, `preprocessors` or `postprocessor` - after all their output is already well defined.
::::

The `config` section holds configuration that is specific to the connector type selected, in this case since we use the [`udp_server`](../reference/connectors/udp.md) we only have to specify the `url` we want to listen on.

With this we get:

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

On the other side we use a [`http_client`](../reference/connectors/http.md). Since influxdb does not have a custom trustport we are not forced to implement a `influx` connector, instead we can compbine the codec with http or udp connectors.

:::info
   Connector naming follows a scheme here, generally something is named `server` if it accepts connections and `client` if it initiatces connections.
   While there is often a correlation between clients writing and servers reading this is incidental and not a rule, a `client` that connects could very well be a reading and not a writing connector.
:::

Our connector config here is slighty more elaborate, in addition to the `url`, defining the target to write to we also have a `headers` map that defines the HTTP headers, this demonstrates nicely that more complex configurations are possible.

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

### Pieline, wiring up and running

As in the basics tutorial we're going to use the `passthrough` pipeline from the `troy::pipelines` module. If you went through the [basics guide](basics.md) this is the same as before.

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

  # Create the udp server
  create connector upd_in;

  # Create the http client
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

Now with taht set you can grab [the entire config from github](__GIT__/../code/metrics/) and start it with `docker compose up`.