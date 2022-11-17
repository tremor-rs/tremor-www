---
sidebar_label: udp
sidebar_position: 1
---

# The UDP Connectors

The [`udp_server`](#udp_server) and [`udp_client`](#udp_client) connectors allow UDP based datagram clients and servers to be integrated with tremor.

## `udp_server`

The `udp_server` binds to the host and port given in `url` and listens on incoming UDP packets.
Incoming UDP packets are being received into a local buffer of `buf_size` bytes, which determines the maximum packet size. Each UDP packet will be deserialized by the preprocessors and the codec.

This connector can only be used to receive events, thus pipelines can only be connected to the `out` and `err` ports.

Events coming from the `udp_server` connector do not have any metadata associated with them. The `[tremor::origin::scheme()](../stdlib/tremor/origin.md#scheme) function can be used and checked for equality with `"udp-server"` to determine if an event is coming from the `udp_server` connector.

### Configuration

| Option         | Description                                                                                        | Type             | Required | Default value                                                                |
|----------------|----------------------------------------------------------------------------------------------------|------------------|----------|------------------------------------------------------------------------------|
| url            | The host and port to bind to and listen on for incoming packets.                                   | string           | yes      |                                                                              |
| buf_size       | UDP receive buffer size. This should be greater than or equal to the expected maximum packet size. | positive integer | no       | 8192                                                                         |
| socket_options | See [UDP socket options](./common_configuration.md#udp-socket-options).                            | record           | no       | See [UDP socket options defaults](./common_configuration#udp-socket-options) |

Example:

```tremor title="config.troy"
define connector `udp-in` from udp_server
with
  codec = "string",
  preprocessors = [
    "separate"
  ]
  config = { 
    "url": "localhost:4242",
    "buf_size": 4096,
    "socket_options": {
      "SO_REUSEPORT": true
    }
  }
end;
```


## `udp_client`

The UDP client will open a UDP socket to write data to the given host and port configured in `url`. It will write the event payload, processed by the configured codec and postprocessors, out to the socket.

### Configuration

| Option         | Description                                                             | Type   | Required | Default value                                                                                |
|----------------|-------------------------------------------------------------------------|--------|----------|----------------------------------------------------------------------------------------------|
| url            | The host and port to connect to.                                        | string | yes      |                                                                                              |
| bind           | The host and port to bind to prior to connecting                        | string | no       | "0.0.0.0:0" if the connect url resolves to an IPv4 address, "[::]:0" if it resolves to IPv6. |
| socket_options | See [UDP socket options](./common_configuration.md#udp-socket-options). | record | no       | See [UDP socket options defaults](./common_configuration#udp-socket-options)                 |

The `udp` client, by default binds to `0.0.0.0:0` allowing to send to all interfaces of the system running tremor and picking a random port. This can be overwritten adding `"bind": "<ip>:<port>"` to the `config`.

:::warn
If you are hardening an installation it might make sense to limit the interfaces a udp client can send to by specifying the `"bind"` config.
:::


Example:

```tremor title="config.troy"
define connector `udp-out` from udp_client
with
  codec = "yaml",
  postprocessors = ["base64"],
  config = {
    "url": "localhost:4242",
    "bind": "127.0.0.1:65535",
    "socket_options: {
      "SO_REUSEPORT": true
    }
  }
end;
```




## Example

This is a relatively simple client server system that replays JSON formatted lines of data
from a text file over UDP to a server. The JSON data is transformed to base64 encoded YAML
before sending to the UDP server. The server receives UDP datagrams and writes them to a
log file encoding the log entries as naked string data.

The client and server are implemented as treomr flows.

A high level summary of the overall flow:

```mermaid
graph LR
    A[JSON File] -->|read line by line| B(UDP Client)
    B -->|base64 encoded YAML| C{UDP Server}
    C{UDP Server} -->|receive UDP datagrams| D(select event from in into out)
    D -->|string encoded data| E[Log file]
```

### JSON file over UDP as base64 encoded YAML

A tremor flow that consumes JSON formatted data line by line
from a file and sends each event as a base64 encoded YAML formatted
event via UDP to a UDP service.

High level flow summary:

```mermaid
graph LR
    A[JSON File] -->|read line by line| B(UDP Client)
    B -->|base64 encoded YAML| C{UDP Server}
```

In deployable form

```tremor title="config.troy"
define flow main
flow
  use tremor::connectors;
  use integration;


  define connector in from file
  with codec = "json",
    preprocessors = ["separate"],
    config = {
        "path": "in.json",
        "mode": "read"
    }
  end;

  define connector `udp-out` from udp_client
  with
    codec = "yaml",
    postprocessors = ["base64"],
    config = {
      "url": "localhost:4242",
    }
  end;
  
  create pipeline main from integration::out_or_exit;
  create connector in;
  create connector `udp-out`;
  create connector exit from connectors::exit;

  connect /connector/in/out to /pipeline/main/in;
  connect /pipeline/main/out to /connector/`udp-out`/in;
  connect /pipeline/main/exit to /connector/exit/in;
end;

deploy flow main;
```

### UDP server that logs base64 encoded YAML as one string per line to a file

A tremor flow that consumes UDP datagram events and writes them
to a file encoding as raw strings.

High level flow summary:

```mermaid
graph LR
    A{UDP Server} -->|receive UDP datagrams| B(select event from in into out)
    B -->|string encoded data| C[Log file]
```


```tremor title="config.troy"
define flow main
flow
  use tremor::connectors;
  use integration;
  
  # Encapsulate a UDP server that processes datagrams as strings
  define connector `udp-in` from udp_server
  with
    codec = "string",
    config = { 
      "url": "localhost:4242",
    }
  end;

  # Encapsualte a file based sink that stores events per line as a string
  define connector out from file
  with
    codec = "string",
    postprocessors = ["separate"],
    config = {
      "path": "../gen.log",
      "mode": "truncate"
    }
  end;


  create pipeline main from integration::out_or_exit;
  create connector `udp-in`;
  create connector debug from connectors::console;
  create connector exit from connectors::exit;
  create connector out;

  connect /connector/`udp-in` to /pipeline/main/in;
  connect /pipeline/main/out to /connector/out;
  connect /pipeline/main/out to /connector/debug;
  connect /pipeline/main/exit to /connector/exit/in;
end;

deploy flow main;
```

## Notes

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

### Exercises

* Modularise the solution allowing the following combinations
  * Deploy the client and server in separate tremor instances
  * Deploy the client and server in a single tremor instance
  * Use the `msgpack` codec instead of `base64` encoded YAML
  * Unpack the `base64` encoded YAML and write to a log file as line-delimited JSON
  * Add compression and decmopression


