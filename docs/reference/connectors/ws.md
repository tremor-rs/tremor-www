---
sidebar_label: ws (Web Sockets)
sidebar_position: 1
---

# The Websocket Connectors

The [`ws_server`](#ws_server) and [`ws_client`](#ws_client) connectors provide support for the WebSocket protocol specification.

Tremor can expose a client or server connection.

Text and binary frames can be used.

## `ws_server`

This connector is a websocket server. It opens a TCP listening socket, and for each incoming connection it initiates the Websocket handshake. Then websocket frames can flow
and are processed with the given `preprocessors` and `codec` and sent to the `out` port of the connector.

Each incoming connection creates a new stream of events. Events from a websocket connection bear the following metadata record at `$ws_server`:

```js
{
  "tls": true, // whether or not TLS is configured
  "peer": {
    "host": "127.0.0.1", // ip of the connection peer
    "port": 12345        // port of the connection peer
  }
}
```

When a connection is established and events are received, it is possible to send events to any open connection. In order to achieve this, a pipeline needs to be connected to the `in` port of this connector and send events to it. There are multiple ways to target a certain connection with a specific event:

* Send the event you just received from the `ws_server` right back to it. It will be able to track the the event to its websocket connection. You can even do this with an aggregate event coming from a select with a window. If an event is the result of events from multiple websocket connections, it will send the event back down to each websocket connection.
* Attach the same metadata you receive on the connection under `$ws_server` to the event you want to send to that connection.

### Configuration

| Option         | Description                                                                                                 | Type             | Required | Default value                                                                |
|----------------|-------------------------------------------------------------------------------------------------------------|------------------|----------|------------------------------------------------------------------------------|
| url            | The host and port as url to listen on.                                                                      | string           | yes      |                                                                              |
| tls            | Optional Transport Level Security configuration. See [TLS configuration](./common_configuration.md#server). | record           | no       | No TLS configured.                                                           |
| backlog        | The maximum size of the queue of pending connections not yet `accept`ed.                                    | positive integer | no       | 128                                                                          |
| socket_options | See [TCP socket options](./common_configuration.md#tcp-socket-options).                                     | record           | no       | See [TCP socket options defaults](./common_configuration#tcp-socket-options) |

#### Examples

An annotated example of a plain WS cient configuration leveraging defaults:

```tremor title="config.troy"
define connector in from ws_server
with
  preprocessors = [
    {
      "name": "separate", 
      "config": {
        "buffered": false
      }
    }
  ],
  codec = "json",
  config = {
    "url": "127.0.0.1:4242",
  }
end;
```

An annotated example of a secure WS server configuration:

```tremor title="config.troy"
define connector ws_server from ws_server
with
  preprocessors = ["separate"],
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


## `ws_client`

This connector is a websocket client, that establishes one connection to the host and port configured in `url`. Events sent to the `in` port of this connector will be processed by the configured `codec` and `postprocessors` and turned into a text or binary frame, depending on the events boolean metadata value `$ws_server.binary`. If you want to sent a binary frame, you need to set:

```tremor
let $ws_server["binary"] = true;
```

If nothing is provided a text frame is sent.

Data received on the open connection is processed frame by frame by the configured `preprocessors` and `codec` and sent as event via the `out` port of the connector. Each event contains a metadata record of the following form via `$ws_server`:

```js
{
  "tls": false, // whether or not tls is enabled on the connection
  "peer": {
    "host": "192.168.0.1", // ip of the connection peer
    "port": 56431          // port of the connection peer
  }
}
```

### Configuration

| Option         | Description                                                                                                 | Type              | Required | Default value                                                                |
|----------------|-------------------------------------------------------------------------------------------------------------|-------------------|----------|------------------------------------------------------------------------------|
| url            | The URL to connect to in order to initiate the websocket connection.                                        | string            | yes      |                                                                              |
| tls            | Optional Transport Level Security configuration. See [TLS configuration](./common_configuration.md#client). | record or boolean | no       | No TLS configured.                                                           |
| socket_options | See [TCP socket options](./common_configuration.md#tcp-socket-options).                                     | record            | no       | See [TCP socket options defaults](./common_configuration#tcp-socket-options) |

#### Examples

An annotated example of a non-tls plain WS cient configuration leveraging defaults:

```tremor title="config.troy"
define my_wsc out from ws_client
with
  postprocessors = ["separate"],
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

An annotated example of a secure WS client configuration with
reconnection quality of service configured:

```tremor title="config.troy"
define connector ws_client from ws_client
with
  postprocessors = ["separate"],
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


## Example

A secure websocket echo service supporting line delimited JSON.

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
    postprocessors = ["separate"],
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
    preprocessors = ["separate"],
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