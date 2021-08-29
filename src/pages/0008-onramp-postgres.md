- Feature Name: `rfc_0008_onramp_postgres`
- Start Date: 2020-01-21
- Tremor Issue:
  [tremor-rs/tremor-runtime#0015](https://github.com/tremor-rs/tremor-rfcs/issues/15)
- RFC PR: [tremor-rs/tremor-rfcs#0008](https://github.com/tremor-rs/tremor-rfcs/pull/14)

# Summary
[summary]: #summary

Pull data from Postgres tables.

# Motivation
[motivation]: #motivation

We see use cases a function of features supported by PostgreSQL out of the box,
as well as additional features introduced as extensions or otherwise packaged as
completely separate products. Primary examples that we are looking at are
[TimescaleDB](https://www.timescale.com/) and [PipelineDB](https://www.pipelinedb.com/).

The ultimate goal is to be able to reliably pipe in data from PostgreSQL core to Tremor
engine.

# Guide-level explanation
[guide-level-explanation]: #guide-level-explanation

PostgreSQL is a standard Tremor onramp. It is configured by passing in
standard PostgreSQL connection string arguments, such as `host`, `port`, `user`,
`password` and `dbname`.

In addition to connection string arguments, we require:
* `interval` in milliseconds that specifies the time we wait before executing the next query
* `consume_from` specifies the timestamp from which to backfill data
* `query` in form of standard `SELECT` query which retrieves rows from a table
  or view

Unlike other onramps implemented so far, PostgreSQL onramp will persist
`consume_from` and `consume_until`, allowing recovery from error conditions or other failures.

Example `onramp.yml`:

```yml
id: db
type: postgres
codec: json
config:
  host: localhost
  port: 5432
  user: postgres
  password: example
  query: "SELECT id, name from events WHERE produced_at <= $1 AND produced_at >
  $2"
  interval_ms: 1000
  dbname: sales
  cache:
    path: "/path/to/cache.json"
    size: 4096
```

Cache is a memory mapped region, either file-based or anonymous.

# Reference-level explanation
[reference-level-explanation]: #reference-level-explanation

# Drawbacks
[drawbacks]: #drawbacks

The onramp does not provide an implementation of all types Postgres supports and
the entirety of query language (for example, LISTEN/NOTIFY semantics).

# Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

As a starting point, or first implementation, supporting basic `SELECT`
statements with a time interval as additional `WHERE` clause supports the major use
case: ingesting rows from a table or view.

Alternative approach would utilize PostgreSQL [_single row
mode_](https://www.postgresql.org/docs/12/libpq-single-row-mode.html) suitable
for ingestion of results returned by queries that span a large number of rows.
Ensuring _at-most-once_ ingestion of rows would be a potential problem and a
time-consuming/API-breaking implementation.

Other approaches, such as trigger-based watches or binary log readers are also a
possibility.

# Prior art
[prior-art]: #prior-art

[Data Integration](https://en.wikipedia.org/wiki/Data_integration)

# Unresolved questions
[unresolved-questions]: #unresolved-questions

# Future possibilities
[future-possibilities]: #future-possibilities

For users that utilize PostgreSQL as an event store, which seems to be a more
common use case lately, support for
[`LISTEN/NOTIFY`](https://www.postgresql.org/docs/12/sql-notify.html) would be essential to
become one of modes of this onramp.


Support multiple queries in the same onramp.

More flexible means of specifying parameters.
