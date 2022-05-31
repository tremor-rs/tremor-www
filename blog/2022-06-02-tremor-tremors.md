---
title: Tremors - May '22
tags:  [collaboration, wayfair, tremors]
author: Gary + The Tremor Team
author_url: https://github.com/GaryPWhite
author_image_url: https://avatars.githubusercontent.com/u/7660110?v=4
draft: false
hide_table_of_contents: true
---

Welcome, Tremor Enthusiasts! This post is another in a series intended to inform and entertain Tremor Technologists with recent changes in the `tremor` project. We'll mostly focus these posts on Pull Requests and other notable developments. With these posts, you can stay informed and learn more about the project without having to read pull requests, or wait for release notes.

Have you ever cleaned the house for company, to make it seem like nobody lives there? That’s basically what we’ve been up to getting ready for 0.12.0. It’s a big deal. We're trying to make the codebase spotless with plenty of sweeping up. We also thank our contributors for all the hard work put into automation and new stuff this month!

## New Stuff

Most exciting of all: [We made the 0.12.0 release](https://github.com/tremor-rs/tremor-runtime/releases/tag/v0.12.0)! We put a lot of cool stuff in right before releasing, so finish the article before you jump in!

Being able to make a new tremor project has been a pain point from some of our users. We wanted [getting started](https://www.tremor.rs/docs/0.12/getting-started/) to be as easy as typing a command. Now it is! You can simply call our [fancy new command](https://github.com/tremor-rs/tremor-runtime/pull/1671) to make a `new` tremor template. Quick and easy!

Our elasticsearch integrations got some upgrades with support for [raw elastic payloads](https://github.com/tremor-rs/tremor-runtime/pull/1653) through our connector, and [native support for auth](https://github.com/tremor-rs/tremor-runtime/pull/1663) between elastic <-> tremor. No more need for custom headers on connectors! Check out the links provided for more details, and we'll update the docs soon.

## CI

The CI has been changed heavily in the last month. We have [PrimalPimmy](https://github.com/PrimalPimmy) on GitHub to thank for much of the contributions. Thank you!

We've tweaked our CI when we [create a release](https://github.com/tremor-rs/tremor-runtime/pull/1679) that should prevent creating crates unexpectedly. We also trigger [many workflows across our projects](https://github.com/tremor-rs/tremor-runtime/pull/1673) from a release flow in tremor-runtime. We also decided that publishing in [many steps](https://github.com/tremor-rs/tremor-runtime/pull/1649) would help to prevent [single points](https://github.com/tremor-rs/tremor-runtime/pull/1644) of failure.

We can also better provide [descriptive options](https://github.com/tremor-rs/tremor-runtime/pull/1624) when we create a release. We can also provide [better options for publishing](https://github.com/tremor-rs/tremor-runtime/pull/1609).

Lastly, we tweaked [how much we use sed](https://github.com/tremor-rs/tremor-runtime/pull/1682/files) when we cut a release. This one is great for a quick example:

```bash
cd tremor-script
sed -e "s/^tremor-common = { version = \"${old}\"/tremor-common = { version = \"${new}\"/" -i.release "Cargo.toml"
sed -e "s/^tremor-influx = { version = \"${old}\"/tremor-common = { version = \"${new}\"/" -i.release "Cargo.toml"
sed -e "s/^tremor-value = { version = \"${old}\"/tremor-common = { version = \"${new}\"/" -i.release "Cargo.toml"
```

Where we used to manually edit each project's `.toml` file, we now do this as part of our [GitHub Actions workflow](https://github.com/tremor-rs/tremor-runtime/actions) elsewhere.

## Sweeping Up

As we mentioned before, there was a lot of sweeping up we wanted to finish before the newest release.

One of the more interesting fixes we put in was a small bug for `tremor run`. Something that had gone unnoticed for a while was an [upper limit](https://github.com/tremor-rs/tremor-runtime/pull/1582) when running tremor scripts. After 150 seconds, the script would time out. A strange and small feature limitation we didn't notice.

We had a lot of work specifically to do on connectors.

- Some connectors wrote [more events](https://github.com/tremor-rs/tremor-runtime/pull/1662) than they should
- Edge cases existed where we would acknowledge error events [without processing them](https://github.com/tremor-rs/tremor-runtime/pull/1670).
- Some [bench connectors](https://github.com/tremor-rs/tremor-runtime/pull/1651) would not stop as expected.
- Show errors on [unknown connector](https://github.com/tremor-rs/tremor-runtime/pull/1606) types, instead of silently failing.
- Make destructive connector actions [much more difficult](https://github.com/tremor-rs/tremor-runtime/pull/1668) to accidentally stumble upon.

We also removed a limitation we had for code coverage. Where our contributors would have to avoid [functionally any drop at all](https://github.com/tremor-rs/tremor-runtime/pull/1666) in code coverage, we now allow a `.1` percent drop.

If you were a using the `tremor api` sub command, you should be aware that we've [completely deprecated](https://github.com/tremor-rs/tremor-runtime/pull/1650) the subcommand.

## Bug Fixes

Our bug fixes were pretty few over ht elast month. We had some [publishing](https://github.com/tremor-rs/tremor-runtime/pull/1655), [connecting](https://github.com/tremor-rs/tremor-runtime/pull/1702), and [regular expressions](https://github.com/tremor-rs/tremor-runtime/pull/1677) patches. We updated our new [code coverage tool](https://github.com/tremor-rs/tremor-runtime/pull/1676), codecov, to more accurately track our coverage. We also found that piping information to tremor would [sometimes cause issues](https://github.com/tremor-rs/tremor-runtime/pull/1701) and fixed that.

## Thank You

The Tremor project as strong as the community around it. Reading this article, making contributions, and generally being involved in the project makes us more successful. Thank you for reading and contributing! See you next time.

- Gary, and the Tremor team.
