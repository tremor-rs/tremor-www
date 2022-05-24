---
sidebar_label: dns (DNS Lookup)
sidebar_position: 1
---

# The `dns` Connector

The dns connector integrates DNS client access into tremor allowing programmatic DNS queries
against the system-provided domain name system  resolver.

:::note
No codecs, configuration, or processors are supported.
:::


## Configuration

```tremor
define connector my_dns from dns;
```

Commands sent to a DNS connector instances `in` port will yield responses via the connector
instances corresponding `out` port.

The response format is a set of record entries corresponding to the key provided as a value to
the `lookup` command

```tremor
[
  {"A": "1.2.3.4", "ttl": 60},
  {"CNAME": "www.tremor.rs", "ttl": 120}
]
```

## How do I lookup a domain?

```tremor
{
  "lookup": "tremor.rs"
}
```

## How do i lookup a `CNAME`?

```tremor
{
  "lookup": {
    "name": "tremor.rs",
    "type": "CNAME"
  }
}
```

## What record types are supported:

* `A`
* `AAAA`
* `ANAME`
* `CNAME`
* `TXT`
* `PTR`
* `CAA`
* `HINFO`
* `HTTPS`
* `MX`
* `NAPTR`
* `NULL`
* `NS`
* `OPENPGPKEY`
* `SOA`
* `SRV`
* `SSHFP`
* `SVCB`
* `TLSA`

:::note
If type is not specified `A` records will be looked up by default
:::


