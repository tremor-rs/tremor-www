# Recipes

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

[Tremor Development Quick Start](../community/development/quick-start)

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

## Legacy Observability

Before the rise of CNCF OpenTelemetry, logging, metrics and tracing required
a lot of glue to be used to wire together a well-monitored and observable system.

[logstash](./logstash/index.md) - Logstash

[syslog_udp](./syslog_udp/index.md) - Syslog over UDP

[syslog_udp_dns](./syslog_udp_dns/index.md) - Syslog over UDP with DNS

## Modern Observability

CNCF OpenTelemetry provides a way forward, finally a standardised wire form and protocol
for logging, metrics and tracing.

[otel_elastic_apm](./otel_elastic_apm/index.md) - Elastic APM integration

[otel_passthrough](./otel_passthrough/index.md) - Otel passthrough service

[otel_zipkin](./otel_zipkin/index.md) - Otel Zipkin integration

[otel_jaeger](./otel_jaeger/index.md) - Otel Jaeger integration

[otel_prometheus](./otel_prometheus/index.md) - Otel Prometheus integration

## Deployment Patterns

Tremor-based systems have generally followed a set of predictable architectures and
configurations. These recipes show some of those patterns in their simplest forms.

[quota_service](./quota_service/index.md) - A quota configuration service

[configurator](./configurator/index.md) - A generic configuration service

[polling_alerts](./polling_alerts/index.md) - Alert polling

[transient_gd](./transient_gd/index.md) - Transient guaranteed delivery

[persistent_gd](./persistent_gd/index.md) - Persistent guaranteed delivery

[roundrobin](./roundrobin/index.md) - Round robin delivery

[servers_lt_http](./servers_lt_http/index.md) - HTTP rpc

[servers_lt_ws](./servers_lt_ws/index.md) - WS rpc

[proxies_lt_http](./proxies_lt_http/index.md) - HTTP proxy

[proxies_lt_ws](./proxies_lt_ws/index.md) - WS proxy

[bridges_lt_http_ws](./bridges_lt_http_ws/index.md) - HTTP WS bridge

[reverse_proxy_load_balancing](./reverse_proxy_load_balancing/index.md) - Reverse proxy

## Messaging

If you have systems that rely on Kafka compatible message processing with the fully
open source Apache edition, the Confluent edition or the Redpanda edition, then these
examples are a good reference for event processing with tremor that preserves guaranteed
delivery of kafka to kafka communications.

[kafka_elastic_correlation](./kafka_elastic_correlation/index.md) - Kafka correlation


[redpanda_elastic_correlation](./redpanda_elastic_correlation/index.md) - Redpanda correlation

[kafka_gd](./kafka_gd/index.md) - Kafka guaranteed delivery

[redpanda_gd](./redpanda_gd/index.md) - Redpanda guaranteed delivery
