---
id: Contributing
title: Contributing to Tremor
---

# Contributing to Tremor

Thank you for your interest in contributing to the Tremor project!

There are many ways to contribute, and we appreciate all of them.

For [developers](#contributing-as-a-developer) and [technical writers](#contributing-as-a-technical-writer) we have some task or activity based
guides on how to contribute documented here.

If you are a web designer, a graphic designer or you would like to contribute
in another way then we recommend getting in touch via [chat](#tremor-chat).

If this is your first time contributing, we would like to thank you for spending time on the project and contemplating contributing! If you need any guidance or
support making your contribution; our community is ready to assist and can be
reached directly via our [chat](#tremor-chat) or through our issue tracking system.
## Contributing as a developer

[contributing-as-a-developer]: #contributing-as-a-developer

As a developer there are a number of ways to contribute to the project
which we have documented below:

### How to contribute as a developer

If you would like to contribute a new feature, then:

  - [Submit a feature request](#feature-requests)

If you would like to report a bug, then:

  - [Submit a bug report](#bug-reports)

If you would like to improve the build system, then:

  - [Improve the build system](#the-build-system)

If you have written some code and would like to submit a pull request, then:
  - [Submitting a pull request](#pull-requests)
    - [Managing external dependencies](#external-dependencies)

If you have found an issue you would like to contribute against, then:

  - [Attending to known and tracked issues](#issue-triage)

If you would like to enhance, extend or make a large contribution/change to tremor, then:

  - [Out-of-tree Contributions](#out-of-tree-contributions)

[code-of-conduct]: CodeOfConduct

### Feature Requests

[feature-requests]: #feature-requests

To request a change to the way that Tremor works, please head over
to the [RFCs repository](https://github.com/tremor-rs/tremor-rfcs) and view the
[README](https://github.com/tremor-rs/tremor-rfcs/blob/main/README.md)
for instructions.

### Bug Reports

[bug-reports]: #bug-reports

While bugs are unfortunate, they're a reality in software. We can't fix what we
don't know about, so please report liberally. If you're not sure if something
is a bug or not, feel free to file a bug anyway.

**If you believe reporting your bug publicly represents a security risk to Tremor users,
please follow our [instructions for reporting security vulnerabilities](policies/security)**.

If you have the chance, before reporting a bug, please [search existing
issues](https://github.com/tremor-rs/tremor-runtime/search?q=&type=Issues&utf8=%E2%9C%93),
as it's possible that someone else has already reported your error. This doesn't
always work, and sometimes it's hard to know what to search for, so consider this
extra credit. We won't mind if you accidentally file a duplicate report.

Similarly, to help others who encountered the bug find your issue,
consider filing an issue with a descriptive title, which contains information that might be unique to it.
This can be the language or compiler feature used, the conditions that trigger the bug,
or part of the error message if there is any.
An example could be: **"impossible case reached" on match expression in tremor scripting language**.

To open an issue is as follow [this
link](https://github.com/tremor-rs/tremor-runtime/issues/new) and filling out the fields.
Here's a template that you can use to file a bug, though it's not necessary to
use it exactly:

```
    <short summary of the bug>

    I tried this code:

    <code sample that causes the bug>

    I expected to see this happen: <explanation>

    Instead, this happened: <explanation>

    ## Meta

    `tremor-script --version`:

    Backtrace:
```

All three components are important: what you did, what you expected, what
happened instead. Please include the output of `tremor --version`,
which includes important information about what platform you're on, what
version of Rust you're using, etc.

Sometimes, a backtrace is helpful, and so including that is nice. To get
a backtrace, set the `RUST_BACKTRACE` environment variable to a value
other than `0`. The easiest way to do this is to invoke `tremor` like this:

```bash
$ RUST_BACKTRACE=1 tremor...
```

### The Build System

For info on how to configure and build the project, please see [the tremor build guide][tremor-build-guide].
This guide contains info for contributions to the project and the standard facilities. It also lists some
really useful commands to the build system, which could save you a lot of time.

[tremor-build-guide]: ../../community/development/quick-start/

### Pull Requests

[pull-requests]: #pull-requests

Pull requests are the primary mechanism we use to change Tremor. GitHub itself
has some [great documentation][about-pull-requests] on using the Pull Request feature.
We use the "fork and pull" model [described here][development-models], where
contributors push changes to their personal fork and create pull requests to
bring those changes into the source repository.

[about-pull-requests]: https://help.github.com/articles/about-pull-requests/
[development-models]: https://help.github.com/articles/about-collaborative-development-models/

Please make pull requests against the `main` branch.

Tremor follows a no merge policy, meaning, when you encounter merge
conflicts you are expected to always rebase instead of merge.
E.g. always use rebase when bringing the latest changes from
the main branch to your feature branch.
Also, please make sure that fix-up commits are squashed into other related
commits with meaningful commit messages.

GitHub allows [closing issues using keywords][closing-keywords]. This feature
should be used to keep the issue tracker tidy. However, it is generally preferred
to put the "closes #123" text in the PR description rather than the issue commit;
particularly during rebasing, citing the issue number in the commit can "spam"
the issue in question.

[closing-keywords]: https://help.github.com/en/articles/closing-issues-using-keywords

All pull requests are reviewed by another person.

If you want to request that a specific person reviews your pull request,
you can tag them in the pull request description or in comments.

For example, [Sharon Koech][Sharon] and [Darach Ennis][Darach] usually review documentation changes. So if you were to make a documentation change, tag one
or both in your pull request. You may also wish to tag other contributors or
other community members as appropriate.

```
    @skoech @darach
```

You can `tag` or add the `github` usernames preceded by an `@` or `at` symbol in the content body of your pull request submission. This is entirely optional. If you have no preference this is fine too. We aim to work through pull requests as fast as possible and we monitor continuously for new requests.

Once someone has reviewed your pull request, they will approve the
pull request - leaving a comment so that you are notified - or some
changes may be requested.

For example - tremor uses pedantic lint checks and obeys the rust formatting
tool. Our CI/CD system runs automated checks that cover these and other things
so we require these checks to go green and to pass. Sometimes it takes a few
tweaks before they go green and this is ok. We sometimes forget too - this is
why we have the checks automated!

Once your merge request is approved it will enter the merge queue.

[Darach]: https://github.com/darach
[Sharon]: https://github.com/skoech

Speaking of tests, Rust has a comprehensive test suite. More information about
it can be found [here](https://github.com/tremor-rs/tremor-runtime/blob/main/docs/development/testing.md).

#### External Dependencies

Currently building the Tremor project will also build the following external projects:

- [clippy](https://github.com/rust-lang/rust-clippy)
  - You can check clippy via [cargo](https://doc.rust-lang.org/cargo/)
    ```shell
    $ cargo clippy --all
    ```
- [rustfmt](https://github.com/rust-lang/rustfmt)
  - You can format code via [cargo](https://doc.rust-lang.org/cargo/)
    ```shell
    $ cargo fmt --all
    ```

We do not allow tests to break, or code coverage to reduce. We recommend running
the test suite and adding any relevant tests to cover any added or changed code and removing tests for code that has been removed.

```shell
$ cargo test --all
```

Code coverage will be setup and executed on your behalf by the build system and
[reports](https://coveralls.io/github/tremor-rs/tremor-runtime?branch=main) generated that you can navigate.

### Issue Triage

Sometimes, an issue will stay open, even though the bug has been fixed. And
sometimes, the original bug may go stale because something has changed in the
meantime.

It can be helpful to go through older bug reports and make sure that they are
still valid. Load up an older issue, double check that it's still true, and
leave a comment letting us know if it is or is not. The [least recently
updated sort][lru] is good for finding issues like this.

[lru]: https://github.com/tremor-rs/tremor-runtime/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-asc

### Out-of-tree Contributions

There are a number of other ways to contribute to Tremor that don't deal with
this repository.

Answer questions in the _Get Help!_ channels from the [Tremor Chat][tremor-chat].

Participate in the [RFC process](https://github.com/tremor-rs/tremor-rfcs).

## Contributing as a Technical Writer

[contributing-as-a-technical-writer]: #contributing-as-a-technical-writer

As a technical writer, we have begun to document work on an information
architecture, and have migrated from multiple sub domains - each with individually
maintained sets of content using different documentation and static website frameworks to a single consolidated experience.

We generally produce documentation as [markdown](https://www.markdownguide.org/basic-syntax/) and we use the [docusaurus](https://docusaurus.io/) framework for
quickly building an optimized web experience.

This migration is still an ongoing work in progress - if you are a technical
writer or documentation expert - this is an area that we are actively improving
and your help could be extremely beneficial to the Tremor project.
### How to contribute as a technical writer

If you would like to work on an existing documentation task, then:

  - [Work with existing documentation tasks](#work-with-existing-documentation-tasks)
  
If you would like to document a new tutorial

  - [Submit or refresh a tutorial](#submit-or-refresh-a-tutorial)

If you find a documentation task in the primary project repository, then:

  - [Documenting existing code](#work-with-existing-code)

If you are submitting an RFC, and you need to provide documentation, then:

  - [Working with the RFC process](#work-with-the-rfc-process)

### Work with existing documentation tasks

[work-with-existing-documentation-tasks]: #work-with-existing-documentation-tasks

We maintain an active documentation [project kanban](https://github.com/tremor-rs/tremor-www/projects/1) board that has a set of tasks based on a technical writer [assessment](https://github.com/cncf/techdocs/blob/main/assessments/0004-tremor.md) conducted by Celeste Horgan of the CNCF by request of the Tremor project maintainers.

This website redesign was undertaken by [Sharon Koech][Sharon] who leads the documentation team of the Tremor project.

The assessment was factored into a number of [issues](https://github.com/tremor-rs/tremor-www/issues) which are in progress.

A great way to contribute to Tremor is by picking one of these tasks and
contributing with help and support from the team.

### Submit or refresh a guide


[submit-or-refresh-a-tutorial]: #submit-or-refresh-a-tutorial


Guides are basic working example projects that configure tremor with connectivity and sample logic that a user can follow in a step by step fashion to replicate a working tremor
use case.

### Work with existing code

[work-with-existing-code]: #work-with-existing-code

Sometimes we discover the need to extend, enhance or improve documentation
based on user feedback, or based on issues reported in the primary rust-based
tremor codebase.

To find issues that related to documentation tasks, issues in the primary or
other tremor code repositories can be [searched](https://github.com/tremor-rs/tremor-runtime/issues?q=is%3Aopen%20is%3Aissue%20label%3Adocumentation).

Contributions are always welcome and can be made directly in [this](https://github.com/tremor-rs/tremor-www) repository.

### Work with the RFC Process

[work-with-the-rfc-process]: #work-with-the-rfc-process


All significant changes, modifications, enhancements and new features to the
project, regardless of the originator or contributor must follow the documented
[RFC process](https://www.tremor.rs/rfc/index).

As such, all significant new features should be accompanies with new
reference documentation, guides, tutorials, quick starts and other content
in addition to the code-level comments and the submitted RFC itself.

This type of content follows a slightly different process as it typically involves
a great commitment of time and effort by the primary originator and by the tremor maintainers and community.

For significant contributions we recommend reaching to and chatting with the community via our community [chat](#tremor-chat) to get started.

## Tremor Chat

[tremor-chat]: #tremor-chat

Join the tremor community [discord](https://bit.ly/tremor-discord)

We also maintain a presence on [CNCF Slack](https://slack.cncf.io/) in the `#tremor` channel which we use for announcements and collaborating with the wider CNCF community.
