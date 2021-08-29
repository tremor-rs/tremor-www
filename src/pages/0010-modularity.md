- Feature Name: rfc-0010-modularity
- Start Date: 2020-04-02
- Tremor Issue: [tremor-rs/tremor-runtime#0174](https://github.com/tremor-rs/tremor-runtime/pull/174)
- RFC PR: [tremor-rs/tremor-rfcs#0021](https://github.com/tremor-rs/tremor-rfcs/pull/0021)

# Summary

[summary]: #summary

Provide mechanisms for sharing, reuse and composition of user-defined
logic in tremor.

# Motivation

[motivation]: #motivation

As user-defined logic deployed with tremor script and query pipelines
become more complex and larger ( by significant lines of code )
mechanisms that favour better composition, reuse and sharing of user
defined logic and queries are needed.

Currently the unit of modularity and unit of deployment in tremor are
indivisible blobs of code - be they scripts or queries. This has worked
very well to date but as the complexity and size of solutions built with
tremor grows this is no longer tenable in the long term.

Identified requirements

- As tremor has multiple DSLs, the building blocks for reusing units
  of code from the file system should be common across
  DSLs.

- For tremor-script, code should be modularisable through the
  introduction of functions.

- For tremor-query, code should be modularisable through modular
  definitions and/or reusable sub-queries

- Modules should be nestable on the file system, and within DSLs with
  a consistent means to reference units of code or values defined
  within nested modules regardless of their origin ( within the same
  unit of code, from some external module ).

- There should be a mechanism to load external libraries or packages
  of code from well-known locations.

- The module mechanism should be usable by multiple DSLs with minimal
  effort and with the same basic behaviour, structure. However, this
  RFC does not place constraints on any DSL specifics per se.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

Elements of modular user defined logic in the tremor project.

## Module Path

[module_path]: #module_path

A module path is a set of URLs ( normatively directories on a file
system ) that form the root of a set of related modules.

On Linux/Unix module paths are provided via the TREMOR_PATH environment
variable and they are separated by ':' ( colon ). Paths that are not
readable or that do not exist are ignored.

Example path:

```bash
TREMOR_PATH="/etc/tremor/lib:/opt/shared/framework/lib:/opt/myproject/mylib"
```

## Modules

[modules]: #modules

Modules in tremor are the lowest unit of compilation available to
developers to modularise tremor logic across multiple logical
namespaces. On the filesystem, modules are rooted at a base path and are
nested with folders. Within a file nesting is via the mod
clause.

In tremor-script, only the top-level module can capture events or or
mutate state. Modules loaded via the module system are restricted to
const, fn, and intrinsic expressions. By design constraint at this time,
tremor-script is biased towards pure side-effect free functional
programming.

In tremor-query, only the top-level module can create nodes in the
active query pipeline graph. A module logically encapsulates a reusable
sub-graph in a query pipeline. The definitions of windows, operators or
scripts can be reused. Within embedded scripts, modules used in scripts
are constrained to the rules for modules for tremor-script. In addition
tremor-script modules can be included in trickle files to expose their
functions and constants for use in `select`, `group by`, `having` and
`where`.

In both the tremor-script and tremor-query DSLs, modules can be defined
physically on the file system. For example given the following modular
hierarchy configured on the module path:

```text

  +-- foo
    +-- bar
      +-- snot.tremor
    +-- baz
      +-- badger.tremor

```

A modular tremor-script can refer to the constant values as follows:

```tremor
use foo::bar::snot; # snot is a ref to 'foo/bar/snot.tremor'
use foo::baz::badger; # badger is a ref to 'foo/bar/badger.tremor'

let c = "{snot::snot}{badger::badger}"; # fully qualified references

c
```

The same module hierarchy can be created in a tremor file directly as
follows:

```tremor
mod foo with
  mod bar with
    const snot = "beep";
  end;
  mod baz with
    const badger = "boop";
  end;
end;

let snot = foo::bar::snot;
let badger = foo::baz::badger;

"{snot}-{badger}";
```

Modules can be loaded via the `use` clause which in turn loads a module
from the physical file system via the module path.

Inline and externalized modules can be used separately or together as
appropriate.

Where there are existing references a module can be aliased to avoid
clashes in the local scope:

```tremor
use foo::bar as fleek;

"Hello {fleek::snot}"
```

Modules in tremor query follow the same semantics and behaviour with
respect to physical versus inline definition, aliasing to avoid naming
scope clashes.

It is to be noted that inclusion via `use` will prevent circular inclusion as in
file `a.tremor` can use `b.tremor` but at that point `b.tremor` can no longer
use `a.tremor` as this would create a circle. This is a restriction of the
current implementation and may or may not be relaxed in the future.

## Preprocessor

[preprocessor]: #preprocessor

In order to support the module mechanism with minimal changes to the
API and runtime, a preprocessor loads all externally referenced modules
used in tremor logic defined in tremor-script or tremor-query and loads
them inline into a preprocessed file.

It is an error to attempt to deploy a tremor-script or tremor-query
file that uses the module mechanism as source. The API only accepts
non-modular files for backward compatibility or preprocessed files. The
latter constraint is to ensure that logic deployed into the runtime is
always traceable to source loaded by a user. Tremor explicitly avoids
possibilities of modular logic changing at runtime.

The preprocessor defends this guarantee on behalf of our users.

This PR introduces two preprocessor directives:

1.  `#!line <byte offset> <line> <column> <compilation unit> <filename>`

    > This directive tells the preprocessor that it is
    > now in a logically different position of the file.
    >
    > For each folder/directory that an included source traverses a
    > module statement is injected into the consolidated source.
    >
    > The #!line macro is a implementation detail mentioned here for the same
    > of completeness and not meant to be used or relied on by end users. It
    > may, without prior warning, be removed in the future.

2.  `#!config <key> = <const-expr>`

    > Pipeline level configuration in trickle, this allows setting
    > compile time pipeline configuration such as `metrics_interval_s`.

Preprocessing our script from the module section produces a single
consolidated source file as follows:

```tremor
#!line 0 0 0 1 ./foo/bar/snot.tremor
mod snot with
#!line 0 0 0 1 ./foo/bar/snot.tremor
const snot = "beep";
end;
#!line 19 1 0 0 script.tremor
#!line 0 0 0 2 ./foo/baz/badger.tremor
mod badger with
#!line 0 0 0 2 ./foo/baz/badger.tremor
const badger = "boop";
end;
#!line 41 1 0 0 script.tremor

let c = "{snot::snot}{badger::badger}";

emit c

```

## Functions

[functions]: #functions

While constants in modules offer the ability to have reusable data,
functions allow for reusable logic.

Functions are expression-based - so every function returns a data
value. Functions cannot manipulate or mutate events, metadata or state.
Side effecting operations to the data flow through a script such as the
`emit` or `drop` keywords are also not allowed in functions.

Recursion, specifically tail recursion, is supported in functions but a
maximum recursion depth (of currently 1024 by default) is imposed. The limit
can be changed in tremor-server using the `--recursion-limit LIMIT` argument.
As tremor is primarily an event processing engine there are no facilities for
user defined logic to loop or recurse infinitely. Recursion is indicated by
the `recur` expression that gets passed data from the current
iteration as arguments for the following invocation. Functions may
access constants but cannot access external mutable state.

Functions are limited to only call functions that were defined prior to
themselves, this limits the risk of cyclic recursion between multiple functions
and ensure that every call is guaranteed to terminate.

### Functions come in multiple forms:

#### Intrinsic functions

Intrinsic functions provide the signature of a builtin function.
These are provided for documentation purposes and so that API
documentation can be provided for builtin functions in the same way as
user defined functions.

```tremor
### The `test` module is used for writing tremor unit
### tests.

## Runs an assertion for a test, ensures that `expected` and
## `got` are the

## same. If not errors.
##
## **WARNING**: Do not run assertions in production code!
##
## Returns an `bool`.

intrinsic fn assert(name, expected, got) as test::assert;

```

#### Ordinary functions

Of the form `fn <name>([<args>][,...]) with` provide named arguments with
optional variable arguments through the ellipses `...` or varargs operator.
Varargs are stored in the `args` array.

The ordinary form does not support partial functions.

An ordinary function wrapping a call to a tail recursive fibonacci
function:

```tremor
fn fib(n) with
  fib_(0, 1, n)
end;

fib(7); # Call locally defined function fib

```

#### Matching Functions

Matching functions using `fn <name>(<args>) of` followed by case expressions
and an optional default statement that match.

The matching function form imposes a default case requirement so that
unmatches cases have error handling defined. Unlike match expressions
the default case in user defined functions must not ( and can not ) be
omitted.

A contrived example showing math functions with value matching, extractor
matching and function case guards.

```tremor
use std::type;

fn snottify(s) of
  case ("badger") => "snot badger, hell yea!"
  case (\~ json||) => let s.snot = true, s
  case (s) when type::is_string(s) => "snot {s}"
  default => "snot caller, you can't snottify that!"
end;
```

#### Recursive Functions

Tail recursive functions follow the signature of the function over
which recursion is being invoked and use a `recur(<args>)` call expression.

If the signature of a recursive call supports partial function
semantics then this is respected under tail recursion.

If the signature of a recursive call supports varargs semantics then
this is respected under tail recursion.

A tail-recursive implementation of fibonacci called by fib(n) above:

```tremor
fn fib_(a, b, n) of
  case (a, b, n) when n > 0 => recur(b, a + b, n - 1)
  default => a
end;
```

### Limitations and constraints:

#### Functions can only be defined with a singular arity

Functions currently can not be redefined with multiple arities. So a
function `foo(n)` precludes a second definition of a function called
`foo` with two or more arguments. However the function `foo(n,...)`
defines a function that can take one or more arguments. This constraint
may be lifted in the future once usage and adoption favor enhancing
functionality.

#### Higher Order functions are not supported

As the type system underpinning tremor-script and tremor-query does not
support expression or function references, higher order functions are
thus not supported at this time.

#### Hardcoded Recursion Depth

Although functions are tail-recursive and stack limits are not a
functional concern, the tremor event processing system is primarily
designed for event streaming applications. A recursion depth is imposed
to prevent functions from recursing indefinitely and blocking event
streams from progressing.

This is a feature, not a constraint. But it is important to be aware of
when developing will behaved functions.

At this point in time the maximum depth is 1024 and can not be changed
without recompiling tremor.

## Tuple patterns

As a side effect of adding functions this RFC introduces tuple patterns.
Internally they are used to implement Matching functions but are available for
use in match statements as well.

Tuple patterns are written in the form of `%(<pattern 1>, <pattern 2>)` for
patterns with a fixed number of elements or `%(<pattern 1>, <pattern 2>, ...)`
with literal `...` for open patterns.

Tuple patterns with a fixed number of elements match arrays, with the same
number of elements where each element matches the pattern in the same place. So
the first pattern must match the first element of the array, the second pattern
the second element and so on.

An open pattern matches an array that is at lest the same number of elements as
the pattern but can have more otherwise the rules are the same.

There is also a new pattern introduced to predicate patterns which is the "I
don't care" pattern `_` which will match every element on an array.

So:

```tremor
let o = origin::as_uri_record();
match o of
  # matches for the path:
  # "/api/v1/get/<something>"
  # "/api/v1/get/<something>/snot"
  # "/api/v1/get/<something>/snot/badger"
  # and so one
  case %("api", "v1", "get", _, ...) => "get request"
end;
```

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

The module path, modules and `use` rule provide the language and
runtime agnostic core facilities that allow queries in tremor-query and
code in tremor-script to be namespaced logically via the `mod` syntax
and physically on file systems.

A new lexical preprocessing phase parses out occurrences of `use`
rules in scripts, queries and embedded scripts replacing them with
preprocessing directives and the contents of referenced
modules.

The parser in modular scripts and queries must now keep track of
relative and absolute module scope. As support for both logical
namespaces via the `mod` syntax and physical isolation through the
file system and module path is supported, an external module effectively
defines a module namespace. So a source file `foo.trickle` at the root
of the module path would ordinarily be used to include definitions into
another query with a `use foo;` declaration at the head of the file.

Nested directories also form namespaces so `bar/baz/snot.trickle`
would be declared for use as `use bar::baz::snot`. The same layout and
rules apply for scripts so `bar/baz/snot.trickle` would be declared
for use as `use bar::baz::snot`.

Where modules of the same base name in the physical file system such as
'badger.tremor' and 'badger.trickle' are present in the same module path
behaviour of the runtime is currently undefined. The prototype
implementation of modules in tremor that accompanies this RFC gracefully
handle the situation for embedded tremor scripts within trickle query
files.

As a convenience to developers, developer tools such as `tremor-tool`,
`tremor-script` and `tremor-query` automatically included the
current working directory as a mount point in the module path. If a
`TREMOR_PATH` environment variable is set then it overrides any
default behaviour.

In tremor-server `TREMOR_PATH` is required to be set or no include
path will be available. This is reflected in the docker
image.

# Drawbacks

[drawbacks]: #drawbacks

Modularising logic in tremor increases complexity of the engine and
runtime, however the relative increase in complexity is perceived as
negligible given the value gained by developers by introducing the
facility.

At this time higher order functions are not supported as the tremor type
system is constrained to JSON compatible value types and introducing
module or function references would make the type system asymmetric with
JSON. This is left for a future RFC.

At this time the query language supports only modularising definitions
of windows, operators or scripts. The creation of query language
pipeline graph nodes or link of nodes in a graph is not supported in
external modules.

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

The design of the module mechanism and its application to tremor-script
and tremor-query provide the highest degree of reuse whilst imposing the
lowest runtime impact today and without closing off opportunities for
evolving and improving the mechanisms in future.

# Prior art

[prior-art]: #prior-art

This RFC and it's implementation draws inspiration from the C
preprocessor as well as the application of `use` in Rust, and the
functional pattern matching style from the Erlang programming
language.

# Unresolved questions

[unresolved-questions]: #unresolved-questions

None.

#Future possibilities
[future-possibilities]: #future-possibilities

Currently var arg functions do not combine with either match or
recursion or matching functions. This presents a good future opportunity
for extending functions.

Another future possibility is to expand the capabilities of use in
trickle to include full sub queries.
