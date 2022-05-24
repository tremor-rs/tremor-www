---
sidebar_label: gbq (Google Big Query)
sidebar_position: 1
---

# The `gbq` Connector

The GBQ connector integrates [Google BigQuery](https://cloud.google.com/bigquery).


## Configuration

```tremor
define connector gbq from gbq
with
    config = {
        "table_id": "projects/tremor/datasets/test/tables/streaming_test",
        "connect_timeout": 1000000,
        "request_timeout: 1000000
    }
```

The timeouts are in nanoseconds.

| option          | description                                                                                                      |
|-----------------|------------------------------------------------------------------------------------------------------------------|
| table_id        | The identifier of the table in the format: `projects/{project-name}/datasets/{dataset-name}/tables/{table-name}` |
| connect_timeout | The timeout in nanoseconds for connecting to the Google API                                                      |
| request_timeout | The timeout in nanoseconds for each request to the Google API                                                    |

## Metadata
There is no metadata needed for this connector.

## Payload structure

Currently the connector is only a sink - it expects events sent to it to be objects, where the keys match the table field names, and values are the values.

### Example

For a table defined like:

```bigquery
CREATE TABLE test (
    id INT64,
    payload STRUCT<a INT64, b INT64>,
    name STRING
)
```

An example event payload would be:

```json
{
  "id": 1234,
  "payload": {"a": 1, "b": 2},
  "name": "Tremor"
}
```