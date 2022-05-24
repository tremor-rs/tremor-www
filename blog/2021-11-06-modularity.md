---
title: Case Study - Modularity, Oh My
tags:  [case-study, wayfair]
author: The Tremor Team
author_url: https://github.com/tremor-rs
author_image_url: https://avatars.githubusercontent.com/u/60009416?s=200&v=4
image: ./media/wayfair.png
draft: false
hide_table_of_contents: false
---

# Modularity, Oh My

## Identified Need

The adoption growth of tremor inside Wayfair is such that we have
production customers with 3.5 years of experience operating tremor in
production with very large, complex tremor-based services - and fresh
demands from new domains such as Search - whose requirements for
multi-participant transaction orchestration are driving enhancements to
qualify of service, guaranteed delivery and circuit breaker capabilities
within tremor’s core processing engine.

Some usage patterns are becoming common enough that sharing tremor
application logic across teams, across organizations, and across domains
is now common. For example - tremor has good support for HTTP based
interactions and already interfaces with a number of HTTP-based and REST
APIs, and it can expose HTTP-based interfaces to participants and act as
a REST-based or HTTP-based service. Many of these services share the
same needs around handling HTTP errors and routing errors and alerts.

At the event flow or query level - similar levels of sophistication are
emerging in the installed user base.

## Required Outcome

Expand tremor’s domain specific languages to support modularity,
starting with the scripting language but extending into the query
language to maximise reuse of user-defined processing logic.

### Characteristics

Provide standard mechanism and syntax to discover, reference and consume
functional units of logic that can be shared by all tremor domain
specific languages.

A new lexical preprocessing phase has been introduced allowing source to
be packaged within a modular set of paths through a `TREMOR_PATH` environment
variable. Since V0.8 of tremor the scripting and query languages both
support modules, and share the same module syntax and semantics.

The tremor API was upgraded to supported preprocessed or non-modular
source so that no API changes were required to extend the deployment
mechanisms to support modularity.

### Modular scripting

In a nutshell - this added support for user defined constants and user
defined functions.

```tremor title="my_mod.tremor"
# Tail recursive implementation of fibonacci
#
fn fib_(a, b, n) of
  case (a, b, n) when n > 0 => recur(b, a + b, n - 1)
  default => a
end;

fn fib(n) with
  fib_(0, 1, n)
end;
```

The module can be loaded via the module path and used in other script or query sources:  

```trickle title="fib.trickle"
# A streaming fibonacci service*

define script fibber
script
  use my_mod;
    my_mod::fib(event)
end;

create script fib from fibber;

select event from in into fib;

select event from fib into out;
```

Modules can be file-based, or defined inline in the scripting or query
language. A standard set of system modules is provided by tremor out of the box.

[Tremor Modules](https://www.tremor.rs/docs/tremor-script/modules)  
  
### Modularity in the query language

In the query language windows, scripts and pluggable operators may be
defined and shared across queries.

There is an RFC for modular sub-query to allow query sub-graphs to be
defined and shared which is being delivered as part of a tremor LFX
mentorship.
  
### Modularity in the deployment language
  
Modular deployments through replacing the YAML configuration syntax with
a deployment language will embed the modular query language, which in turn
embeds the modular scripting language.  
  
This work is under development and will span multiple releases - but it
is being designed in such a way that as clustering capabilities are added to tremor, that
clustered or  distributed deployments will be modularly composable by end users using
the same  tooling as the other DSLs within tremor.

## Solution

The support for modularity is thematic. The scripting language now
supports a functional programming paradigm and file-based or nested
inline modules. The query language can embed modular scripts using the
same module mechanism and definitions in the query language are also
modular.

Modular sub-query and the introduction of the deployment language are
planned and in progress and will extend modularity to the administration
of running tremor nodes.

And, in the fullness of time, clustering will further extend modularity
in tremor to maximize operator and tremor developer productivity through
efficient reuse and sharing of common tasks.

The first set of connectivity to benefit from modularity is the support
for CNCF OpenTelemetry. This is the first set of tremor connectors to be
delivered that ships with its own set of modules designed to make
designing OpenTelemetry based services in tremor easier.

## Conclusion

As tremor grows into new domains, and the algorithm and solution
complexity of traditional production domains for tremor increase in
sophistication, size, complexity, the subject of modularity has evolved
and new demands continue to emerge.  
  
We expect the `modularity` theme to be long-lived, but its origins
derive from production needs. When tremor was developed the user defined
logic was small, relatively simple and applications built with tremor
were fairly monolithic.  
  
Today, multi-pipeline and medium to large tremor-based applications are
common. And adoption of the modular scripting and query language
primitives is now driving larger and more sophisticated use cases.

Another dimension of modularity is the ongoing expansion of connectivity
in tremor. Modularity here reflects a different production-driven need (
and a few maintainer conveniences ). A plugin development kit is being
developed that will allow connectors and other plugins to be developed
in separately managed and maintained projects. This in turn allows the
core of tremor to be managed independently of connectivity.
