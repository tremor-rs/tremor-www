---
sidebar_position: 0
---
# Tremor

Think about Tremor as an event- or stream-processing engine. It receives input data from various [Connectors](reference/connectors), turns the data into streams of structured events with the help of [Preprocessors](reference/preprocessors) and [Codecs](reference/codecs). Those events are then handled by one or more [Pipelines](language/pipelines), which can inspect, mutate and route the event and implement arbitrarily complex application logic. Events are either dropped (e.g. for rate-limiting or traffic-shaping) or sent to downstream systems via various [Connectors](reference/connectors). Before actually leaving the system, those streams of structured events need to be serialized using [Codecs](reference/codecs) and [Postprocessors](reference/postprocessors).

How events come into your Tremor system, how they flow through it, how they change shape and leave it again, all this is encoded in a [Flow](language/troy#flow) written in Tremors own configuration language [Troy](language/troy). A Troy file can contain one or many [Flow Definitions](language/troy#flow) and commands to `deploy` them. When Tremor starts, it reads the Troy files provided on the command line and actually deploys and starts those [Flows](language/troy#flow) in order to let events flow.

You can investigate what [Flows](language/troy#flow) are currently deployed on your Tremor system by using our [API](pathname:///api/v0.12/).

```console
$ curl -s localhost:9898/v1/status | jq .
{
  "all_running": true,
  "num_flows": 1,
  "flows": {
    "running": 1
  }
}
```

```console
$ curl -s localhost:9898/v1/flows | jq .
[
  {
    "alias": "lines",
    "status": "running",
    "connectors": [
      "read_file",
      "console"
    ]
  }
]
```

```console
$ curl -s localhost:9898/v1/flows/lines/connectors | jq .
[
  {
    "alias": "read_file",
    "status": "running",
    "connectivity": "connected",
    "pipelines": {
      "out": [
        {
          "alias": "passthrough",
          "port": "in"
        }
      ]
    }
  },
  {
    "alias": "console",
    "status": "running",
    "connectivity": "connected",
    "pipelines": {
      "in": [
        {
          "alias": "passthrough",
          "port": "out"
        }
      ]
    }
  }
]
```

## Tremors Goals

Tremor is designed to keep the data-plane, that is the code-path handling the flow of events directly as fast as possible. We try to copy and allocate as few bytes as we can, make most of the given CPU we have by utilizing SIMD acceleration where we can (e.g. while parsing json or splitting input bytes).

While we are trying to be fast and have this affect our development process big time, our main goal actually is **Operator Satisfaction**. 

To achieve this goal we want to make Tremor as easy and pleasant to use as we can. We have our own, hopefully straightforward configuration language called [Troy](language/troy), which we think is 1000 times better than YAML (at least) and it allows us to give you very good and helpful error messages and other static analysis on your configuration files. We even have our own [Language Server](https://github.com/tremor-rs/tremor-language-server) and VSCode plugin to make writing Tremor applications easy. Additionally we offer several tools for testing Tremor applications before pushing them to production.

A big part of **Operator Satisfaction** is good observability and easy troubleshooting. Tremor is inspectable via its [API](pathname:///api/v0.12/), it exposes its runtime metrics as a separate [Connector](reference/connectors) whose metrics events can be sent to any metrics store or time-series database for feeding them into your dashboards.

