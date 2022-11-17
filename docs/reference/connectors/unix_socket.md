---
sidebar_label: unix_socket
sidebar_position: 1
---

# The UNIX Domain Socket Connectors

The [`unix_socket_server`](#unix_socket_server) and [`unix_socket_client`](#unix_socket_client) connectors allow clients and servers based on UNIX domain sockets to be integrated with tremor.

## `unix_socket_client`

This connector establishes a connection to the unix domain socket at the given `path`, which must exist for this connector to connect successfully. Every event it receives via its `in` port is processed with the configured codec and postprocessors sent down that socket. Every data received from that socket will be processed with the configured preprocessors and codec and finally emitted as event to its `out` port. Emitted events will contain information about the socket they come from in their metadata via `$unix_socket_client`. The metadata has the following form:

```js
{
  "peer": "/tmp/my_sock" // path of the socket
}
```

| Option   | Description                                                                                    | Type             | Required | Default value |
|----------|------------------------------------------------------------------------------------------------|------------------|----------|---------------|
| path     | Path to an existing unix domain socket.                                                        | string           | yes      |               |
| buf_size | Size of the receive buffer in bytes. Determining the maximum packet size that can be received. | positive integer | no       | 8192          |

### Configuration

Example:

```tremor title="config.troy"
define connector client from unix_socket_client
with
  postprocessors = ["separate"],
  preprocessors = ["separate"],
  codec = "json",
  config = {
    # required - Path to socket file for this client
    "path": "/tmp/unix-socket.sock",
    # required - Size of buffer for data IO
    "buf_size": 1024,
  },
  # Configure basic reconnection QoS for clients - max 3 retries starting with 100ms reconnect attempt interval
  reconnect = {
    "retry": {
      "interval_ms": 100,
      "growth_rate": 2,
      "max_retries": 3,
    }
  }
end;
```

## `unix_socket_server`

This connector is creating a unix domain socket at the configured `path` and listens for incoming connections on it.
Each connection starts its own stream of events. Each packet is received into a local buffer of `buf_size` bytes, which should be equal or bigger than the maximum expected packet size. Each packet is processed by the configured `preprocessors` and `codec`.

Each event will contain information about the unix domain socket connection it comes from in a metadata record accessible via `$unix_socket_server`. The record is of the following form:

```js
{
  "path": "/tmp/sock", // path of the socket
  "peer": 123 // some opaque number identifying the connection
}
```

When a connection is established and events are received, it is possible to send events to any open connection. In order to achieve this, a pipeline needs to be connected to the `in` port of this connector and send events to it. There are multiple ways to target a certain connection with a specific event:

* Send the event you just received from the `unix_socket_server` right back to it. It will be able to track the the event to its socket connection. You can even do this with an aggregate event coming from a select with a window. If an event is the result of events from multiple socket connections, it will send the event back down to each connection.
* Attach the same metadata you receive on the connection under `$unix_socket_server` to the event you want to send to that connection.

### Configuration

| Option      | Description                                                                                             | Type             | Required | Default value |
|-------------|---------------------------------------------------------------------------------------------------------|------------------|----------|---------------|
| path        | Path to the socket. Will be created if it doesn't exits. Will recreate `path` as a socket if it exists. | string           | yes      |               |
| permissions | Permissing for `path`.                                                                                  | string           | no       |               |
| buf_size    | Size of the receive buffer in bytes. Determining the maximum packet size that can be received.          | positive integer | no       | 8192          |

Example:

```tremor title="config.troy"
define connector server from unix_socket_server
with
  # Server produces/consumes line delimited JSON data
  preprocessors = ["separate"],
  postprocessors = ["separate"],
  codec = "json",

  # UNIX socket specific configuration
  config = {
    # required - Path to socket file for this server
    "path": "/tmp/unix-socket.sock",
    # optional permissions for the socket
    "permissions": "=600",
    # optional - Use a 1K buffer - this should be tuned based on data value space requirements
    "buf_size": 1024,
  }
end;
```

## How do i?

```tremor title="config.troy"
# Encapsulate a UNIX socket based server
define flow server
flow
  use integration;
  use tremor::pipelines;
  use tremor::connectors;

  define connector server from unix_socket_server
  with
    # Server produces/consumes line delimited JSON data
    preprocessors = ["separate"],
    postprocessors = ["separate"],
    codec = "json",

    # UNIX socket specific configuration
    config = {
      # Path to socket file for this server
      "path": "/tmp/unix-socket.sock",
      # Permissions are read/write for the user running the server only
      "permissions": "=600",
      # Use a 1K buffer - this should be tuned based on data value space requirements
      "buf_size": 1024,
    }
  end;

  # Log to file
  create connector server_out from integration::write_file
  with
    file = "server_out.log"
  end;
  create connector stdio from connectors::console;
  create connector server;

  create pipeline server_side from pipelines::passthrough;
  create pipeline debug from pipelines::passthrough;

  # Flow from tcp_server to file
  connect /connector/server to /pipeline/server_side;
  connect /connector/server/err to /pipeline/debug;
  connect /pipeline/server_side to /connector/server_out;

  # Echo it back
  connect /pipeline/server_side to /connector/server/in;

  # Debugging
  connect /pipeline/debug to /connector/stdio;

end;

# Encapsulate a UNIX socket based client
define flow client
flow
  use integration;
  use tremor::pipelines;
  use tremor::connectors;
  use std::time::nanos;

  define connector client from unix_socket_client
  with
    postprocessors = ["separate"],
    preprocessors = ["separate"],
    codec = "json",
    config = {
      "path": "/tmp/unix-socket.sock",
      "buf_size": 1024,
    },
    # Configure basic reconnection QoS for clients - max 3 retries starting with 100ms reconnect attempt interval
    reconnect = {
      "retry": {
        "interval_ms": 100,
        "growth_rate": 2,
        "max_retries": 3,
      }
    }
  end;

  # create connector instances
  create connector in from integration::read_file;
  create connector client;
  create connector client_out from integration::write_file
  with
    file = "client_out.log"
  end;
  create connector stdio from connectors::console;
  create connector exit from integration::exit;

  # create pipeline instances
  create pipeline request from pipelines::passthrough;
  create pipeline debug from pipelines::passthrough;

  create pipeline response from integration::out_or_exit;

  # connect everything together
  # from file to unix domain client
  connect /connector/in to /pipeline/request;
  connect /pipeline/request to /connector/client;

  # send out any responses
  connect /connector/client to /pipeline/response;
  connect /pipeline/response to /connector/client_out;
  connect /pipeline/response/exit to /connector/exit;
  connect /pipeline/response/out to /connector/stdio;

  # debugging
  connect /connector/in/err to /pipeline/debug;
  connect /connector/client/err to /pipeline/debug;
  connect /pipeline/debug to /connector/stdio;
end;

deploy flow server;
deploy flow client;
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
