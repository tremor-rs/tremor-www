---
sidebar_label: elastic
---

# The `clickhouse` Connector

The `clickhouse` collector aims integrate the [ClickHouse] database in Tremor. It has been tested with ClickHouse `v22.3-lts`.

[Clickhouse]: https://clickhouse.com/

This connector is a sink-only connector.

## Configuration

```troy
  # File: config.troy
  define connector clickhouse from clickhouse
  with
    config = {
      # The hostname of the database node
      "url": "localhost",

      # The database to write data to
      "database": "tremor_testing",

      # The table to write data to
      "table": "people",
      "columns": [
        # All the table's columns
        {
          # The column name
          "name": "name",
          # Its type
          "type": "String",
        }
        {
          "name": "age",
          "type": "UInt8",
        },
      ]
    }
  end;
```

## Value conversion

The following sections show how Tremor values are transformed into ClickHouse values. As numerous casts can be performed, the conversions are grouped by output type.

Any type which is not documented in the following sections is considered as unsupported.

### [`String`][CString]

[CString]: https://clickhouse.com/docs/en/sql-reference/data-types/string

ClickHouse `String`s values can be created from any Tremor string.

### [`UInt64`, `UInt64`][CNumerals]

[CNumerals]: https://clickhouse.com/docs/en/sql-reference/data-types/int-uint

`Int64`s can be created from any Tremor integer which is not greater than 2^63 - 1 (9223372036854775807).

`UInt64`s can be created from any non-negative Tremor number.


### [`DateTime`][CDateTime]

[CDateTime]: https://clickhouse.com/docs/en/sql-reference/data-types/datetime

`DateTime`s can be created from any non-negative Tremor integer. It represents the number of seconds elapsed since January 1st of 1970 at 00:00:00, in UTC timezone.


### [`DateTime64`][CDateTime64]

[CDateTime64]: https://clickhouse.com/docs/en/sql-reference/data-types/datetime64

ClickHouse `DateTime64` type offers various precisions. Tremor supports only four precisions:
  - `DateTime64(0)`, second-precise,
  - `DateTime64(3)`, millisecond-precise,
  - `DateTime64(6)`, microsecond-precise,
  - `DateTime64(9)`, nanosecond-precise.

`DateTime64(0)` (respectively `DateTime64(3)`, `DateTime64(6)` and `DateTime64(9)`) can be created from any Tremor integer representing the number of seconds (respectively milliseconds, microseconds and nanoseconds) elapsed since January 1st of 1970 at 00:00:00, in UTC timezone.

### [`IPv4`][CIPv4]

[CIPv4]: https://clickhouse.com/docs/en/sql-reference/data-types/domains/ipv4/

ClickHouse `IPv4`s can be created from strings or from arrays of octets.

A ClickHouse `IPv4` can be created from any 4-elements long array of integers in the [0 - 255] range.

A ClickHouse `IPv4` can be created from any string composed of four octets written as decimal and separated by dots, as defined in the [RFC 6943, section 3.1.1][rfc6943-1-1-1]

[rfc6943-1-1-1]: https://datatracker.ietf.org/doc/html/rfc6943#section-3.1.1


### [`IPv6`][CIPv6]

[CIPv6]: https://clickhouse.com/docs/en/sql-reference/data-types/domains/ipv4/

ClickHouse `IPv6` values can be created from strings or from arrays of octets.

A ClickHouse `IPv6` can be created from any 16-elements long array of integers in the [0 - 255 range].

A ClickHouse `IPv6` can be created from any [RFC 5952][rfc-5952]-compliant string.

[rfc-5952]: https://datatracker.ietf.org/doc/html/rfc5952


### Nullable

TODO

### Array

TODO
