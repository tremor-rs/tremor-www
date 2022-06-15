---
title: TDengine colaboration
tags:  [collaboration, tdengine]
author: Tremor Team
author_url: https://github.com/tremor-rs
author_image_url: https://avatars.githubusercontent.com/u/60009416?s=200&v=4
draft: false
hide_table_of_contents: false
---

# TDengine colaboration

The best aspect of open source software is collaboration, not only of systems but of the people involved. It is wonderful to see them come together to take multiple parts to build something bigger out of them.

In this spirit, we had the chance to collaborate on a little project with the crew from [TDengine](https://tdengine.com/). For those that don’t know them yet, TDengine is an exciting new time-series database focusing on scalability, performance, and using SQL as a way to interact. Better yet using the [adapter](https://docs.tdengine.com/reference/taosadapter) allows using a number of protocols including the Influx Line Protocol.

This does compliment tremor extremely well, as what we build can be described as an event processing engine focusing on performance and usability, using SQL as a way to manipulate data. I’m pretty sure you can already see how those two pieces fit together.

But, we don’t want to go much into the technical details here the post over at the [TDengine blog](https://tdengine.com/2022/06/14/6434.html) does a wonderful job at that.

Working with Shuduo on this was a lot of fun, it was a fascinating forth and back of ideas and possible improvements. The integration was super painless with both systems supporting the same protocols, and it was really great to learn some tricks from the experts, like how queries work best in TDengine.

The most interesting part of this is however that both systems not only create the proverbial, larger sum than their parts are but also grow in the process.

And the speed the folks at TDengine do that is amazing, during the time of the collaboration, they not only released [an official grafana data source](https://grafana.com/grafana/plugins/tdengine-datasource/), released a [new version of TDengine itself](https://github.com/taosdata/TDengine/releases/tag/ver-2.6.0.1), but also created and published a [grafana dashboard](https://grafana.com/grafana/dashboards/16388) for system monitoring that made it extremely easy to add this.

For tremor we have discovered that we’re really starting to miss sliding windows, they have been on the roadmap for a while, but never with any direct requirement other than “it would be nice to have them”. While talking about real-time alerting, sliding windows have significant advantages over tumbling windows, so this collaboration revived that discussion - which means we’ll hopefully add them sooner rather than later.
