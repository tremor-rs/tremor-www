# Configuring Tremor

This is a short canned synopsis of tremor configuration.

Tremor supports dynamic reconfiguration since v0.4.

## Introduction

The tremor runtime is internally structured with multiple types of artifacts:

- Connectors - Specify to tremor _how_ to connect to the outside world. For example, the kafka consumer connector consumes data from Kafka topics.

- Pipeline - Specify to tremor _what_ operations to perform on data ingested ( from any connected upstream source ) and _what_ to contribute or publish downstream ( to any connected downstream target ).

- Deployments - Definen how pipelines and connectors are deployed together.

Each artifact consists of a definition and a instanciation. Definitions can be re-used for multiple instances, as a kind of a template.

Live connectors and pipelines in tremor are in a runnable state. They consume typically network bandwidth and some compute in the case of connectors. They consume compute time in the case of pipelines.

## Using the docker image

When using the tremor docker image configuration is loaded from the folder `/etc/tremor` this folder should be mounted into the docker container to propagate the data.

The following files are looked for:

- `/etc/tremor/logger.yaml` a [log4rs](https://docs.rs/log4rs) configuration file to control logging in tremor.
- `/etc/tremor/config/` : All `*.troy` files in this directory and its subdirectories will be loaded and run.

By default tremor is looking into `/usr/local/share/tremor` for custom modules and libraries that can be included in other files via `use`.  See [modules](../language/reference/module_system). To adapt the places tremor is looking for your modules, append to the `TREMOR_PATH` environment variable:

```sh
export TREMOR_PATH="/my/custom/tremor_modules:$TREMOR_PATH"
```