# gelf-chunking

Reassembles messages that were split apart using the [GELF chunking protocol](https://docs.graylog.org/en/3.0/pages/gelf.html#chunking).

## How do I handle compressed GELF?

Where GELF messages are compressed, say over UDP, and the chunks are themselves compressed we can
use decompression processors to transform the raw stream to the tremor value system by leveraging
processors in tremor in concert with the `json` codec.

```tremor
define connector example from udp_client
with
  codec = "json",
  preprocessors = [	
    "decompress",               # Decompress stream using a supported decompression algorithm
    "gelf-chunking",            # Parse out gelf messages
    "decompress",               # Decompress chunk using a supported decompression algorithm
  ],
  config = {
    "url": "127.0.0.1:12201"	# We are a client to a remote UDP service
  }
end;
```

The same methodology with a tcp backed endpoint where we're listening as a server:

```tremor
define connector example from tcp_server
with
  codec = "json",
  preprocessors = [	
    "decompress",               # Decompress stream using a supported decompression algorithm
    "gelf-chunking",            # Parse out gelf messages
    "decompress",               # Decompress chunk using a supported decompression algorithm
  ],
  config = {
    "url": "127.0.0.1:12201"    # We are acting as a TCP server on port 12201 bound over localhost
  }
end;
```

