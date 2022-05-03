# The `bench` Connector

The `bench` connector enables controlled micro-benchmarking of tremor-based
applications. Benchmarks and micro-benchmarking are an important part of the
performance engineering practices of the tremor authors.

We maintain and publish [benchmark results](https://www.tremor.rs/benchmarks/) that are
published every time code is commited to the main [tremor runtime](https://github.com/tremor-rs/tremor-runtime] git repository
using bare metal infrastructure provided by the [CNCF](https://www.cncf.io) on [Equinix Metal](https://metal.equinix.com/)
where we host a simple [continuous benchmarking service](https://github.com/tremor-rs/tremor-benchmark) designed for this
purpose.

## Operation

The connector will load an emulated source of events from a ( possibly `xz` compressed file and load them into memory.
The contents are replayed for the duration of the test, or until the number of configured test iterations has been
exceeded; whichever happens first. Once the test has been stopped a high dynamic range [HDR Histogram](http://hdrhistogram.org/)
is produced. The histogram can be loaded into the web based [histogram plotting tool](http://hdrhistogram.github.io/HdrHistogram/plotFiles.html) for analysis.

Once the latency histogram and throughput measures have been emitted, the tremor runtime process is halted.

## Configuration

```troy
  # File: example.troy
  define connector bench from bench
  with
    codec = "json",   	                # Use line-delimited JSON events for continuous replay by default
    config = {
      "source": "in.json",              # Path to the `source` events for the benchmark, can be xz compressed
      "interval": 1000000,              # Interval in nanoseconds for coordinated ommission conformance, can be ommitted
      "iters": 1,                       # Number of iterations for the benchmark to process the replay events
      # "chunk_size": 4096,             # Optional chunk size in bytes for binary event replay
      # "base64": false,                # Is the emulated source data base64 encoded, defaults to false
      # "is_transactional": false,      # Is the emulated source data from a transaction-capable data source
      # "structured": false,            # Is the emulated source structural with no codec overhead, defaults to false
      # "stop_after_secs": 10,          # Defines the number of seconds after which the benchmark should be stopped
      # "significant_figures": 3,       # Digits of precision for latency HDR histogram results, defaults to `2`
      # "warmup_secs": 5,               # A number of seconds to run the benchmark to warm up the system under test, defaults to 3
    }
  end;
```

## How do I write a benchmark?

A complete benchmark will define the `bench` parameters using the `bench` connector as in the
configuration example above with a system under test defined in a deployment file. A full
example is provided for illustration.

```troy
# File: config.troy
define flow main
flow
  use troy::connectors;
  use integration;

  define connector bench from bench
  with
    codec = "json",
    config = {
      "source": "in.json",
      "interval": 1000000,
      "iters": 1
    }
  end;

  create pipeline main from integration::out_or_exit;
  create connector bench;
  create connector exit from connectors::exit;

  create connector out_file from integration::write_file;

  create connector err_file from integration::write_file
  with
    file = "err.log"
  end;

  connect /connector/bench to /pipeline/main;
  connect /pipeline/main to /connector/out_file;
  connect /pipeline/main/exit to /connector/exit;
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
$ export TREMOR_PATH=/path/to/tremor-runtime/tremor-script/lib:/path/to/tremor-runtime/tremor-cli/tests/lib
$ tremor test bench .
```

Tremor's builtin test framework will locate the benchmark test and execute it and analyse the results
delivering a report:

```bash
➜  blaster git:(connectors) ✗ tremor test bench .
  Benchmark: Running .
    Tags:  blaster
       (+) Assert 0: Status blaster
       (+) Assert 1: File `out.log` equals `expected_out.json`
  Elapsed: 1s 903ms


All Benchmark Stats: Pass 1 Fail 0 Skip 0  Asserts 0
Total Stats: Pass 1 Fail 0 Skip 0  Asserts 0
Total Elapsed: 1s 905ms
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

