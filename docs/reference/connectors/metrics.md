---
sidebar_label: metrics (Tremor metrics)
sidebar_position: 1
---

# The `metrics` Connector

The `metrics` connector collects and forwards system metrics and can be used by user defined
logic to expand on the set of metrics collected.

## Configuration

We use the standard definition of the metrics connector from the standard library

```tremor
use tremor::connectors;

create connector metrics from connectors::metrics;

...
 
# Redirect system metrics to a user defined pipeline
connect /connector/metrics to /pipeline/my_metrics

...

```

## Format

The general form of metrics events is as follows:

```tremor
{"measurement":"connector_events","tags":{"connector":"in","port":"err"},"fields":{"count":0},"timestamp":1650402845610254000}
{"measurement":"events","tags":{"pipeline":"main","node":"out","direction":"input","port":"in"},"fields":{"count":7},"timestamp":1650402845610254000}
{"measurement":"events","tags":{"pipeline":"main","node":"process","direction":"output","port":"out"},"fields":{"count":7},"timestamp":1650402845610254000}
{"measurement":"connector_events","tags":{"connector":"out","port":"in"},"fields":{"count":8},"timestamp":1650402845610254000}
```

Where:

```tremor
{ 
  "measurement":"connector_events",       # The name of the measure
  "tags":{"connector":"out","port":"in"}, # Measure specific tags or labels
  "fields":{"count":20},                  # Measure specific fields
  "timestamp":1650402945610254000}        # Optional Timestamp
}
```


## How do i capture system metrics to standard output?

Capture and redirect system metrics and redirect to standard output

```tremor title="capture.troy"
define flow main
flow
  use integration;
  use std::time::nanos;
  use tremor::connectors;

  # connector definitions
  define connector in from metronome
  with
    metrics_interval_s = 3,
    config = { "interval": nanos::from_seconds(1) }
  end;

  define connector out from file
  with
    metrics_interval_s = 3,
    codec = "json-sorted",
    postprocessors = ["separate"],
    config = {
      "path": "events.log",
      "mode": "write"
    }
  end;

  # pipeline definitions
  define pipeline main
  args
    metrics_interval_s = 3
  pipeline
    #!config metrics_interval_s = 3

    select event from in into out;
  end;
  
  define pipeline metrics
  into 
    out, err, exit
  pipeline
    define script process
    script
      # exit if we have at least 10 events
      match state of
        case %{ measurement == "exit" } => # exit hook via a poisoned measurement name
          # Won't fire via the `metronome`
          emit {"EXIT": "NOW"} => "exit"
        default =>
          event # emit state => "out"
      end
    end;

    create script process;

    select event from in into process;
    select event from process/out into out;
    select event from process/exit into exit;
    select event from process/err into err;

  end;

  # creating connectors
  create connector in;
  create connector out;

  create connector exit from connectors::exit;
  create connector metrics from connectors::metrics;
  create connector stdio from connectors::console;

  # creating pipelines
  create pipeline main;
  create pipeline metrics;

  # connects
  connect /connector/in to  /pipeline/main;
  connect /pipeline/main/out to /connector/out;

  connect /connector/metrics to /pipeline/metrics;
  # catching other outputs, just in case
  connect /pipeline/metrics/out to /connector/stdio/stdout;
  connect /pipeline/metrics/err to /connector/stdio/stderr;

  # exit when we have all events
  connect /pipeline/metrics/exit to /connector/exit;
  connect /pipeline/metrics/exit to /connector/stdio/stdout;

end;

deploy flow main;
```

## Exercises

* Referring to the [format](#format) generate synthetiic metrics and publish them
   to the metrics `in` port
* Reformat the metrics based on the influx line protocol format and publish to an
   `influx` compatible endpoint such as InfluxDB, QuestDB or TDEngine or another TSDB
* Replace the `metronome` source with `stdin` or a file to further explore the metrics
  facility.

:::note
The logic above includes an `exit` hook via a special measurement named `exit`.
This logic should be removed in a system designed for long running in production!
:::

