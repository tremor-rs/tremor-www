---
title: Support for the ClickHouse database in Tremor
author: Sasha Pourcelot
author_title: Tremor 2022 Spring Mentee
author_url: https://github.com/scrabsha/
tags: ["Database", "ClickHouse"]
draft: false
description: "Sasha's Mentorship experience"
---


# Introduction

I'm Sasha, a Computer Science student living in south-eastern France. I contributed to Tremor as part of the [Database Connector mentorship][dcm] proposed by the [LFX Mentorship Program][lfx] for Spring 2022. I was mentored by Matthias Wahl and got help from Darach Ennis, Heinz Gies and Ramona Łuczkiewicz.

[dcm]: https://mentorship.lfx.linuxfoundation.org/project/5c828028-f91c-4969-b4de-9efdb27bb869
[lfx]: https://lfx.linuxfoundation.org/tools/mentorship/

This blogpost summarizes my work at Tremor as a mentee and shows what could be done next.


# About Tremor

Tremor is an event processing system with the goal of allowing users to handle a high volume of messages by viewing them as a stream flowing between different nodes of a graph. Events go in and out of this graph thanks to connectors.

The interactions between each node and the connector configuration are defined using the [`troy`] programming language.

[`troy`]: https://www.tremor.rs/docs/edge/language/


# Abstract

My mentorship at Tremor was focused on building a connector for the [ClickHouse] database engine. More specifically, I was focused on the *sink* part, the one that allows data to flow out of the Tremor application.

[ClickHouse] is a database management system designed to allow for real-time analysis of high volumes of non-aggregated data. Its initial goal was to power the Yandex.Metrica analytics platform.

[ClickHouse]: https://clickhouse.com/


# The ClickHouse connector

The next subsections describe what I did during the mentorship.


## Interacting with a ClickHouse database in Rust

My first goal was to find a way to send requests to a ClickHouse node from a Rust program. It was a good start because it allowed me to experiment on the ClickHouse side without caring about what was happening in Tremor. I spent around three weeks playing on a separate repository named [`scrabsha/plays-with-clickhouse`] and getting extensive knowledge from Matthias about how Tremor works from the inside.

[`scrabsha/plays-with-clickhouse`]: https://github.com/scrabsha/plays-with-clickhouse

I found two Rust crates that could help us send requests to a ClickHouse database: [`clickhouse`] and [`clickhouse-rs`]. `clickhouse` is the first one I considered. I had to discard it because it was focused on concrete Rust types and needed to know *at compile time* what each datatype is composed of. The second crate was a bit more low-level and allowed us to do what we need.

[`clickhouse`]: https://crates.io/crates/clickhouse
[`clickhouse-rs`]: https://crates.io/crates/clickhouse-rs


## Writing a super simple sink

Once I got every ClickHouse detail right, I started playing with the Tremor side. There were multiple connectors already implemented in Tremor. I picked the simplest ones and started copying parts of it and quickly got something working.

The only challenge I encountered is that Tremor defines its own `Value` type, representing a value whose type is not really known at compile time, and uses it *a lot*. It was a bit disconcerting doing such things in Rust, as I felt I was writing dynamically-typed code in a statically-typed language, but I managed to get through it.


## Converting Tremor values to ClickHouse values

Once I was able to insert data in a database from Tremor, I started writing a conversion bridge for ClickHouse types, i.e. something that would handle the conversion of native Tremor values to their corresponding ClickHouse types. 

Most of the conversions are quite simple: an integer can be obtained from an integer, a string can be obtained from any string, and so on.

Some other conversions were less obvious. For instance, in order to create a ClickHouse IPv4 type, we could either use a string representing the address, or an array of four integers. The goal was to make every ClickHouse type constructible from a Tremor value. I tried to make every conversion as obvious as possible, and to document them as much as possible.

The first implementation of this mapping function was huge. It was about 250 lines of tricky and slightly incorrect code. I managed to rewrite it from scratch using another approach and it got way better.

Working on this specific part led me to open three pull request to the `clickhouse-rs` crate:
  - [Make Value fully constructible (#171)][#171]
  - [Compare IP adresses properly (#172)][#172]
  - [Allow for Enum8 and DateTime64 value comparison (#173)][#173]

[#171]: https://github.com/suharev7/clickhouse-rs/pull/171
[#172]: https://github.com/suharev7/clickhouse-rs/pull/172
[#173]: https://github.com/suharev7/clickhouse-rs/pull/173



## Testing

The conversion function described in the previous subsection was fairly complex. Each possible conversion and cast has been carefully tested in order to ensure that it behaves correctly. These tests were greatly simplified thanks to the use of declarative macro.

Some other tests were focused on testing the sink as a whole, and how it would interact with a ClickHouse database. In this kind of test, we would run ClickHouse Docker containers, create a ClickHouse sink, plug the sink to the container, send some events, and see what has been inserted in the ClickHouse side.


# What to do next?


## Improving the sink

### Automatically getting the table schema

It turns out that ClickHouse has a [`DESCRIBE TABLE` statement][describe-table], which allows to gather information about each column of a specific table. We currently rely on the end-user to provide us valid information about the table columns. Using this statement would reduce the amount of information we require from them, hence making it simpler to use.

[describe-table]: https://clickhouse.com/docs/en/sql-reference/statements/describe-table

### Inserting data concurrently

The current implementation of the ClickHouse container uses a single database connection object, which is reused across insertions. A good way to improve this system is to use multiple concurrent connections, so that we could insert multiple batch of events at once.

A similar pattern has already been implemented in Tremor as part of the [`elastic`] connector. As such, most of the required machinery is already there.

[`elastic`]: https://www.tremor.rs/docs/edge/reference/connectors/elastic

## The source part

This mentorship was focused on building a sink for ClickHouse. The next step could be to add a source connector, so that coming from a ClickHouse database can be ingested directly into a Tremor application.

ClickHouse has a feature allowing to watch for updates in a given table. This way, we can simulate a stream of data, and make it flow in the Tremor system. Each time some data is inserted in the table, we can retrieve it, convert it into Tremor value and make it flow into the graph of nodes described earlier.

This is something that we totally want to see in Tremor in the future. We can't wait for the [`WATCH` statement][watch] to be considered stable.

[watch]: https://clickhouse.com/docs/en/sql-reference/statements/watch/
