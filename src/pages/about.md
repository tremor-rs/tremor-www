---
title: About Us
description: More information about Tremor, where and how it works.
hide_table_of_contents: false
---

## About Us

Tremor is an early-stage event processing system for unstructured data, with rich support for structural pattern matching, filtering and transformation.


![Tremor Stats](../../static/img/tremor/stats.png)

Tremor is particularly well suited for log and metrics shipping, resulting in 10x fewer hosts, 10x fewer CPUs and 10x less memory footprint than alternatives such as Logstash.

For data distribution at scale, Tremor introduces proactive rate limiting and back-pressure handling. These facilities mean that when systems go over capacity (eg: during peak e-commerce trading environments, such as cyber-5)- where we may already be running with scaled up infrastructure- the upstream or downstream resource saturation has no negative impact on our production operations.

Tremor replaces Logstash, Telegraf, and other data distribution tools at [Wayfair](https://www.wayfair.com/), with a single high-performance tool that is easy to configure and use.