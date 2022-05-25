---
sidebar_label: unix_socket
sidebar_position: 1
---

# The `unix_socket` Connector

The unix_socket:client allows clients and servers based on UNIX sockets to be integrated with tremor.

## Configuration

A UNIX socket based line delimited JSON client

### Client

```tremor title="config.troy"
define connector client from unix_socket_client
with
  postprocessors = ["lines"],
  preprocessors = ["lines"],
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

### Server

A UNIX socket based line delimited JSON server

```tremor title="config.troy"
define connector server from unix_socket_server
with
  # Server produces/consumes line delimited JSON data
  preprocessors = ["lines"],
  postprocessors = ["lines"],
  codec = "json",

  # UNIX socket specific configuration
  config = {
    # required - Path to socket file for this server
    "path": "/tmp/unix-socket.sock",
    # required - Permissions are read/write for the user running the server only
    "permissions": "=600",
    # required - Use a 1K buffer - this should be tuned based on data value space requirements
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
    preprocessors = ["lines"],
    postprocessors = ["lines"],
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
    postprocessors = ["lines"],
    preprocessors = ["lines"],
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
