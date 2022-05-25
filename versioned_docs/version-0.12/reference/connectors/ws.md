---
sidebar_label: ws (Web Sockets)
sidebar_position: 1
---

# The `ws` Connector

The `ws` connector provides support for the WebSocket protocol specification.

Tremor can expose a client or server connection.

Text and binary frames can be used.

## Configuration

### Insecure Client

An annotated example of a non-tls plain WS cient configuration leveraging defaults.

```tremor title="config.troy"
define my_wsc out from ws_client
with
  postprocessors = ["lines"],
  codec = "json",
  config = {
    # Connect to port 4242 on the loopback device
    "url": "ws://127.0.0.1:4242/"

    # Optional Transport Level Security configuration
    # "tls" = { ... }

    # Optional tuning of the Nagle algorithm ( default: true )
    # - By default no delay is preferred
    # "no_delay" = false
  }
end;
```

### Secure Client

An annotated example of a secure WS client configuration with
reconnection quality of service configured.

```tremor title="config.troy"
define connector ws_client from ws_client
with
  postprocessors = ["lines"],
  codec = "json",
  config = {
    # Listen on all interfaces on TCP port 65535
    "url": "wss://0.0.0.0:65535",

    # Prefer delay and enable the TCP Nagle algorithm
    "no_delay": false,

    # Enable SSL/TLS
    "tls": {
      # CA certificate
      "cafile": "./before/localhost.cert",
      # Domain
      "domain": "localhost",
    }
  },
  # Reconnect starting at half a second, backoff by doubling, maximum of 3 tries before circuit breaking
  reconnect = {
    "retry": {
      "interval_ms": 500,
      "growth_rate": 2,
      "max_retries": 3,
    }
  }
end;
```

### Insecure Server

An annotated example of a tls plain WS cient configuration leveraging defaults..

```tremor title="config.troy"
define connector in from ws_server
with
  preprocessors = [{"name": "lines", "config":{"buffered": false}}],
  codec = "json",
  config = {
    "url": "127.0.0.1:4242",
  }
end;
```

### Secure Server

An annotated example of a secure WS server configuration.

```tremor title="config.troy"
define connector ws_server from ws_server
with
  preprocessors = ["lines"],
  codec = "json",
  config = {
    "url": "0.0.0.0:65535",
    "tls": {
      # Security certificate for this service endpoint
      "cert": "./before/localhost.cert",
      # Security key
      "key": "./before/localhost.key",
    }
  }
end;
```


## A secure websocket echo service supporting line delimited JSON

Single or multiple JSON lines of data can be transferred from client to
server with the server echoing the client message back to the client

```tremor title="config.troy"
define flow main
flow
  use integration;
  use tremor::pipelines;
  use tremor::connectors;

  define connector ws_client from ws_client
  with
    postprocessors = ["lines"],
    codec = "json",
    config = {
      "url": "wss://0.0.0.0:65535",
      "no_delay": false,
      "tls": {
        "cafile": "./before/localhost.cert",
        "domain": "localhost",
      }
    },
    reconnect = {
      "retry": {
        "interval_ms": 500,
        "growth_rate": 2,
        "max_retries": 3,
      }
    }
  end;

  define connector ws_server from ws_server
  with
    preprocessors = ["lines"],
    codec = "json",
    config = {
      "url": "0.0.0.0:65535",
      "tls": {
        "cert": "./before/localhost.cert",
        "key": "./before/localhost.key",
      }
    }
  end;

  # Instances of connectors for each instance of this flow
  create connector in from integration::read_file;
  create connector out from integration::write_file;
  create connector exit from integration::exit;
  create connector stdio from connectors::console;
  create connector ws_client;
  create connector ws_server;

  # Pipeline instances for this flow
  create pipeline server_side from integration::out_or_exit;
  create pipeline to_client from pipelines::passthrough;
  create pipeline debug from pipelines::passthrough;

  # Wiring

  connect /connector/in to /pipeline/to_client;
  connect /connector/in/err to /pipeline/debug;
  connect /pipeline/to_client to /connector/ws_client;
  # send out any responses to stdout
  connect /connector/ws_client to /pipeline/debug;
  connect /connector/ws_client/err to /pipeline/debug;
  connect /pipeline/debug to /connector/stdio;
  # flow from ws_server to file
  connect /connector/ws_server to /pipeline/server_side;
  connect /connector/ws_server/err to /pipeline/debug;
  connect /pipeline/server_side to /connector/out;
  # aaaand echo it back
  connect /pipeline/server_side to /connector/ws_server;
  connect /pipeline/server_side to /connector/exit;

end;

# Deploy the client, server and logic into the host tremor runtime
deploy flow main;
```

### Running as an integration test

This is how we run this test sceanario within our integration test suite.

```bash
$ export TREMOR_PATH=/path/to/tremor-runtime/tremor-script/lib:/path/to/tremor-runtime/tremor-cli/tests/lib
$ tremor test integration .
```

### Running as long running service

The logic can be used as starting point for your own client or service via `tremor server run`.

```bash
$ export TREMOR_PATH=/path/to/tremor-runtime/tremor-script/lib:/path/to/tremor-runtime/tremor-cli/tests/lib
$ tremor server run config.troy
```

### Running as a long running service, with pretty printed JSON output

During development, pretty printing the JSON output on standard output might be useful.

We typically use the wonderful [`jq`](https://stedolan.github.io/jq/) for this purpose

```bash
$ export TREMOR_PATH=/path/to/tremor-runtime/tremor-script/lib:/path/to/tremor-runtime/tremor-cli/tests/lib
$ tremor server run config.troy | jq
```