# Use Grammar

## Rule Use

Imports definitions from an external source for use in the current source file.

The contents of a source file form a module.

### TREMOR_PATH

The `TREMOR_PATH` environment path variable is a `:` delimited set of paths.

Each path is an absolute or relative path to a directory.

When using relative paths - these are relative to the working directory where the
`tremor` executable is executed from.

The tremor standard library MUST be added to the path to be accessible to scripts.



<img src="./svg/use.svg" alt="Use" width="449" height="75"/>

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



## Rule ModularTarget

A `ModularTarget` indexes into tremor's module path.

In tremor a `module` is a file on the file system.

A `module` is also a unit of compilation.

A `ModularTarget` is a `::` double-colon delimited set of identifiers.

Leading `::` are not supported in a modular target..

Trailing `::` are not supported in a modular target.



<img src="./svg/modulartarget.svg" alt="ModularTarget" width="331" height="75"/>

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



<img src="./svg/ident.svg" alt="Ident" width="167" height="42"/>

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



## Rule ConfigDirectives

The `ConfigDirectives` rule allows line delimited compiler, interpreter or
runtime hints to be specified.




<img src="./svg/configdirectives.svg" alt="ConfigDirectives" width="421" height="75"/>

```ebnf
rule ConfigDirectives ::=
    ConfigDirective ConfigDirectives 
  | ConfigDirective 
  ;

```



## Rule ConfigDirective

A `ConfigDirective` is a directive to the tremor runtime.

Directives MUST begin on a new line with the `#!config` shebang  config token.



<img src="./svg/configdirective.svg" alt="ConfigDirective" width="269" height="42"/>

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



<img src="./svg/withexpr.svg" alt="WithExpr" width="283" height="42"/>

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
 


## Rule ArgsWithEnd

The `ArgsWithEnd` rule defines an arguments block with an `end` block.



<img src="./svg/argswithend.svg" alt="ArgsWithEnd" width="405" height="77"/>

```ebnf
rule ArgsWithEnd ::=
    ArgsClause ?  WithEndClause 
  | 
  ;

```



## Rule ArgsClause

The `ArgsClause` rule marks the beginning of an arguments block.

A valid clause has one or many argument expressions delimited by a ',' comma.



<img src="./svg/argsclause.svg" alt="ArgsClause" width="245" height="42"/>

```ebnf
rule ArgsClause ::=
     'args' ArgsExprs 
  ;

```



## Rule WithEndClause

<img src="./svg/withendclause.svg" alt="WithEndClause" width="245" height="42"/>

```ebnf
rule WithEndClause ::=
    WithClause  'end' 
  ;

```



## Rule DefinitionArgs

The `DefinitionArgs` rule defines an arguments block without an `end` block.



<img src="./svg/definitionargs.svg" alt="DefinitionArgs" width="223" height="55"/>

```ebnf
rule DefinitionArgs ::=
    ArgsClause ?  
  ;

```



## Rule ArgsExprs

The `ArgsExpr` rule is a macro rule invocation based on the `Sep` separator macro rule.

An args expression is a comma delimited set of argument expressions.



<img src="./svg/argsexprs.svg" alt="ArgsExprs" width="331" height="86"/>

```ebnf
rule ArgsExprs ::=
    Sep!(ArgsExprs, ArgsExpr, ",") 
  ;

```



## Rule ArgsExpr

<img src="./svg/argsexpr.svg" alt="ArgsExpr" width="331" height="75"/>

```ebnf
rule ArgsExpr ::=
    Ident  '=' ExprImut 
  | Ident 
  ;

```



## Rule ExprImut

The `ExprImut` is the root of immutable expressions in tremor.



<img src="./svg/exprimut.svg" alt="ExprImut" width="175" height="42"/>

```ebnf
rule ExprImut ::=
    OrExprImut 
  ;

```



## Rule CreationWithEnd

The `CreationWithEnd` rule defines a `with` block of expressions with a terminal `end` keyword.



<img src="./svg/creationwithend.svg" alt="CreationWithEnd" width="247" height="64"/>

```ebnf
rule CreationWithEnd ::=
    WithEndClause 
  | 
  ;

```



## Rule CreationWith

The `CreationWit` rule defines an optional `with` block of expressions without a terminal `end` keyword.



<img src="./svg/creationwith.svg" alt="CreationWith" width="223" height="64"/>

```ebnf
rule CreationWith ::=
    WithClause 
  | 
  ;

```



## Rule WithClause

The `WithClause` rule defines a `with` block with a `,` comma delimited set of `WithExpr` rules.



<img src="./svg/withclause.svg" alt="WithClause" width="245" height="42"/>

```ebnf
rule WithClause ::=
     'with' WithExprs 
  ;

```



## Rule WithExprs

The `WithExprs` rule defines a `,` comma delimited set of `WithExpr` rules.



<img src="./svg/withexprs.svg" alt="WithExprs" width="331" height="86"/>

```ebnf
rule WithExprs ::=
    Sep!(WithExprs, WithExpr, ",") 
  ;

```



## Rule ModuleBody

The `ModuleBody` rule defines the structure of a valid module in tremor.

Modules begin with optional module comments.

Modules MUST define at least one statement, but may define many.

Statements are `;` semi-colon delimited.



<img src="./svg/modulebody.svg" alt="ModuleBody" width="293" height="42"/>

```ebnf
rule ModuleBody ::=
    ModComment ModuleStmts 
  ;

```



## Rule ModComment

The `ModComment` rule specifies module comments in tremor.

Documentation comments for modules are optional.

A module documentation comment begins with a `###` triple-hash and they are line delimited.

Muliple successive comments are coalesced together to form a complete comment.

The content of a module documentation comment is markdown syntax.



<img src="./svg/modcomment.svg" alt="ModComment" width="231" height="55"/>

```ebnf
rule ModComment ::=
    ( ModComment_ ) ?  
  ;

```



### Example

Module level comments are used throughput the tremor standard library
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



<img src="./svg/modulestmts.svg" alt="ModuleStmts" width="395" height="87"/>

```ebnf
rule ModuleStmts ::=
    ModuleStmt  ';' ModuleStmts 
  | ModuleStmt  ';' ?  
  ;

```



## Rule ModuleFile

The `ModuleFile` rule defines a module in tremor.

A module is a unit of compilation.



<img src="./svg/modulefile.svg" alt="ModuleFile" width="341" height="42"/>

```ebnf
rule ModuleFile ::=
    ModuleBody  '<end-of-stream>' 
  ;

```



## Rule ModuleStmt

The `ModuleStmt` rule defines the statement types that are valid in a tremor module.




<img src="./svg/modulestmt.svg" alt="ModuleStmt" width="263" height="339"/>

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



## Rule Const

The `Const` rule defines a rule that binds an immutable expression to an identifier.

As the value cannot be changed at runtime.



<img src="./svg/const.svg" alt="Const" width="535" height="42"/>

```ebnf
rule Const ::=
    DocComment  'const' Ident  '=' ComplexExprImut 
  ;

```



### Example

```tremor
use std::base64;
const snot = "snot";
const badger = "badger";
const snot_badger = { "#{snot}": "#{base64::encode(badger)}" };
```



## Rule FnDefn

<img src="./svg/fndefn.svg" alt="FnDefn" width="1015" height="207"/>

```ebnf
rule FnDefn ::=
    DocComment  'fn' Ident  '('  '.'  '.'  '.'  ')'  'with' InnerExprs  'end' 
  | DocComment  'fn' Ident  '(' FnArgs  ','  '.'  '.'  '.'  ')'  'with' InnerExprs  'end' 
  | DocComment  'fn' Ident  '('  ')'  'with' InnerExprs  'end' 
  | DocComment  'fn' Ident  '(' FnArgs  ')'  'with' InnerExprs  'end' 
  | DocComment  'fn' Ident  '('  ')'  'of' FnCases  'end' 
  | DocComment  'fn' Ident  '(' FnArgs  ')'  'of' FnCases  'end' 
  ;

```



## Rule Intrinsic

The `intrinsic` rule defines intrinsic function signatures.

This rule allows tremor maintainers to document the builtin functions implemented as
native rust code. The facility also allows document generation tools to document builtin
intrinsic functions in the same way as user defined functions.

In short, these can be thought of as runtime provided.

For information on how to define user defined functions see the [function](#rule-fndecl) rule.



<img src="./svg/intrinsic.svg" alt="Intrinsic" width="1071" height="141"/>

```ebnf
rule Intrinsic ::=
    DocComment  'intrinsic'  'fn' Ident  '('  ')'  'as' ModularTarget 
  | DocComment  'intrinsic'  'fn' Ident  '(' FnArgs  ')'  'as' ModularTarget 
  | DocComment  'intrinsic'  'fn' Ident  '(' FnArgs  ','  '.'  '.'  '.'  ')'  'as' ModularTarget 
  | DocComment  'intrinsic'  'fn' Ident  '('  '.'  '.'  '.'  ')'  'as' ModularTarget 
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



<img src="./svg/definewindow.svg" alt="DefineWindow" width="991" height="42"/>

```ebnf
rule DefineWindow ::=
    DocComment  'define'  'window' Ident  'from' WindowKind CreationWith EmbeddedScriptImut  'end' 
  ;

```



## Rule DefineOperator

The `DefineOperator` rule defines an operator.

An operator is a query operation composed using the builtin 
operators provided by tremor written in the rust programming language.

The named operator can be parameterized and instanciated via the `CreateOperator` rule


<img src="./svg/defineoperator.svg" alt="DefineOperator" width="771" height="42"/>

```ebnf
rule DefineOperator ::=
    DocComment  'define'  'operator' Ident  'from' OperatorKind ArgsWithEnd 
  ;

```



## Rule DefineScript

The `DefineScript` rule defines a named operator based on a tremor script.

A script operator is a query operation composed using the scripting language
DSL rather than the builtin operators provided by tremor written in the
rust programming language.

The named script can be parameterized and instanciated via the `CreateScript` rule
 


<img src="./svg/definescript.svg" alt="DefineScript" width="717" height="42"/>

```ebnf
rule DefineScript ::=
    DocComment  'define'  'script' Ident DefinitionArgs EmbeddedScript 
  ;

```



## Rule DefinePipeline

The `DefinePipeline` rule creates a named pipeline.

A pipeline is a query operation composed using the query langauge DSL
instead of a builtin operation provided by tremor written in the rust
programming language.

The named pipeline can be parameterized and instanciated via the `CreatePipeline` rule



<img src="./svg/definepipeline.svg" alt="DefinePipeline" width="1077" height="55"/>

```ebnf
rule DefinePipeline ::=
    DocComment  'define'  'pipeline' Ident (  'from' Ports ) ?  (  'into' Ports ) ?  DefinitionArgs Pipeline 
  ;

```



## Rule DefineConnector

The `DefineConnector` rule defines a connector.

A connector is a runtime artefact that allows tremor to connect to the outside
world, or for the outside connector to connect to tremor to send and/or receive
data.

The named connector can be parameterized and instanciated via the `Create` rule



<img src="./svg/defineconnector.svg" alt="DefineConnector" width="787" height="42"/>

```ebnf
rule DefineConnector ::=
    DocComment  'define'  'connector' Ident  'from' ConnectorKind ArgsWithEnd 
  ;

```



## Rule DefineFlow

<img src="./svg/defineflow.svg" alt="DefineFlow" width="809" height="42"/>

```ebnf
rule DefineFlow ::=
    DocComment  'define'  'flow' Ident DefinitionArgs  'flow' FlowStmts  'end' 
  ;

```



## Rule ModPath

The `ModPath` rule defines a modular path.

A modular path is a sequence of `Ident`s separated by a `::` double-colon.



<img src="./svg/modpath.svg" alt="ModPath" width="331" height="75"/>

```ebnf
rule ModPath ::=
    ModPath  '::' Ident 
  | Ident 
  ;

```



## Rule DocComment

The `DocComment` rule specifies documentation comments in tremor.

Documentation comments are optional.

A documentation comment begins with a `##` double-hash and they are line delimited.

Muliple successive comments are coalesced together to form a complete comment.

The content of a documentation comment is markdown syntax.



<img src="./svg/doccomment.svg" alt="DocComment" width="231" height="55"/>

```ebnf
rule DocComment ::=
    ( DocComment_ ) ?  
  ;

```



## Rule DocComment_

The `DocComment_` rule is an internal part of the `DocComment` rule



<img src="./svg/doccomment_.svg" alt="DocComment_" width="381" height="75"/>

```ebnf
rule DocComment_ ::=
     '<doc-comment>' 
  | DocComment_  '<doc-comment>' 
  ;

```



## Rule ModComment_

The `ModComment_` rule is an internal part of the `ModComment` rule



<img src="./svg/modcomment_.svg" alt="ModComment_" width="381" height="75"/>

```ebnf
rule ModComment_ ::=
     '<mod-comment>' 
  | ModComment_  '<mod-comment>' 
  ;

```




