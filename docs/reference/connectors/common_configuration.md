---
sidebar_label: Configuration
---

# Common Configuration

This section explains common configuration options that are used across many connectors.

## tls

The `tls` configuration option is for enabling and further configuring TLS encrypted transport, both for client and server side connections.

### Client

The client side `tls` configuration can be set to a record with all available configuration options:

| Option | Description                                                                                                              | Type   | Required | Default value                                                    |
|--------|--------------------------------------------------------------------------------------------------------------------------|--------|----------|------------------------------------------------------------------|
| cafile | Path to the pem-encoded certificate file of the CA to use for verifying the server certificate                           | string | no       |                                                                  |
| domain | The DNS domain used to verify the server's certificate.                                                                  | string | no       | If not provided the domain from the connection URl will be used. |
| cert   | Path to the pem-encoded certificate (-chain) to use as client-side certificate. (`cert` and `key` must be used together) | string | no       |                                                                  |
| key    | Path to the private key to use together with the client-side certificate in `cert`.                                      | string | no       |                                                                  |

Example:

```tremor
define connector http from http_client
with
    config = {
        "url": "http://example.org/"
        "tls": {
            "cafile": "/path/to/ca_certificates.pem",
            "domain": "example.org",
            "cert"  : "/path/to/client_certificate_chain.pem",
            "key"   : "/path/to/client_private_key.pem" 
        }
    },
    codec = "string"
end;
```

It can also be set to just a boolean value. If set to `true`, the CA file provided by the operating system are used to verify the server certificate and the domain of the connection URL is used for verifying the server's domain.

Example:

```tremor
define connector tcp from tcp_client
with
    config = {
        "url": "example.org:12345"
        "tls": true
    },
    codec = "binary"
end;
```

Used by the following connectors:

* [tcp_client](./tcp.md#client)
* [ws_client](./ws.md#secure-client)
* [http_client](./http.md#client)
* [elastic](./elastic.md)

### Server

The server side `tls` configuration is used to configure server-side TLS with certificate (`cert`) and private key (`key`).

| Option | Description                                                                              | Type   | Required | Default value |
|--------|------------------------------------------------------------------------------------------|--------|----------|---------------|
| cert   | Path to the pem-encoded certificate file to use as the servers TLS certificate.          | string | yes      |               |
| key    | Path to the private key corresponding to the public key inside the certificate in `cert` | string | yes      |               |

Used by the following connectors:

* [tcp_server](./tcp.md#server)
* [ws_server](./ws.md#secure-server)
* [http_server](./http.md#server)

## auth

Configuration for HTTP based connectors for setting the `Authorization` header.

Used by connectors:

* [http_client](./http.md#client)
* [elastic](./elastic.md)

### basic

Implements the [`Basic` Authentication Scheme](https://datatracker.ietf.org/doc/html/rfc7617).

Requires `username` and `password` fields.

Example:

```tremor
define connector client from http_client
with
    codec = "json",
    config = {
        "url": "http://localhost:80/path?query",
        "auth": {
            "basic": {
                "username": "snot",
                "password": "badger"
            }
        }
    }
end;
```

### bearer

Implements [Bearer Token Authorization](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1).

It only needs the token to use as a string.

Example:

```tremor
define connector client from elastic
with
    config = {
        "nodes": [
            "http://localhost:9200"
        ],
        "auth": {
            "bearer": "token"
        }
    }
end;
```

This will add the following header to each request:

```
Authorization: Bearer token
```

### elastic_api_key

Implements elasticsearch [ApiKey auth](https://www.elastic.co/guide/en/elasticsearch/reference/8.2/security-api.html#security-api-keys).

Requires fields `id` which must contain the api key id and `api_key` which contains the api key to use.

Example:

```tremor
define connector elastic_keyed from elastic
with
    config = {
        "nodes": [
            "http://localhost:9200"
        ],
        "auth": {
            "elastic_api_key": {
                "id": "ZSHpKIEBc6SDIeISiRsT",
                "api_key": "1lqrzNhRSUWmzuQqy333yw"
            }
        }
    }
end;
```

### gcp

Provides auto-renewed tokens for GCP service authentication.

Token used is scoped to https://www.googleapis.com/auth/cloud-platform
Looks for credentials in the following places, preferring the first location found:

* A JSON file whose path is specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable.
* A JSON file in a location known to the gcloud command-line tool.
* On Google Compute Engine, it fetches credentials from the metadata server.

Example:

```tremor
define connector gcp_client from http_client
with
    codec = "json",
    config = {
        "url": "http://google.api.snot",
        "auth": "gcp"
    }
end;
```

### none

No `Authorization` is used.