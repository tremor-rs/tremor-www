---
sidebar_label: kv (Key/Value Store)
sidebar_position: 1
---

# The `kv` Connector

The `kv` connector provides a key value storate facility for tremor-based
applications allowing shared state across pipelines. The facility is useful
when in memory state via the `state` mechanism is not useful as the state is
not shared across pipeline instances or flows.

The `kv` service allows state to be shared to multiple pipelines within a a
single flow definition or unit of deployment.

The `kv` storage is persistent. A storage directory needs to be provided.

:::warning
If not found, the storage directory will be auto-created, or an error will be propagated.
:::

## Configuration

```tremor
define my_kv from kv
with
  "path" = "state",
end;
```

## How do I get values from the `kv` store?

We use the `kv` `get` command for this purpose.

```tremor
let $kv = { "get": "snot" };
let event = null;
```

This will result in either `null` when  not found or the stored value

## How do I put values into the `kv` store?

We use the `kv` `put` command for this purpose.

```tremor
let $kv = { "put": "snot",  };
let event = "badger";
```

This will result in either `null` when not found or the stored value

## How do I swap values in the `kv` store?

We use the `kv` `cas` command for this purpose.

```tremor
let $kv = {"cas": "heinz", "old": "gies"}
let event = "ketchup";
```

This will result in either `null` on success, or an event on the `err` stream upon failure

## How do I scan values in the `kv` store?

We use the `kv` `scan` command for this purpose.

```tremor
let $kv = {"scan": "", "end": "heinz"};
let event = 9;
```

This will return a value for each match in the specified scan range.

## How do I delete values in the `kv` store?

We use the `kv` `delete` command for this purpose.

```tremor
let $kv = { "delete": "heinz" };
let event = null;
```

## Application

Assuming the `$kv` metadata and event are as above, the following query connected to
an instance of the kv connector should suffice:

```tremor
select event from in into out;
```

## Correlation

The `$correlation` metadata key can be set so that a request and response from the
`kv` facility can be traced:

```tremor
let $correlation = "some-correlating-unique-data";
```


## Conditioning

:::note
To avoid write errors when other streams are writing to the same kv store we provide the
old value as a comparand so that the swap only occurs if the value hasn't changed independently
in the intervening time since we last read from the store for this key.
:::

