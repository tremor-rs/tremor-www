+++

title = "Tremor Applications"
date = "2020-02-05T13:11:00+01:00"
draft = false
weight = 200
description = "Scripting"
bref= "Tremor's application logic is scriptable"
toc= true

+++

### Concept

Tremor supports data processing through a directed acyclic graph based pipeline or
workflow. Pipelines can be configured via a YAML syntax or via a structured query
language.

Pipelines are a graph of operations through which events are routed depth first.
Operations in tremor pipelines are pluggable and extensible.

For applications or algorithms that process one event at a time, such as data cleansing,
enrichment, normalization, validation and transformation an ETL focused scripting language
can be used to program the application logic.

Qualities of service such as batching, bucketing and flushing semantics can be configured
into pipelines and data shared between oeprators through metadata exposed to the scripting
language.

The tremor query language replaces the YAML pipeline format with a more intuitive and easier
to program SQL-like language. The query language adds support for processing windows of events
over time to support near real-time grouping and aggregation.

For applications or algorithms that process events over time, such as those calculating summary
statistics, aggregating or projecting alternate views or other complex data processing and
routing logic the tremor query language is a better fit.

The query language embeds the scripting language allowing data-flow or query-oriented logic
to co-exist with ETL oriented logic.

Both the query and scripting language are evolving as tremor is applied to broader production
use cases.

### Tremor Script

The scripting language supports JSON-like values. A valid JSON value is a valid tremor-script value.

Tremor-script adds an expression language that supports unary, binary, comparison and predicate
operations with higher level expressions supporting `match` expressions, `for` comprehensions and
`patch` and `merge` expressions.

Features relatively unique to tremor-script are structural pattern matching and the recognition
of and ability to extract data from microformats typically embedded in event data.

[Structural pattern matching](https://docs.tremor.rs/tremor-script/#match) allows patterns over
arbitrarily nested values to be concisely declared with an intuitive syntax.

[Micro-format Extractors](https://docs.tremor.rs/tremor-script/#extractors) allows embedded data
conforming to orthogonal formats such as regular expressions in Strings, date/time variants to
be conditionally transformed to tremor internal form and for embedded data to be extracted upon
matching.

```tremor
define script extract                                # define the script that parses our apache logs
script
  match {"raw": event} of                            # we user the dissect extractor to parse the apache log
    case r = %{ raw ~= dissect|%{ip} %{} %{} [%{timestamp}] "%{method} %{path} %{proto}" %{code:int} %{cost:int}\\n| }
            => r.raw                                 # this first case is hit if the log includes an execution time (cost) for the request
    case r = %{ raw ~= dissect|%{ip} %{} %{} [%{timestamp}] "%{method} %{path} %{proto}" %{code:int} %{}\\n| }
            => r.raw                                 # the second case is hit if the log does not includes an execution time (cost) for the request
    default => emit => "bad"
  end
end;
```

The full documentation  [of the language](https://docs.tremor.rs/tremor-script) and its [standard library](https://docs.tremor.rs/tremor-script/functions) can be found in the [docs](https://docs.tremor.rs).

### Tremor Query

Tremor query builds around [Tremor Script](#h-script) and extends tremors capability to not only define scripts but turn pipeline configuration into development rather then YAML wrestling. In addition to describing pipelines Tremor Query adds the ability to group and aggregate events.

<nav class="tabs" data-component="tabs">
  <ul>
    <li class="active">
      <a href="#before">Before (YAML)</a>
    </li>
    <li>
      <a href="#after">After (Tremor Script)</a>
    </li>
    <li>
      <a href="#logstash">Logstash</a>
    </li>
  </ul>
</nav>

<div id="before">

The YAML based secription is unwieldy and easy to get wrong.

```yaml
pipeline:
  - id: main
    interface:
      inputs:
        - in
      outputs:
        - out
    nodes:
      - id: runtime
        op: runtime::tremor
        config:
          script: |
            match {"message": event} of
              case r = %{ message ~= grok|%{IPORHOST:clientip}·%{USER:ident}·%{USER:auth}·[%{HTTPDATE:timestamp}]·"%{WORD:verb}·%{DATA:request}·HTTP/%{NUMBER:httpversion}"·%{NUMBER:response:int}·(?:-\|%{NUMBER:bytes:int})·%{QS:referrer}·%{QS:agent}| } => r.message
              default => drop
            end
    links:
      in: [runtime]
      runtime: [out]
```

</div>

<div id="after">

In trickle script the configuration becomes a query description based on a `select` statement to transofrm the data and a `having` clause to filter events we do not wish to keep.

```trickle
select
  match {"message": event} of
    case r = %{ message ~= grok|%{IPORHOST:clientip}·%{USER:ident}·%{USER:auth}·[%{HTTPDATE:timestamp}]·"%{WORD:verb}·%{DATA:request}·HTTP/%{NUMBER:httpversion}"·%{NUMBER:response:int}·(?:-\|%{NUMBER:bytes:int})·%{QS:referrer}·%{QS:agent}| } => r.message
    default => null
from in into out
having event != null
```

</div>

<div id="logstash">

```logstash
filter {
  grok {
    match => {
      "message" => '%{IPORHOST:clientip} %{USER:ident} %{USER:auth} \[%{HTTPDATE:timestamp}\] "%{WORD:verb} %{DATA:request} HTTP/%{NUMBER:httpversion}" %{NUMBER:response:int} (?:-|%{NUMBER:bytes:int}) %{QS:referrer} %{QS:agent}'
    }
  }
}
```

</div>

The full documentation  [of the language](https://docs.tremor.rs/tremor-query), the [special operators](https://docs.tremor.rs/artefacts/operators), and [aggregation functions](https://docs.tremor.rs/tremor-query/functions) can be found in the [docs](https://docs.tremor.rs) .
