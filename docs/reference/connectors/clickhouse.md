---
sidebar_label: clickhouse
---

> ClickHouse is an open-source [column-oriented DBMS][co-dbms] (columnar database management system) for [online analytical processing][olap] (OLAP) that allows users to generate analytical reports using SQL queries in real-time.

Source: [Wikipedia][wikipedia-ch].

[co-dbms]: https://en.wikipedia.org/wiki/Column-oriented_DBMS
[olap]: https://en.wikipedia.org/wiki/Online_analytical_processing
[wikipedia-ch]: https://en.wikipedia.org/wiki/ClickHouse

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

      # Compression
      "compression": "lz4",

      # The database to write data to
      #
      # This field is not mandatory.
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

### Compression

Specifying a compression method is optional. This setting currently supports [`lz4`] and `none` (no compression). If no value is specified, then no compression is performed.

[`lz4]: https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)


### Database

Specifying a database is optional. If no database name is supplied, then the `default` database is used.

## Value conversion

The following sections show how Tremor values are transformed into ClickHouse values. As numerous casts can be performed, the conversions are grouped by output type.

Any type which is not documented in the following sections is considered as unsupported.

### [`String`][CString]

[CString]: https://clickhouse.com/docs/en/sql-reference/data-types/string

ClickHouse `String`s values can be created from any Tremor string.

### Integers ([`UInt8`, `UInt16`, `UInt32`, `UInt64`, `Int8`, `Int16`, Int32`, `Int64`][CNumerals])

[CNumerals]: https://clickhouse.com/docs/en/sql-reference/data-types/int-uint

The following table shows the valid ranges where each numerical type can be created:

| Type     | Lower Bound (inclusive) | Upper Bound (inclusive) |
| -------- | ----------------------- | ----------------------- |
| `UInt8`  | 0                       | 255                     |
| `UInt16` | 0                       | 65535                   |
| `UInt32` | 0                       | 4294967295              |
| `UInt64` | 0                       | 18446744073709551615    |
| `Int8`   | - 128                   | 127                     |
| `Int16`  | - 32768                 | 32767                   |
| `Int32`  | - 2147483648            | 2147483647              |
| `Int64`  | - 9223372036854775808   | 9223372036854775807     |

### [`DateTime`][CDateTime]

[CDateTime]: https://clickhouse.com/docs/en/sql-reference/data-types/datetime

`DateTime`s can be created from any non-negative Tremor integer. It represents the number of seconds elapsed since January 1st of 1970 at 00:00:00, in UTC timezone. It is encoded as a 32 bit unsigned integer.

Storing a `DateTime` in 32-bit format is likely to lead to a [Year 2038 problem][year-2038] problem. It is advised to use `DateTime64(0)`, as described below.

[year-2038]: https://en.wikipedia.org/wiki/Year_2038_problem


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

Any column type can be marked as nullable. It allows to make optional the key-value pair for the events that are sent through the sink.

A column whose type is a nullable `UInt8` can be declared as follows:

```json
{
    "name": "column_name",
    "type": { "Nullable": "UInt8" }
}
```

### Array

Arrays can store any number of elements.

A column whose type is an array of `UInt8` can be declared as follows:

```json
{
    "name": "column_name",
    "type": { "Array": "UInt8" }
}
```
