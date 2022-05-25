---
sidebar_label: http
sidebar_position: 1
---

# The `http` Connector

The `http` connector provides integration against the HTTP protocol suite.

## Configuration

### Client

```tremor title="config.troy"
define connector `http-out` from http_client
with
  use std::time::nanos;
  codec = "json",  # Defaults to HTTP codec
  config = {
    # Target URL for this HTTP client
    "url": "http://host:80",

    # Optional Transport Level Security configuration
    # If url schme in `url` is `https` then TLS configuration is required
    # "tls" = { ... },

    # Optional authentication method, can be one of
    # * "basic" - basic authentication
    #   ```tremor
    #      "auth" = { "basic": { "username": "snot", "password": "badger" } },
    #   ```
    # * "gcp"   - Google Cloud Platform
    #   ```tremor
    #    "auth" = "gcp", # See https://cloud.google.com/docs/authentication/getting-started
    #  ```
    # By default, no authentication is used
    # "auth" = "none",

    # HTTP method - defaults to `POST`, case insensitive
    # "method" = "get",
    
    # Concurrency - number of simultaneous in-flight requests ( defaults to 4 )
    # "concurrency" = 4,

    # Request timeout - default is unset ( do not timeout )
    # "timeout" = nanos::from_secs(10), # nanoseconds

    # Optional default HTTP headers
    # "headers" = { "key": "value", "other-key": ["v1", "v2"] },

    # Custom Mime Codec Map, overrides default `codec`
    # "custom_codecs" = {
    #    # key defines the MIME type, value defines codec by name 
    #    "application/json": "json",
    #    "application/yaml": "yaml"
    # }
  }
end;
```

### Server

```tremor title="config.troy"
define connector `http-in` from http_server
with
  codec = "json",
  config = { 
    "url": "http://localhost:8080",

    # Optional Transport Level Security configuration
    # "tls" = { ... },

    # Custom Mime Codec Map, overrides default `codec`
    # "custom_codecs" = {
    #    # key defines the MIME type, value defines codec by name 
    #    "application/json": "json",
    #    "application/yaml": "yaml"
    # }
  }
end;
```

## HTTP configuration example

This is a relatively basic client server system that replays JSON formatted lines of data from a text file over HTTP to a server. The
server receives the JSON events and echo's them back to the HTTP client.

The client and server are implemented as tremor flows.

A high level summary of the overall flow:

```mermaid
graph LR
    A[JSON File] -->|read line by line| B(HTTP Client)
    B -->|send json request| C{HTTP Server}
    C{HTTP Server} -->|receive json request| D(select event from in into out)
    D -->|echo json response| B{HTTP Client}
    B -->|log response| E[Log File]
```

### The complete annotated source

```tremor
define flow server
flow
  use integration;
  use tremor::pipelines;
  use tremor::connectors;

  define connector http_server from http_server
  with
    codec = "json-sorted",
    config = {
      "url": "http://localhost:65535/",
    }
  end;

  define pipeline instrument
  pipeline
    use std::array;
    define window four from tumbling
    with
      size = 4
    end;
    select { "event": array::sort(aggr::win::collect_flattened(event)), "meta": array::sort(aggr::win::collect_flattened($)) } from in[four] into out;
  end;

  create pipeline instrument;
  create connector stdio from connectors::console;
  create connector http_server from http_server;

  create pipeline echo from pipelines::passthrough;

  # Echo http server: <http:req> -> server -> server_side -> <http:resp>
  connect /connector/http_server to /pipeline/echo;
  connect /pipeline/echo to /connector/http_server;
  connect /pipeline/echo to /connector/stdio;

  connect /connector/http_server to /pipeline/instrument;
  connect /pipeline/instrument to /connector/stdio;
end;

define flow client
flow
  use integration;
  use tremor::pipelines;
  use tremor::connectors;

  define connector http_client from http_client
  with
    codec = "json-sorted",
    config = {
      "url": "http://localhost:65535/",
      "headers": {
        "Client": "Tremor"
      }
    },
    reconnect = {
      "retry": {
        "interval_ms": 100,
        "growth_rate": 2,
        "max_retries": 3,
      }
    }
  end;

  define pipeline collect
  into out, exit
  pipeline
    use std::array;
    use std::time::nanos;
    define window four from tumbling
    with
      size = 4
    end;
    select array::sort(aggr::win::collect_flattened(event)) from in[four] into out;
    select { "delay": nanos::from_seconds(1) } from in where event == "exit" into exit;
  end;
  create pipeline collect;

  create connector data_in from integration::read_file;
  create connector data_out from integration::write_file;
  create connector exit from integration::exit;
  create connector stdio from connectors::console;
  create connector http_client from http_client;
  create connector exit from connectors::exit;

  create pipeline replay from pipelines::passthrough;
  create pipeline debug from pipelines::passthrough;
  

  # Replay recorded events over http to server
  connect /connector/data_in to /pipeline/replay;
  connect /pipeline/replay to /connector/http_client;
  connect /connector/http_client/out to /pipeline/collect;
  connect /connector/http_client/err to /pipeline/debug;

  connect /pipeline/collect to /connector/data_out;
  connect /pipeline/debug to /connector/stdio;
  # Terminate at end via `exit` event
  connect /pipeline/collect/exit to /connector/exit;
end;

deploy flow server;
deploy flow client;
```

## Metadata

The `http` connector supports metadata allowing request and response
protocol metadata to be inspected, checked, and manipulated in advanced
integrations.

Metadata allows context information related to the payload data represented as a value in tremor to be decorated with context from
connectors and operators to control specific behaviours in a running
pipeline.

### Request metadata

Request metadata allows the HTTP method, headers and other other request parameters of the HTTP request to be overridden.

Request metadata can be set for an event

```tremor
let $request = ...
```

The request metadata is applied per request, and should be of `record` type and structured as follows:

```tremor
{
  # Overrides the connector's default method HTTP for this request  
  # -  Setting to an illegal HTTP VERB results in an error
  "method": "GET", 
  # Overrides the endpoint, path and parameters for this request
  # -  Care should be taken where authentication is use
  # -  Setting to a non-http URL results in an error
  "url": "https://some_host:8080/foo/bar/baz?a=b",
  # Overrides the headers for this request, passing through unchanged default headers from configuration
  "headers": { "x-snot": "y-badger", }
}
```

#### Special cases

- If a transfer encoding is specified as `chunked` then chunked transfer encoding will be used for the request transfer
- If a mime type is set, and custom mime codec mappings are provided the
  user supplied matching codec will be applied
- If a mime type is set, and no custom mapping matches, then the configured
  connector codec will be applied, or the `json` default if none is configured.
- If possible the connector will attempt to set an appropriate content type
- If authentication is configured, authentication headers will follow the method supplied to the connector

### Response metadata

Response metadata allows records the response parameters set against a HTTP request that
a response is issued against recording the decisions the `http_server` connector makes
when responding to requests.

The response can be read from the `$response` metadata.

Response metadata takes the following general form:

```tremor
{
  # The HTTP status code
  "status": 200, 
  # Headers
  "headers": { "x-snot": "y-badger", }
  # The HTTP protocol version negotiated
  "version": "1.1",
}
```

### Correlation metadata

Setting the `$correlation` metadata on an outbound request will result in the response
being tagged with the `$correlation` value set in the corresponding request.
