# ModuleFile Grammar

## Rule ModuleFile

The `ModuleFile` rule defines a module in tremor.

A module is a unit of compilation.



![ModuleFile](svg/modulefile.svg)

```ebnf
rule ModuleFile ::=
    ModuleBody 
  ;

```




Represents the compiled form of a tremor source file.

Currently this can be `troy` deployment files, `trickle` query files, or tremor `script` files.

This is part of of tremor's compiler and runtime and not user modifiable.



## Rule ModuleBody

The `ModuleBody` rule defines the structure of a valid module in tremor.

Modules begin with optional module comments.

Modules MUST define at least one statement, but may define many.

Statements are `;` semi-colon delimited.



![ModuleBody](svg/modulebody.svg)

```ebnf
rule ModuleBody ::=
    ( ModComment ) ?  ModuleStmts 
  ;

```




The body of a compiled tremor source file has a module level comment ( lines beginning with 3 hashes )
and the statements that form the logic of that module.

This is part of of tremor's compiler and runtime and not user modifiable.



## Rule ModComment

The `ModComment` rule specifies module comments in tremor.

Documentation comments for modules are optional.

A module documentation comment begins with a `###` triple-hash and they are line delimited.

Muliple successive comments are coalesced together to form a complete comment.

The content of a module documentation comment is markdown syntax.



![ModComment](svg/modcomment.svg)

```ebnf
rule ModComment ::=
     '<mod-comment>' 
  | ModComment  '<mod-comment>' 
  ;

```



### Example

Module level comments are used throughout the tremor standard library
and used as part of our document generation process.

Here is a modified snippet from the standard library to illustrate

```tremor
### The tremor language standard library it provides the following modules:
###
### * [array](std/array.md) - functions to deal with arrays (`[]`)
### * [base64](std/base64.md) - functions for base64 en and decoding
### * [binary](std/base64.md) - functions to deal with binary data (`<< 1, 2, 3 >>`)
### * [float](std/float.md) - functions to deal with floating point numbers
### * [integer](std/integer.md) - functions to deal with integer numbers
### * [json](std/json.md) - functions to deal with JSON
...
```



## Rule ModuleStmts

The `ModuleStmts` rule defines a set of module statements.

Module statements are a `;` semi-colon delimited set of `ModuleStmt` rules



![ModuleStmts](svg/modulestmts.svg)

```ebnf
rule ModuleStmts ::=
    ModuleStmt  ';' ModuleStmts 
  | ModuleStmt  ';' ?  
  ;

```




The set of computed statements in a compiled script.

This is part of of tremor's compiler and runtime and not user modifiable.



## Rule DocComment

The `DocComment` rule specifies documentation comments in tremor.

Documentation comments are optional.

A documentation comment begins with a `##` double-hash and they are line delimited.

Muliple successive comments are coalesced together to form a complete comment.

The content of a documentation comment is markdown syntax.



![DocComment](svg/doccomment.svg)

```ebnf
rule DocComment ::=
     '<doc-comment>' 
  | DocComment  '<doc-comment>' 
  ;

```



### Example

Documentation level comments are used throughout the tremor standard library
and used as part of our document generation process.

Here is a modified snippet from the standard library to illustrate

```tremor
## Returns the instance of tremor.
##
## Returns a `string`
intrinsic fn instance() as system::instance;
...
```

This is a builtin function implemented in rust and used in a script as follows:

```tremor
use tremor::system;

system::instance()
```



## Rule ModuleStmt

The `ModuleStmt` rule defines the statement types that are valid in a tremor module.




![ModuleStmt](svg/modulestmt.svg)

```ebnf
rule ModuleStmt ::=
    Use 
  | Const 
  | FnDefn 
  | Intrinsic 
  | DefineWindow 
  | DefineOperator 
  | DefineScript 
  | DefinePipeline 
  | DefineConnector 
  | DefineFlow 
  ;

```




The set of statements that are legal in any tremor supported domain specific language.

This is part of of tremor's compiler and runtime and not user modifiable.



## Rule Use

Imports definitions from an external source for use in the current source file.

The contents of a source file form a module.

### TREMOR_PATH

The `TREMOR_PATH` environment path variable is a `:` delimited set of paths.

Each path is an absolute or relative path to a directory.

When using relative paths - these are relative to the working directory where the
`tremor` executable is executed from.

The tremor standard library MUST be added to the path to be accessible to scripts.



![Use](svg/use.svg)

```ebnf
rule Use ::=
     'use' ModularTarget 
  |  'use' ModularTarget  'as' Ident 
  ;

```



### Modules

Modules can be scripts. Scripts can store function and constant definitions.

Scripts are stored in `.tremor` files.

Modules can be queries. Queries can store window, pipeline, script and operator definitions.

Scripts are stored in `.trickle` files.

Modules can be deployments. Deployments can store connector, pipeline and flow definitions.

Deployments are stored in `.troy` files.

#### Conditioning

Modules in tremor are resolved via the `TREMOR_PATH` environment variable. The variable can
refer to multiple directory paths, each separated by a `:` colon. The relative directory
structure and base file name of the source file form the relative module path.

### Constraints

It is not recommended to have overlapping or shared directories across the set of paths
provided in the tremor path.

It is not recommended to have multiple definitions mapping to the same identifier.



## Rule Const

The `Const` rule defines a rule that binds an immutable expression to an identifier.

As the value cannot be changed at runtime.



![Const](svg/const.svg)

```ebnf
rule Const ::=
    ( DocComment ) ?   'const' Ident  '=' ComplexExprImut 
  ;

```



### How do I create new immutable constant variable in tremor?

```tremor
use std::base64;
const snot = "snot";
const badger = "badger";
const snot_badger = { "#{snot}": "#{base64::encode(badger)}" };
```



## Rule FnDefn

The `FnDefn` rule allows user defined functions to be defined.

This rule allows tremor users to create functions for reuse in one or many tremor applications.



![FnDefn](svg/fndefn.svg)

```ebnf
rule FnDefn ::=
    ( DocComment ) ?   'fn' Ident  '('  '.'  '.'  '.'  ')'  'with' InnerExprs  'end' 
  | ( DocComment ) ?   'fn' Ident  '(' FnArgs  ','  '.'  '.'  '.'  ')'  'with' InnerExprs  'end' 
  | ( DocComment ) ?   'fn' Ident  '('  ')'  'with' InnerExprs  'end' 
  | ( DocComment ) ?   'fn' Ident  '(' FnArgs  ')'  'with' InnerExprs  'end' 
  | ( DocComment ) ?   'fn' Ident  '('  ')'  'of' FnCases  'end' 
  | ( DocComment ) ?   'fn' Ident  '(' FnArgs  ')'  'of' FnCases  'end' 
  ;

```



### Pattern match based function arguments

Functions defined with an `of` keyword in their signature use pattern matching against arguments

```tremor
fn fib_(a, b, n) of
  case (a, b, n) when n > 0 => recur(b, a + b, n - 1)
  default => a
end;
```

### Ordinary functions

Functions defined with a `with` keyword in their signature use ordinary
arity based matching.

```
fn fib(n) with
  fib_(0, 1, n)
end;
```

## Function documentation

In modular functions, it is customary to provide user level documentation for the intended
users of a function. Here is an example from the tremor standard library

```tremor
### Trace Identifiers
###
###

use std::type;
use std::binary;
use std::array;
use std::string;

## Is the `trace_id` valid
##
## Checks the `trace_id` argument to see if it is a valid
## trace id. A legal trace id is one of:
##
## * An array of integers in the range of [0..=255] of length 8
## * A binary 16 byte value
## * A 32-byte hex-encoded string
## * An array of 16 int values
## * Regardless of representation, the value must not be all zeroes
##
## Returns a record when the representation is well-formed of the form:
##
## ```tremor
## {
##    "kind": "string"|"binary"|"array", # Depends on input
##    "valid": true|false,               # True if well-formed and valid
##    "value": "<trace_id>"              # Representation depends on `kind`
## }
## ```
##
## Returns an empty record `{}` when the representation not well-formed
##
fn is_valid(trace_id) of
    # String representation
    case(trace_id) when type::is_string(trace_id) =>
      { "kind": "string", "valid": trace_id != "00000000000000000000000000000000" and string::bytes(trace_id) == 32, "value": trace_id }
    # Binary representation
    case(trace_id) when type::is_binary(trace_id) =>
      let arr = binary::into_bytes(trace_id);
      { "kind": "binary", "valid": binary::len(arr) == 16 and trace_id != << 0:64, 0:64 >>, "value": trace_id }
    # Array representation
    case(trace_id) when type::is_array(trace_id) =>
      { "kind": "array", "valid":  array::len(arr) == 16 and trace_id != [ 0, 0, 0, 0, 0, 0, 0, 0], "value": trace_id }
    default =>
      false
end
```



## Rule Intrinsic

The `intrinsic` rule defines intrinsic function signatures.

This rule allows tremor maintainers to document the builtin functions implemented as
native rust code. The facility also allows document generation tools to document builtin
intrinsic functions in the same way as user defined functions.

In short, these can be thought of as runtime provided.

For information on how to define user defined functions see the [function](#rule-fndecl) rule.



![Intrinsic](svg/intrinsic.svg)

```ebnf
rule Intrinsic ::=
    ( DocComment ) ?   'intrinsic'  'fn' Ident  '('  ')'  'as' ModularTarget 
  | ( DocComment ) ?   'intrinsic'  'fn' Ident  '(' FnArgs  ')'  'as' ModularTarget 
  | ( DocComment ) ?   'intrinsic'  'fn' Ident  '(' FnArgs  ','  '.'  '.'  '.'  ')'  'as' ModularTarget 
  | ( DocComment ) ?   'intrinsic'  'fn' Ident  '('  '.'  '.'  '.'  ')'  'as' ModularTarget 
  ;

```



### Example

From our standard library generated documentation, we can see that the base64
encode function is an intrinsic function.

```tremor
## Encodes a `binary` as a base64 encoded string
##
## Returns a `string`
intrinsic fn encode(input) as base64::encode;
```



## Rule DefineWindow

The `DefineWindow` rule defines a temporal window specification.

A window is a mechanism that caches, stores or buffers events for processing
over a finite temporal range. The time range can be based on the number of
events, the wall clock or other defined parameters.

The named window can be instanciated via operations that support windows such
as the `select` operation.



![DefineWindow](svg/definewindow.svg)

```ebnf
rule DefineWindow ::=
    ( DocComment ) ?   'define'  'window' Ident  'from' WindowKind CreationWith ( EmbeddedScriptImut ) ?   'end' 
  ;

```





```tremor
define window four from tumbling
with
  size = 4
end;
```



## Rule DefineOperator

The `DefineOperator` rule defines an operator.

An operator is a query operation composed using the builtin 
operators provided by tremor written in the rust programming language.

The named operator can be parameterized and instanciated via the `CreateOperator` rule


![DefineOperator](svg/defineoperator.svg)

```ebnf
rule DefineOperator ::=
    ( DocComment ) ?   'define'  'operator' Ident  'from' OperatorKind ArgsWithEnd 
  ;

```




```tremor
define pipeline subq
pipeline
  define operator counter from generic::counter;
  create operator counter;
  select event from in into counter;
  select event from counter into out;
end;

create pipeline subq;

select event from in into subq;
select event from subq into out;
```

Uses the builtin counter sequencing operator to numerate a stream.



## Rule DefineScript

The `DefineScript` rule defines a named operator based on a tremor script.

A script operator is a query operation composed using the scripting language
DSL rather than the builtin operators provided by tremor written in the
rust programming language.

The named script can be parameterized and instanciated via the `CreateScript` rule
 


![DefineScript](svg/definescript.svg)

```ebnf
rule DefineScript ::=
    ( DocComment ) ?   'define'  'script' Ident DefinitionArgs EmbeddedScript 
  ;

```





```tremor
define operator bucket from grouper::bucket;

define script categorize
script
  let $rate = 1;
  let $dimensions = event.logger_name;
  let $class = "test";
  event
end;

create operator bucket;
create script categorize;

select event from in into categorize;
select event from categorize into bucket;
select event from bucket into out;
```


## Rule DefinePipeline

The `DefinePipeline` rule creates a named pipeline.

A pipeline is a query operation composed using the query langauge DSL
instead of a builtin operation provided by tremor written in the rust
programming language.

The named pipeline can be parameterized and instanciated via the `CreatePipeline` rule



![DefinePipeline](svg/definepipeline.svg)

```ebnf
rule DefinePipeline ::=
    ( DocComment ) ?   'define'  'pipeline' Ident (  'from' Ports ) ?  (  'into' Ports ) ?  DefinitionArgs Pipeline 
  ;

```




```tremor
define pipeline identity
pipeline
  select event from in into out;
end;
```



## Rule DefineConnector

The `DefineConnector` rule defines a connector.

A connector is a runtime artefact that allows tremor to connect to the outside
world, or for the outside connector to connect to tremor to send and/or receive
data.

The named connector can be parameterized and instanciated via the `Create` rule



![DefineConnector](svg/defineconnector.svg)

```ebnf
rule DefineConnector ::=
    ( DocComment ) ?   'define'  'connector' Ident  'from' ConnectorKind ArgsWithEnd 
  ;

```




```tremor
define connector metronome from metronome
  with
    config = {
      "interval": 1
    }
end;
```

Define user defind connector `metronome` from the builtin `metronome` connector
using a 1 second periodicity interval.

```tremor
define connector exit from exit;
```

Define user dfeind connector `exit` from the builtin `exit` connector
with no arguments specified.



## Rule DefineFlow

The `DefineFlow` rule defines a flow.

A flow is a runtime artefact that informs tremor how to interconnect and launch
instances of pipelines and connectors.

A flow can define or use multiple in scope and already define pipelines and
connectors and interconnect their streams together.



![DefineFlow](svg/defineflow.svg)

```ebnf
rule DefineFlow ::=
    ( DocComment ) ?   'define'  'flow' Ident DefinitionArgs  'flow' FlowStmts  'end' 
  ;

```




```tremor
define flow test
flow
  define connector metronome from metronome
  with
    config = {
      "interval": 1
    }
  end;
  define connector exit from exit;
  define pipeline identity
  args
    snot = "badger",
  pipeline
    select args.snot from in into out;
  end;
  create connector metronome;
  create connector exit;
  create pipeline identity;
  connect /connector/metronome to /pipeline/identity;
  connect /pipeline/identity to /connector/exit;
end;

deploy flow test
```

A flow definition is a runnable or executable streaming program that describes
the connectivity, the logic and how they are interconnected. A deploy statement
is responsible for the actual deployment.



## Rule ConfigDirectives

The `ConfigDirectives` rule allows line delimited compiler, interpreter or
runtime hints to be specified.




![ConfigDirectives](svg/configdirectives.svg)

```ebnf
rule ConfigDirectives ::=
    ConfigDirective ConfigDirectives 
  | ConfigDirective 
  ;

```



<!-- Added to avoid `lint` warnings from the lalrpop docgen tool. No epilog content needed for this rule -->

See `ConfigDirective` for supported directives.



## Rule ConfigDirective

A `ConfigDirective` is a directive to the tremor runtime.

Directives MUST begin on a new line with the `#!config` shebang  config token.



![ConfigDirective](svg/configdirective.svg)

```ebnf
rule ConfigDirective ::=
     '#!config' WithExpr 
  ;

```



### Providing a metrics internal via a config directive

```tremor
# Enable metrics with a 10 second interval
#!config metrics_interval_s = 10
```



## Rule WithExpr

The `WithExpr` rule defines a name value binding.



![WithExpr](svg/withexpr.svg)

```ebnf
rule WithExpr ::=
    Ident  '=' ExprImut 
  ;

```



### Form

```
name = <value>
```

Where:

*  `name` is an identifier.
*  `<value>` is any valid immutable expression.

### Example

```tremor
snot = "badger"
```
 


## Rule ModularTarget

A `ModularTarget` indexes into tremor's module path.

In tremor a `module` is a file on the file system.

A `module` is also a unit of compilation.

A `ModularTarget` is a `::` double-colon delimited set of identifiers.

Leading `::` are not supported in a modular target..

Trailing `::` are not supported in a modular target.



![ModularTarget](svg/modulartarget.svg)

```ebnf
rule ModularTarget ::=
    Ident 
  | ModPath  '::' Ident 
  ;

```



### Examples

#### Loading and using a builtin function
```tremor
# Load the base64 utilities
use std::base64;

# Base64 encode the current `event`.
base64::encode(event)
```

#### Loading and using a builtin function with an alias

```tremor
# Load the base64 utilities
use std::base64 as snot;

# Base64 encode the current `event`.
snot::encode(event)
```



## Rule Ident

An `Ident` is an identifier - a user defined name for a tremor value.



![Ident](svg/ident.svg)

```ebnf
rule Ident ::=
     '<ident>' 
  ;

```




### Examples of identifiers

```tremor
let snot = { "snot": "badger" };
```

### Keyword escaping

Surrounding an identifier with a tick '`' allows keywords in tremor's DSLs to be
escaped

```tremor
let `let` = 1234.5;
```

### Emoji

You can even use emoji as identifiers via the escaping mechanism.

```tremor
let `🚀` = "rocket";
```

But we cannot think of any good reason to do so!



## Rule ArgsWithEnd

The `ArgsWithEnd` rule defines an arguments block with an `end` block.



![ArgsWithEnd](svg/argswithend.svg)

```ebnf
rule ArgsWithEnd ::=
    ArgsClause ?  WithEndClause 
  | 
  ;

```




An internal rule that defines an optional `args` block with and optional `end` token.

This rule is used and shared in other rules as part of their definitions.



## Rule ArgsClause

The `ArgsClause` rule marks the beginning of an arguments block.

A valid clause has one or many argument expressions delimited by a ',' comma.



![ArgsClause](svg/argsclause.svg)

```ebnf
rule ArgsClause ::=
     'args' ArgsExprs 
  ;

```




```tremor
args
  x = y
```



## Rule WithEndClause

The `WithEndClause` rule defines a with clause with an `end` terminal token.



![WithEndClause](svg/withendclause.svg)

```ebnf
rule WithEndClause ::=
    WithClause  'end' 
  ;

```




```tremor
with x = y end
```



## Rule DefinitionArgs

The `DefinitionArgs` rule defines an arguments block without an `end` block.



![DefinitionArgs](svg/definitionargs.svg)

```ebnf
rule DefinitionArgs ::=
    ArgsClause ?  
  ;

```




An optional argument block

```tremor
args arg1, arg 2
```

This is a shared internal rule used in other rules as part of their definition.



## Rule ArgsExprs

The `ArgsExpr` rule is a macro rule invocation based on the `Sep` separator macro rule.

An args expression is a comma delimited set of argument expressions.



![ArgsExprs](svg/argsexprs.svg)

```ebnf
rule ArgsExprs ::=
    Sep!(ArgsExprs, ArgsExpr, ",") 
  ;

```



<!-- Added to avoid `lint` warnings from the lalrpop docgen tool. No epilog content needed for this rule -->


## Rule ArgsExpr

The `ArgExpr` rule specifies argument lists.

An argument can be an `Ident` or an assignment of the form `<Ident> = <Expr>`



![ArgsExpr](svg/argsexpr.svg)

```ebnf
rule ArgsExpr ::=
    Ident  '=' ExprImut 
  | Ident 
  ;

```




As used in deployment rules to set or override arguments specifications. Arguments specifications
define interface parameters that must be set by default ( or overridden ) for something to be
well defined.

The tremor runtime checks for ommissions and produces an error for attempted instanciations that
omit to provide a value for specified arguments.



## Rule ExprImut

The `ExprImut` is the root of immutable expressions in tremor.



![ExprImut](svg/exprimut.svg)

```ebnf
rule ExprImut ::=
    OrExprImut 
  ;

```




The effective root of the subset of the expression langauge applicable in most immutable
processing context in tremor is captured by this rule.



## Rule CreationWithEnd

The `CreationWithEnd` rule defines a `with` block of expressions with a terminal `end` keyword.



![CreationWithEnd](svg/creationwithend.svg)

```ebnf
rule CreationWithEnd ::=
    WithEndClause 
  | 
  ;

```




```tremor
with x = y end
```



## Rule CreationWith

The `CreationWith` rule defines an optional `with` block of expressions without a terminal `end` keyword.



![CreationWith](svg/creationwith.svg)

```ebnf
rule CreationWith ::=
    WithClause 
  | 
  ;

```



<!-- Added to avoid `lint` warnings from the lalrpop docgen tool. No epilog content needed for this rule -->


## Rule WithClause

The `WithClause` rule defines a `with` block with a `,` comma delimited set of `WithExpr` rules.



![WithClause](svg/withclause.svg)

```ebnf
rule WithClause ::=
     'with' WithExprs 
  ;

```





```tremor
with x = y
```




## Rule WithExprs

The `WithExprs` rule defines a `,` comma delimited set of `WithExpr` rules.



![WithExprs](svg/withexprs.svg)

```ebnf
rule WithExprs ::=
    Sep!(WithExprs, WithExpr, ",") 
  ;

```



<!-- Added to avoid `lint` warnings from the lalrpop docgen tool. No epilog content needed for this rule -->


## Rule ModPath

The `ModPath` rule defines a modular path.

A modular path is a sequence of `Ident`s separated by a `::` double-colon.



![ModPath](svg/modpath.svg)

```ebnf
rule ModPath ::=
    ModPath  '::' Ident 
  | Ident 
  ;

```




### How do i reference something from the standard library?

The standard library contains reusable constants, functions
and other definitions that can be used in scripts via the
`Use` and `ModPath` rules.

For example, if you have a file called `foo.tremor` in a `src`
folder you can append this to your `TREMOR_PATH` environment
variable

```bash
export TREMOR_PATH=/path/to/src
```

Assuming `foo.tremor` contains the following code:

```tremor
fn meaning_of_life() of
  42
end;
```

We can use this in another script as follows:

```tremor
use foo;

let meaning = foo::meaning_of_life();
```




