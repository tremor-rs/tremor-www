---
sidebar_label: gbq_writer (Google Big Query)
sidebar_position: 1
---

# The `gbq_writer` Connector

The `gbq_writer` makes it possible to write events to [Google BigQuery](https://cloud.google.com/bigquery) by using its [gRPC] based [storage API v1].


## Configuration

```tremor
use std::time::nanos;

define connector gbq from gbq_writer
with
    config = {
        "table_id": "projects/tremor/datasets/test/tables/streaming_test",
        "connect_timeout": nanos::from_seconds(10),
        "request_timeout: nanos::from_seconds(10)
    }
```

The timeouts are in nanoseconds.

| option          | description                                                                                                      |
|-----------------|------------------------------------------------------------------------------------------------------------------|
| table_id        | The identifier of the table in the format: `projects/{project-name}/datasets/{dataset-name}/tables/{table-name}` |
| connect_timeout | The timeout in nanoseconds for connecting to the Google API                                                      |
| request_timeout | The timeout in nanoseconds for each request to the Google API. A timeout hit will fail the event.                |

## Metadata
There is no metadata needed for this connector.

## Payload structure

The event payload sent to the `gbq_writer` connector needs to be a [`record`](../../language/expressions.md#records) with field names being the table column names
and the values need to correspond to the table schema values.

Tremor values are mapped to Google Bigquery schema types according to the following value mapping. You need to provide the tremor value type on the right to feed a column of the left side.

| Google Bigquery type (gRPC type) | Tremor Value | Format                                                    |
|----------------------------------|--------------|-----------------------------------------------------------|
| Numeric                          | String       | `X.Y` (no thousands separator, `.` as decimal point)      |
| Bignumeric                       | String       | `X.Y` (no thousands separator, `.` as decimal point)      |
| Int64                            | Int          |                                                           |
| Double                           | Double       |                                                           |
| Bool                             | Bool         |                                                           |
| Bytes                            | Bytes        |                                                           |
| String                           | String       |                                                           |
| Date                             | String       | `YYYY-[M]M-[D]D`                                          |
| Time                             | String       | `[H]H:[M]M:[S]S[.DDDDDD&#124;.F]`                         |
| Datetime                         | String       | `YYYY-[M]M-[D]D[( &#124;T)[H]H:[M]M:[S]S[.F]]`            |
| Geography                        | String       | [OGC Simple Features](https://www.ogc.org/standards/sfa)  |
| Interval                         | String       | `[sign]Y-M [sign]D [sign]H:M:S[.F]`                       |
| Timestamp                        | String       | `YYYY-[M]M-[D]D[( &#124;T)[H]H:[M]M:[S]S[.F]][time zone]` |
| Struct                           | Record       |                                                           |



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

[gRPC]: https://grpc.io/
[storage API]: https://cloud.google.com/bigquery/docs/reference/storage/rpc/google.cloud.bigquery.storage.v1