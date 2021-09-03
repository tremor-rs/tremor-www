---
title: Continuous Benchmarking in Tremor
slug: continuous-benchmarking
author: Akshat Agarwal
author_url: https://twitter.com/humancalico
author_title: Tremor Mentee
tags: [benchmarking]
description: How we implemented a continuous benchmarking pipeline in Tremor.
draft: false
hide_table_of_contents: false
---

Hey I'm Akshat. Recently I had the chance to implement a continuous benchmarking
system for Tremor under the [LFX Mentorship](https://mentorship.lfx.linuxfoundation.org)
program.

### Why?

So why do we need continuous benchmarking? Let's step back and ask what
Tremor is and what problem is it trying to solve.

> Tremor is an event processing system originally designed for the needs of
> platform engineering and infrastructure. Tremor has been running in production
> since October 2018, processes 10 terabytes of data per day, or 10 billion
> messages per minute and 10 million metrics per second. Tremor achieves this
> with 10x footprint reduction in bare metal infrastructure and cloud based
> deployments in 6 ( and counting ) systems at Wayfair, whilst reducing memory
> usage by 10x and delivering better quality of service under conditions when
> our network is saturated at peak eCommerce trading lifecycles. As a secondary
> benefit, tremor is relatively low latency and relatively high throughput
> however this is an explicit non-goal of the project. Tremor is built for users
> that have a high message volume to deal with and want to build pipelines to
> process, route, or limit this event stream. [^1]

[^1]: See /docs/

Tremor emerged at Wayfair because the existing data distribution tools weren’t
performant enough for their needs. So for
the kind of problem Tremor is trying to solve it makes sense to track its
performance over time and try to make it better or at least prevent any major
regressions.[^2]

<!--truncate-->

[^2]: This might not be true for every change since if there is a feature that is much needed and adding it causes a little regression. We'll probably choose adding that feature instead of rejecting it because of the regression.

We already had a decent benchmarking system in place. There was already a
`test` subcommand in the tremor cli which can be used to run the benchmarks.
To run the whole benchmark suite run from the root of the tremor-runtime
repository you can run

```
tremor test bench tremor-cli/tests
```

The benchmarking system we had before this was, well it was mostly Heinz. So
the usual process was to submit a patch and if the patch affects the performance
in some way Heinz pulls the changes, runs the benchmarks and if he gives it a
green light then we’re good to go. So the goal was clear - replace Heinz.

Anyhoo, a continuous benchmarking system comprises of a few things

- Something to run your benchmarks
- Someplace to store the data that is generated from those benchmarks
- Something to view the stored benchmark data

Let’s go through these one by one. We already had our benchmarks and know how
to run them. We want our benchmark environment to be as consistent as possible
since any change in the environment would directly impact the benchmarks and it
won't be reliable. One way for it would be to run benchmarks on a bare metal
instance specifically dedicated for benchmarking. CNCF was kind enough to
provide us one where we could run our benchmarks and do our experiments. This
was great for me as well since `cargo build`s wouldn't take a week now.

You _can_ run your benchmarks on something like the VMs provided by
GitHub Actions as well but doing that would be unreliable due to the
[noisy neighbour effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors). [^3]

[^3]: Technically you can still benchmarks on the CI by measuring a different metric. See [benchmarking](https://pythonspeed.com/articles/consistent-benchmarking-in-ci/) in [noisy](https://bheisler.github.io/post/benchmarking-in-the-cloud/) [environments](https://bheisler.github.io/post/criterion-rs-0-3-4/).

Secondly, we need someplace to store that benchmark data so that we can view
how it changed over time. This can be a SQL database, a metrics oriented
database or just a simple git repository. We store our benchmark data in a JSON
file and push it to a git repository.

Finally, we use that JSON data to plot a time series graph to see how the
performance changed over time.

### How do we trigger the benchmark run and why GitHub Actions was a bad idea?

To trigger the benchmark runs we tried using the self hosted runner for GitHub
Actions but that comes with a few problems of it's own. Anyone who can create a
fork of the repo can modify the workflow file and run any arbitrary code on our
machine. [^4]

[^4]: See [github.com/actions/runner/issues/494](https://github.com/actions/runner/issues/494).

> We recommend that you only use self-hosted runners with private repositories.
> This is because forks of your repository can potentially run dangerous code on
> your self-hosted runner machine by creating a pull request that executes the
> code in a workflow. This is not an issue with GitHub-hosted runners because
> each GitHub-hosted runner is always a clean isolated virtual machine, and it
> is destroyed at the end of the job execution. Untrusted workflows running on
> your self-hosted runner pose significant security risks for your machine and
> network environment, especially if your machine persists its environment
> between jobs. Some of the risks include:
>
> - Malicious programs running on the machine.
> - Escaping the machine's runner sandbox.
> - Exposing access to the machine's network environment.
> - Persisting unwanted or dangerous data on the machine. [^5]

[^5]: [Self-hosted runner security with public repositories](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#self-hosted-runner-security-with-public-repositories).

The day after we were discussing this GitHub announced
[this](https://github.blog/2021-04-22-github-actions-update-helping-maintainers-combat-bad-actors/)
which meant that first-time contributors would now require a manual approval
from maintainers before any Actions workflow can run which solves the problem
but only partly. This solution assumes that someone has already committed to a
repository they won’t go rogue which is a fair assumption to make since most
spammers don't have any contributions to the project they are spamming to but
still an assumption that can’t be guaranteed.

So in the end we went with a webhooks based solution with a workflow like this:

- A PR gets merged to the main branch or a bench label is added to the PR.
- GitHub sends the payload to the webhooks server
- The webhooks server starts a docker container, builds tremor and benchmarks it
- It pushes the JSON data to the Git repository
- And finally destroys the Docker container

The end result looks something like this

![Image for the Tremor Benchmark website](/img/blog-images/LFX-blog-akshat/tremor-benchmark.png)

A lot of this setup for the charts is inspired by the Continuous Benchmarks of
[Deno](https://deno.land/benchmarks). We even use the same charting library.

### Tremor Community

This was the first formal internship/mentorship I’ve ever done and I
am grateful to be a part of it. I learned a lot in these past few months. A lot
has changed in the way that I think not just about code or how to approach a
problem but about work and life in general and I'm grateful for that. Thanks
Anup, Darach, Heinz and Matthias for being such awesome mentors. Thanks Ana for
always being so helpful. Thanks to the other mentors who were a part of this
program with me. It was a great time working with everyone and I look forward
to some more.

If you have any suggestions/thoughts/questions or just wanna say hi you can
message me on [Twitter](https://twitter.com/humancalico) or email me at
[humancalico@disroot.org](mailto:humancalico@disroot.org)
 
