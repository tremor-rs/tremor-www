# Getting Started

### Requirements

Tremor can be installed in a variety methods such as through a package or compiling it from source code. We recommend following this quickstart guide which will use a Docker Image to get your first instance of Tremor running.

A running version of [Docker](https://docker.io) on a system with an internet connection is required.

### Installation

The simplest way to get Tremor is by downloading the [Docker Image](https://hub.docker.com/r/tremorproject/tremor). You can install the latest version of Tremor by running the following command in terminal:

```bash
docker pull tremorproject/tremor:latest
```

### Configuration

The Tremor Docker image is configured by mounting a configuration folder to `/etc/tremor`.

The structure is as follows:

```text
/etc/tremor
  - logger.yaml
  ` config
    ` *.yaml
    ` *.trickle
```

* `logger.yaml` A [log4rs](https://docs.rs/log4rs/#examples) configuration file.
* `config/*.trickle` One or more trickle files loaded in lexigraphical order to provide pipelines.
* `config/*.yaml` One or more YAML files with configurations for Onramps, Offramps and Bindings and Mappings.

For details on the files please consult the [documentation](./operations/configuration).

### Running Tremor

Once downloaded and configured, run the following command in terminal to start the Tremor Docker Image:

```bash
docker run -v host/path/to/etc/tremor:/etc/tremor tremor-runtime
```

### Use Cases

The following use case examples come with a full set of configuration files and a `docker-compose.yaml`. To get a use case set up with a single command, inspect the following cases:

* [Apache Log](./recipes/10_logstash/index.md)- storing apache logs in elastic search.
* [Influx Aggregation](./recipes/11_influx/index.md)- aggregating metrics for InfluxDB.
