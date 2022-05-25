---
sidebar_label: bench (Benchmarking)
sidebar_position: 100
---

# The `bench` Connector

:::info

This connector is not intended for production use, but for testing the Tremor runtime itself. To enable it pass `--debug-connectors` to tremor.

:::

The `bench` connector enables controlled micro-benchmarking of tremor-based
applications. Benchmarks and micro-benchmarking are an important part of the
performance engineering practices of the tremor authors.

We maintain and publish [benchmark results](https://www.tremor.rs/benchmarks/) that are
published every time code is commited to the main [tremor runtime](https://github.com/tremor-rs/tremor-runtime] git repository
using bare metal infrastructure provided by the [CNCF](https://www.cncf.io) on [Equinix Metal](https://metal.equinix.com/)
where we host a simple [continuous benchmarking service](https://github.com/tremor-rs/tremor-benchmark) designed for this
purpose.

## Configuration


| Config Option       | Description                                                                                                                                                                                     | Possible Values  | Required / Optional | Default Value |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|---------------------|---------------|
| source              | The source file to read data from, can be xz compressed                                                                                                                                         | file path        | required            |               |
| interval            | The interval between single events in nanoseconds. Set to `0` if you want events emitted as fast as possible.                                                                                   | positive integer | optional            | `0`           |
| chunk_size          | if provided, the `source` file data will be split into chunks of the given size, instead of split into lines.                                                                                   | positive integer | optional            |               |
| iters               | Number of iterations through the whole `source` data to stop after. If not provided (and `stop_after_secs` is also not provided), the connector will iterate over the `source` data infinitely. | positive integer | optional            |               |
| base64              | If set to `true`, the `source` data will be `base64` decoded.                                                                                                                                   | boolean          | optional            | `false`       |
| is_transactional    | If set to `true`, events will be emitted as transactional (requiring ack/fail contraflow messages).                                                                                             | boolean          | optional            | `false`       |
| structured          | If set to `true` the benchmark report is output as JSON, if set to `false` it is printed in human-readable form.                                                                                | boolean          | optional            | `false`       |
| stop_after_secs     | Number of seconds after which the benchmark should be stopped.                                                                                                                                  | positive integer | optional            |               |
| significant_figures | Digits of precision for latency HDR histogram results.                                                                                                                                          | positive integer | optional            | `2`           |
| warmup_secs         | Number of seconds to warm up. Events during this time are not accounted for in the latency measurements.                                                                                        | positive integer | optional            | `0`           |

### Example

```tremor title="example.troy"
use std::time::nanos;
define connector bench from bench
with
  codec = "json",   	                  # Decode each line as a JSON document
  config = {
    "source": "in.json",                # Take the source data from `in.json` and turn each line into an event
    "interval": nanos::from_millis(1),  # Wait for 1ms between each event
    "iters": 1,                         # Iterate only once through the data in `in.json`
  }
end;
```

## Operation

The `bench` connector consists of two parts. The *source* part for generating synthetical loads of events and the *sink* part, measuring how many events it got and the latency of each event.

The *source* part will load an emulated source of events from a (possibly `xz` compressed) file and load them into memory.
It is required to send the emitted events to the *sink* part via the `in` port of the same connector eventually.
The pipelines and connectors in between can be considered the system that is subject to the benchmark.


The *source* part is replaying its contents for the duration of the test, or until the number of configured test iterations has been
exceeded; whichever happens first. Once the test has been stopped a high dynamic range [HDR Histogram](http://hdrhistogram.org/)
is produced and printed to stdout. The histogram can be loaded into the web based [histogram plotting tool](http://hdrhistogram.github.io/HdrHistogram/plotFiles.html) for analysis.

Once the latency histogram and throughput measures have been emitted, the tremor runtime process is halted.


## How do I write a benchmark?

The most important part of writing a benchmark with the `bench` connector is that the *source* part
needs to be the source of events. Usually the *source* part emits events as fast as it possibly can, in order to see how much the whole system is actually able to handle inm the best case.

The *sink* part needs to receive the events eventually, otherwise the benchmark does not measure anything. In that case the `bench` connector can be used as a load generator.

A complete benchmark will define the `bench` connector as in the
configuration example above with a system under test defined in a deployment file. A full
example is provided for illustration.

```tremor title="config.troy"
define flow main
flow
  use tremor::connectors;

  define connector bench from bench
  with
    codec = "json",
    config = {
      "source": "in.json",
      "stop_after_secs": 10,
      "warmup_secs": 2
    }
  end;
  create connector bench;

  define pipeline bench_me
  pipeline
    # this is just a dummy pipeline.
    # What we actually benchmark here is how much throughput the vanilla tremor runtime
    # without any application logic can achieve.
    select event from in into out;
  end;
  create pipeline bench_me;

  # send synthetical load of events to the pipeline
  connect /connector/bench to /pipeline/bench_me;
  # send events to the bench connector for measuring and reporting
  connect /pipeline/bench_me to /connector/bench;
end;

deploy flow main;
```

This is a test of the benchmark connector itself that is exercised as part of our CI system, it can be run
manually as follows:

```bash
$ git clone https://github.com/tremor-rs/tremor-runtime
$ cd tremor-runtime
$ cargo build --all --release # grab a coffee, this takes a while
$ cd tremor-cli/tests/integration/blaster # Piu piu!
$ export TREMOR_PATH=/path/to/tremor-runtime/tremor-script/lib
$ tremor test bench .
  Running `target/debug/tremor test bench -v temp/bench`
  Benchmark: Running bench
    Tags:  bench

       | Value Percentile TotalCount 1/(1-Percentile)
       | 
       | 8575 0.00000          1           1.00
       | 15679 0.25000     249319           1.33
       | 18559 0.50000     507133           2.00
       | 20223 0.62500     626440           2.67
       | 25087 0.75000     746698           4.00
       | 237567 0.81250     808828           5.33
       | 770047 0.87500     871282           8.00
       | 1146879 0.90625     902347          10.67
       | 1703935 0.93750     933194          16.00
       | 2097151 0.95312     948800          21.33
       | 2506751 0.96875     964503          32.00
       | 2670591 0.97656     972719          42.67
       | 2818047 0.98438     979971          64.00
       | 2981887 0.98828     983951          85.33
       | 3309567 0.99219     987641         128.00
       | 3571711 0.99414     989559         170.67
       | 3964927 0.99609     991540         256.00
       | 4259839 0.99707     992494         341.33
       | 4751359 0.99805     993481         512.00
       | 5079039 0.99854     993936         682.67
       | 5439487 0.99902     994468        1024.00
       | 5537791 0.99927     994776        1365.33
       | 5668863 0.99951     994894        2048.00
       | 6029311 0.99963     995017        2730.67
       | 6225919 0.99976     995133        4096.00
       | 6619135 0.99982     995194        5461.33
       | 6914047 0.99988     995349        8192.00
       | 6914047 0.99991     995349       10922.67
       | 6914047 0.99994     995349       16384.00
       | 6914047 0.99995     995349       21845.33
       | 6914047 0.99997     995349       32768.00
       | 6946815 0.99998     995376       43690.67
       | 6946815 1.00000     995376            inf
       | #[Mean       =    285758.86, StdDeviation   =    701828.62]
       | #[Max        =      6946815, Total count    =       995376]
       | #[Buckets    =           30, SubBuckets     =         3968]
       | 
       | 
       | Throughput   (data): 0.5 MB/s
       | Throughput (events): 99.5k events/s

  Elapsed: 12s 40ms
```

## Constraints

It is an error to attempt to run a benchmark ( any deployment using the `bench` connector )
via the regular server execution command in the `tremor` command line interface

```bash
➜  blaster git:(main) ✗ tremor server run config.troy
tremor version: 0.12 
tremor instance: tremor
rd_kafka version: 0x000002ff, 1.8.2
allocator: snmalloc
[2022-04-12T14:38:20Z ERROR tremor_runtime::system] Error starting deployment of flow main: Unknown connector type bench
Error: An error occurred while loading the file `config.troy`: Error deploying Flow main: Unknown connector type bench
[2022-04-12T14:38:20Z ERROR tremor::server] Error: An error occurred while loading the file `config.troy`: Error deploying Flow main: Unknown connector type bench
We are SHUTTING DOWN due to errors during initialization!
[2022-04-12T14:38:20Z ERROR tremor::server] We are SHUTTING DOWN due to errors during initialization!
```

In order to run the the `tremor server run` with the bench connector, add the `--debug-connectors` flag.