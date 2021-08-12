+++

title = "Starting Tremor for the first time"
date = "2020-02-05T13:11:00+01:00"
draft = false
weight = 200
description = "Setup"
bref= "Set up your first tremor installation"
toc= true

+++

### Requirements

While there are many ways to install Tremor, be it as a package or compiling it form source this quickstart guide will use a Docker image to make it as painless as possible to get a first instance of tremor running.

With that a running version of [Docker](https://docker.io) on a system with an internet connection is required.

### Get Tremor

The simplest way to get tremor is downloading the [Docker Image](https://hub.docker.com/r/tremorproject/tremor). You can grab the latest version of Tremor by typing:

```bash
docker pull tremorproject/tremor:latest
```

### Configuring Tremor

If you just want to see tremor start, you can skip this step, but lets be real, you probably want to make tremor do something more interesting then printing a few numbers on the screen.

The tremor Docker image is configured by mounting a configuration folder to `/etc/tremor`

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

For details on the files please consult the [documentation](https://docs.tremor.rs/operations/configuration).

### Running

Once downloaded and configured starting the tremor docker image can be done with

```bash
docker run -v host/path/to/etc/tremor:/etc/tremor tremor-runtime
```

### Usecase examples

We have use case examples that come with a full set of configuration files and a `docker-compose.yaml` to get a whole use case set up with a single command you can look at the following cases:

* [apache log](https://docs.tremor.rs/workshop/examples/10_logstash) - storing apache logs in elastic search
* [influx aggregation](https://docs.tremor.rs/workshop/examples/11_influx) - aggregating metrics for InfluxDB
