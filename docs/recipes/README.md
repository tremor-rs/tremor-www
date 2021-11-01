---
title: Recipes
sidebar_position: 00
---
# Tremor Recipes

[tremor Recipes]: #tremor-Recipes

This Recipes serves as a getting started laboratory for downloading,
compiling and running tremor on development machines and developing
tremor-based solutions.

## Table of Contents

[table of contents]: #table-of-contents

- [Development Environment](#tremor-dev-env)

## Download and environment setup

[tremor download and setup]: #tremor-dev-env

### Download and build quick start

Make sure your environment is setup for building tremor:

[Tremor Development Quick Start](/community/development/quick-start)

### Setup support for your IDE

Tremor supports language server extensions for VS Code and VIM text editors/IDEs:

[Tremor Language Server](https://github.com/tremor-rs/tremor-language-server)

### Make sure tremor binary is on your PATH

```bash
$ export PATH=/Path/to/tremor-src-repo/target/debug/:$PATH
$ tremor --version
tremor 0.9.0
```

# Solution Recipes

The following recipes show how to quickly configure and deploy
common tremor-based applications. These recipes assume no prior
working knowledge of tremor.


## Ingredients

Basic introduction to core features of tremor.

[passthrough](/docs/recipes/passthrough/README) - Pass through events

[filter](/docs/recipes/filter/README) - Filter events

[transform](/docs/recipes/transform/README) - Transform events

[validate](/docs/recipes/validate/README) - Validate structure of data in events

## Legacy Observability

Before the rise of CNCF OpenTelemetry, logging, metrics and tracing required
a lot of glue to be used to wire together a well-monitored and observable system.

[logstash](/docs/recipes/logstash/README) - Logstash

[influx](/docs/recipes/influx/README) - Influx

[postgres_timescaledb](/docs/recipes/postgres_timescaledb/README) - Postgres / Timescale

[grafana](/docs/recipes/grafana/README) - Grafana

[syslog_udp](/docs/recipes/syslog_udp/README) - Syslog over UDP

[syslog_udp_dns](/docs/recipes/syslog_udp_dns/README) - Syslog over UDP with DNS

## Modern Observability

CNCF OpenTelemetry provides a way forward, finally a standardised wire form and protocol
for logging, metrics and tracing.

[otel_elastic_apm](/docs/recipes/otel_elastic_apm/README) - Elastic APM integration

[otel_passthrough](/docs/recipes/otel_passthrough/README) - Otel passthrough service

[otel_zipkin](/docs/recipes/otel_zipkin/README) - Otel Zipkin integration

[otel_jaeger](/docs/recipes/otel_jaeger/README) - Otel Jaeger integration

[otel_prometheus](/docs/recipes/otel_prometheus/README) - Otel Prometheus integration

## Deployment Patterns

Tremor-based systems have generally followed a set of predictable architectures and
configurations. These recipes show some of those patterns in their simplest forms.

[quota_service](/docs/recipes/quota_service/README) - A quota configuration service

[configurator](/docs/recipes/configurator/README) - A generic configuration service

[polling_alerts](/docs/recipes/polling_alerts/README) - Alert polling

[transient_gd](/docs/recipes/transient_gd/README) - Transient guaranteed delivery

[persistent_gd](/docs/recipes/persistent_gd/README) - Persistent guaranteed delivery

[roundrobin](/docs/recipes/roundrobin/README) - Round robin delivery

[servers_lt_http](/docs/recipes/servers_lt_http/README) - HTTP rpc

[servers_lt_ws](/docs/recipes/servers_lt_ws/README) - WS rpc

[proxies_lt_http](/docs/recipes/proxies_lt_http/README) - HTTP proxy

[proxies_lt_ws](/docs/recipes/proxies_lt_ws/README) - WS proxy

[bridges_lt_http_ws](/docs/recipes/bridges_lt_http_ws/README) - HTTP WS bridge

[reverse_proxy_load_balancing](/docs/recipes/reverse_proxy_load_balancing/README) - Reverse proxy

## Messaging

If you have systems that rely on Kafka compatible message processing with the fully
open source Apache edition, the Confluent edition or the Redpanda edition, then these
examples are a good reference for event processing with tremor that preserves guaranteed
delivery of kafka to kafka communications.

[kafka_elastic_correlation](/docs/recipes/kafka_elastic_correlation/README) - Kafka correlation


[redpanda_elastic_correlation](/docs/recipes/104_redpanda_elastic_correlation/README) - Redpanda correlation

[kafka_gd](/docs/recipes/kafka_gd/README) - Kafka guaranteed delivery

[redpanda_gd](/docs/recipes/24_redpanda_gd/README) - Redpanda guaranteed delivery

[rabbitmq](/docs/recipes/25_amqp_rabbitmq/README) - RabbitMQ integration
