---
title: Tremors - April '22
tags:  [collaboration, wayfair, tremors]
author: Gary + The Tremor Team
author_url: https://github.com/GaryPWhite
author_image_url: https://avatars.githubusercontent.com/u/7660110?v=4
draft: false
hide_table_of_contents: true
---

Welcome, Tremor Enthusiasts! This is the first post in a series intended inform and entertain Tremor Technologists with recent changes in the `tremor` project. We'll mostly focus these posts on Pull Requests and other notable developments. With these posts, you can stay informed and learn more about the project without having to read pull requests, or wait for release notes.

This posts' theme is _open and improved communication_.

## Release Candidates

Where's the next release of Tremor?!

Tremor's release schedule is becoming a bit more regular. We're releasing [about twice a year](https://github.com/tremor-rs/tremor-runtime/releases), every 6 to eight months. The next release of Tremor should include an exciting new way to write plugins with the [plugin development kit](https://github.com/tremor-rs/tremor-runtime/issues/791), along with other goodies for faster, [well understood tremor scripts](https://github.com/tremor-rs/tremor-runtime/pull/1571/files) and plenty of other [performance](https://github.com/tremor-rs/tremor-runtime/pull/1539) and [bug fixes](https://github.com/tremor-rs/tremor-runtime/pull/1537).

Most notable as an update for us all is that Tremor has a [release candidate](https://github.com/tremor-rs/tremor-runtime/releases/tag/v0.12.0-rc.1) live. If we're pleased with it, then a new version of tremor is soon to be released!

In this article, Let's dive into three topics: [CI](#ci), [PDK](#pdk-plugin-development-kit), and [performance](#performance)!

## CI

One of my favorite parts of working with tremor, or any project, is using automation. Running a bunch of stuff on my machine can be quicker, but less reliable than a well established automation platform. Tremor makes an effort to improve Continuous integration regularly; and this month is no exception.

One of our active members of the Tremor Community, [Pimmy](https://github.com/PrimalPimmy) has taken it upon himself to dramatically improve the CI and relase process for `tremor-runtime`.

The [new process](https://github.com/tremor-rs/tremor-runtime/pull/1545/files) will automatically publish a release when we're ready. Using this automatino, we can bump versions appropriately with specially named branches and some fancy [GitHub Actions](https://github.com/tremor-rs/tremor-runtime/runs/6026528631?check_suite_focus=true). This lets the Tremor team take full advantage of the seamless GitHub experience from merge -> release, complete with logs and links directly from the Pull Request. We can even extract release notes and [bump versions automatically](https://github.com/tremor-rs/tremor-runtime/pull/1563/files). Once again, truly great work from our community here!

## PDK (Plugin Development Kit)

I won't spend too much time on this point, since the lovely [marioortizmanero](https://github.com/marioortizmanero) has already taken the time to write out [a full blog post](https://nullderef.com/blog/plugin-abi-stable/) or [two](https://nullderef.com/blog/plugin-impl/) on the topic. We'll give a full breakdown another time. For now: know that Tremor is currently in the works of creating an easier way for developers to plug their own binaries into the system to run connectors and pipelines.

## Performance

Tremor cares [a lot about performance](https://www.tremor.rs/community/development/benchmarks/LogstashBenchmark). As you may already know from [TremorCon 2021's fabulous talks](https://www.youtube.com/watch?v=xsowS5hEKRg&list=PLNTN4J6tdf20vy14FVOazLTdou_8xyvfe&index=4); it was originally created and adopted for performance gains in Wayfair's event processing infrastructure. There are plenty of performance gains to make in a project as large as Tremor, both inside the project and through dependencies.

One such dependency we depend on [to parse gigabytes of JSON per second](https://simdjson.org/) is [simd_json](https://docs.rs/simd-json/0.3.18/simd_json/index.html). `simd_json` is a port of the simdjson c++ library into rust. It can not only parse from JSON into Rust, but aid the `serde` library that can easily serialize and deserialize Rust data structures. That's pretty handy for an event processing project that will have to marshal plenty of events from disparate sources of all data forms! As you might imagine, a project like `simd_json` comes with a lot of configuration options, and optimizations behind those options.

Further than just the configuration that you might give `serde`, or `simd_json`, is the options you may give to the [rust compiler](https://github.com/simd-lite/simd-json/blob/main/.cargo/config). The compiler, by default, [compiles for the largest compatability.](https://docs.rs/simd-json/latest/simd_json/index.html) For best performance on a specific plaform, we make use of the `target-feature` flag. This will allow us to target specific features available on different platforms and CPUs.

It should be no surprise that we continue this effort within the Tremor team. Know that we also depend on our community, such as a [pull request from scarabsha](https://github.com/tremor-rs/tremor-runtime/pull/1522). Sasha idenfitifed additional target-features for the target `x86_64-unknown-linux-gnu` that speed up the performance of `simd-json`. There's not a benchmark to show exactly how much faster this made json processing, but we appreciate the fact that it will undoubtedly increase performance for some clients of Tremor.

## Thank You

The Tremor project as strong as the community around it. Reading this article, making contributions, and generally being involved in the project makes us more successful. Thank you for reading and contributing! See you next time.

- Gary, and the Tremor team.
