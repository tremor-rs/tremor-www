---
id: Versioning
title: Versioning and Sundown Policy
sidebar_position: 3
---

## Versioning

All components of the tremor project, and all repositories follow the
[Semantic Versioning](https://semver.org/) model.

As tremor is an early stage and continuously evolving software project
we currently have a `MAJOR` version number of `0` ( zero ).

## Binary Compatibility

However, we aim to make each `MINOR` release binary compatible with
previous `MINOR` releases and we publish breaking changes in our
documentation and in the project change log.

As tremor is used continuously in production for a growing set of use
cases - it is important to the project and to our users that binary
compatibility is maintained despite the simultaneous need to evolve
the project to meet emerging needs.

## Deprecation Process

From time to time, we mark features of the project ( such as our use of YAML
for configuration ) as deprecated with the eventual aim of replacing deprecated
components with replacements that better meet the needs of the tremor community.

A significant change to the project, may deprecate existing functionality. When it
does:
* The new facilities go through an open design and review based on our [RFC Process](https://www.tremor.rs/rfc/index)
* The deprecated facilities are marked as such and we publicize our intent to deprecate in community channels
* The new facilities are implemented side-by-side with the deprecated facilities where possible

Under rare circumstances it is not possible to be binary compatible. A good example is the connectors
RFC which replaces the legacy onramp and offramp components based on 3.5 years of production experience
with a more flexible connectivity model.

The new facilities add support for pausing and resuming connectors in a way that integrates the quality of
service operations supported by our pipeline execution model - namely the primitives that support acknowledgements, guaranteed delivery, event transactions and circuit breakers.

The new facilities also add support for quiescence detection - a property required so that we can build fully
automated acceptance test frameworks that the tremor community can use to write more expressive acceptance
tests of their tremor-based systems and applications.

These features are not available with the legacy connectors. Further, the YAML configuration model which was
first deprecated with the introduction of the tremor query language is now scheduled for removal with the
final YAML based configuration for tremor deployments being displaced by the new deployment language.

It does not make practical sense to support both the new and legacy behaviors in the same running system.
Supporting both given multiple versions of tremor in production environments will be confusing for the
tremor team and community alike.

In this ( and similar ) situations a binary incompatible break is reasoned to be reasonable.

However, in general, deprecation and eventual removal is preferred. It is also the typical case.

## Sundown Policy

The tremor team and community has limited time and resources. Our sundown policy reflects this and is structured as follows:

* The latest `MINOR` release is fully supported at the latest `PATCH` level

As a general practice - new functionality is scheduled for the **next** `MINOR` release


## `MINOR` vs `PATCH` releases

The tremor maintainers are typically engaged with new features and functions captured by our RFC Process.
As these are significant changes to tremor and we are a `pre-1.0` project - these will result in the `MINOR`
version number incrementing upon release.

We generally support:
* The latest `MINOR` release is fully supported at the latest `PATCH` level
* Bug fixes, security patches and minor enhancements and improvements are released as patch releases.
* The addition of new connectors, new codecs, new processors and new scripting functions are released as patch releases.
* Delivery of a project captured by the RFC process results in a `MINOR` release
* Breaking changes or changes in binary compatibility results in a `MINOR` release

## `MAJOR` releases

The tremor team has yet to release `v1.0` or its first major release. As a young and continuously
evolving project with a growing roadmap and adoption we do not expect innovation, research and
development to slow in pace for a considerable time.

When the core of tremor stabilizes our first `MAJOR` release will be produced. This
release will also result in the creation of new processes to cover long term support.

The timing, content and nature of a `MAJOR` release is governed by the tremor community,
production adopters of the tremor project, and the tremor maintenance team and will be
a transparent, open and inclusive process by and for the community.


