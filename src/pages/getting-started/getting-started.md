---
title: Setup
id: setup
description: Starting Tremor for the first time- set up your first Tremor installation.
hide_table_of_contents: false
---

### Requirements

While there are many ways to install Tremor, be it as a package or compiling it from source, this quickstart guide will use a Docker Image to make it as painless as possible to get a first instance of Tremor running.

With that, a running version of [Docker](https://docker.io) on a system with an internet connection is required.

### Get Tremor

The simplest way to get Tremor is downloading the [Docker Image](https://hub.docker.com/r/tremorproject/tremor). You can grab the latest version of Tremor by typing:

```bash
docker pull tremorproject/tremor:latest
```

### Configuring Tremor

If you want to see Tremor start, you can skip this step, but lets be real, you probably want to make Tremor do something more interesting than printing a few numbers on the screen.

The Tremor Docker image is configured by mounting a configuration folder to `/etc/tremor`.

The structure is as follows:

```text
/etc/tremor
  - logger.yaml
  ` config
    ` *.yaml
    ` *.trickle
```

* `logger.yaml` A [log4rs](https://docs.rs/log4rs/0.10.0/log4rs/#examples) configuration file.
* `config/*.trickle` One or more trickle files loaded in lexigraphical order to provide pipelines.
* `config/*.yaml` One or more YAML files with configurations for Onramps, Offramps and Bindings and Mappings.

For details on the files please consult the [documentation](/docs/Operations/configuration).

### Running

Once downloaded and configured, starting the Tremor Docker Image can be done with:

```bash
docker run -v host/path/to/etc/tremor:/etc/tremor tremor-runtime
```

### Use Case Examples

We have use case examples that come with a full set of configuration files and a `docker-compose.yaml`. To get a whole use case set up with a single command, you can look at the following cases:

* [Apache log](](/docs/Workshop/examples/10_logstash)- storing apache logs in elastic search.
* [Influx Aggregation](/docs/Workshop/examples/11_influx)- aggregating metrics for InfluxDB.
