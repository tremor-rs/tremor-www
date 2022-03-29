# Query Grammar

## Rule Query

### Query Language Entrypoint

This is the top level rule of the tremor query language `trickle`


<img src="./svg/query.svg" alt="Query" width="555" height="100"/>

```ebnf
rule Query ::=
    ConfigDirectives Stmts  '<end-of-stream>' ?  
  | Stmts  '<end-of-stream>' ?  
  ;

```



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



## Rule Stmts

The `Stmts` rule defines a `;` semi-colon delimited sequence of `Stmt` rules.



<img src="./svg/stmts.svg" alt="Stmts" width="299" height="87"/>

```ebnf
rule Stmts ::=
    Stmt  ';' Stmts 
  | Stmt  ';' ?  
  ;

```



## Rule Stmt

The `Stmt` rule defines the legal statements in a query script.

Queries in tremor support:
* Defining named `window`, `operator`, `script` and `pipeline` definitions.
* Creating node instances of `stream`, `pipeline`, `operator` and `script` operations.
* Linking nodes togther to form an execution graph via the `select` operation.



<img src="./svg/stmt.svg" alt="Stmt" width="1237" height="339"/>

```ebnf
rule Stmt ::=
    Use 
  | DefineWindow 
  | DefineOperator 
  | DefineScript 
  | DefinePipeline 
  | CreateOperator 
  | CreateScript 
  | CreatePipeline 
  |  'create'  'stream' Ident 
  |  'select' ComplexExprImut  'from' StreamPort WindowClause WhereClause GroupByClause  'into' StreamPort HavingClause 
  ;

```



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



## Rule CreateOperator

The `CreateOperator` rule creates an operator.

An operator is a query operation composed using the builtin 
operators provided by tremor written in the rust programming language.

The rule causes an instance of the referenced operator definition to be
created an inserted into the query processing execution graph.



<img src="./svg/createoperator.svg" alt="CreateOperator" width="749" height="75"/>

```ebnf
rule CreateOperator ::=
     'create'  'operator' Ident CreationWithEnd 
  |  'create'  'operator' Ident  'from' ModularTarget CreationWithEnd 
  ;

```



## Rule CreateScript

The `CreateScript` rule creates an operator based on a tremor script.

A script operator is a query operation composed using the scripting language
DSL rather than the builtin operators provided by tremor written in the
rust programming language.

The rule causes an instance of the referenced script definition to be
created an inserted into the query processing execution graph.



<img src="./svg/createscript.svg" alt="CreateScript" width="733" height="75"/>

```ebnf
rule CreateScript ::=
     'create'  'script' Ident CreationWithEnd 
  |  'create'  'script' Ident  'from' ModularTarget CreationWithEnd 
  ;

```



## Rule CreatePipeline

The `CreatePipeline` rule creates a pipeline.

A pipeline is a query operation composed using the query langauge DSL
instead of a builtin operation provided by tremor written in the rust
programming language.

The rule causes an instance of the referenced pipeline definition to be
created an inserted into the query processing execution graph.



<img src="./svg/createpipeline.svg" alt="CreatePipeline" width="749" height="75"/>

```ebnf
rule CreatePipeline ::=
     'create'  'pipeline' Ident CreationWithEnd 
  |  'create'  'pipeline' Ident  'from' ModularTarget CreationWithEnd 
  ;

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



## Rule ComplexExprImut

The `ComplexExprImut` rule defines complex immutable expression in tremor.



<img src="./svg/complexexprimut.svg" alt="ComplexExprImut" width="215" height="108"/>

```ebnf
rule ComplexExprImut ::=
    MatchImut 
  | ForImut 
  | ExprImut 
  ;

```



## Rule StreamPort

The `StreamPort` rule defines a stream by name with an optional named `Port`.

When the `Port` is omitted, tremor will internally default the `Port` to the
appropriate `in` or `out` port. Where the `err` or user defined `Port`s are
preferred, the optional `Port` specification SHOULD be provided.



<img src="./svg/streamport.svg" alt="StreamPort" width="237" height="42"/>

```ebnf
rule StreamPort ::=
    Ident MaybePort 
  ;

```



## Rule WindowClause

The `WindowClause` rule defines an optional window definition for a supporting operation.



<img src="./svg/windowclause.svg" alt="WindowClause" width="223" height="55"/>

```ebnf
rule WindowClause ::=
    ( WindowDefn ) ?  
  ;

```



## Rule WhereClause

The `WhereClause` defines a predicate expression used to filter ( forward or discard ) events in an operation.

The `where` clause is executed before a operation processes an event.



<img src="./svg/whereclause.svg" alt="WhereClause" width="349" height="55"/>

```ebnf
rule WhereClause ::=
    (  'where' ComplexExprImut ) ?  
  ;

```



## Rule GroupByClause

The `GroupByClause` defines the group by clause of a supporting operation in tremor.

An operator that uses a group by clause maintains the operation for each group captured
by the grouping dimensions specified in this clause.



<img src="./svg/groupbyclause.svg" alt="GroupByClause" width="355" height="55"/>

```ebnf
rule GroupByClause ::=
    (  'group'  'by' GroupDef ) ?  
  ;

```



## Rule HavingClause

The `HavingClause` defines a predicate expression used to filter ( forward or discard ) events in an operation.

The `having` clause is executed after an operation has processed an event.


<img src="./svg/havingclause.svg" alt="HavingClause" width="357" height="55"/>

```ebnf
rule HavingClause ::=
    (  'having' ComplexExprImut ) ?  
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



## Rule WindowKind

### Tumbling

A `tumbling` window defines a wall-clock-bound or data-bound window of non-overlapping
time for storing events. The windows can not overlap, and there are no gaps between
windows permissible.

### Sliding

A `sliding` window defines a wall-clock-bound or data-bound window of events that captures
an intervalic window of events whose extent derives from the size of the window. A sliding
window of size 2 captures up to to events. Every subsequent event will evict the oldest and
retain the newest event with the previous ( now oldest ) event.

### Conditioning

Both kinds of window store events in arrival order


<img src="./svg/windowkind.svg" alt="WindowKind" width="223" height="75"/>

```ebnf
rule WindowKind ::=
     'sliding' 
  |  'tumbling' 
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



## Rule EmbeddedScriptImut

The `EmbeddedScriptImut` rule defines an optional embedded `script`.
 


<img src="./svg/embeddedscriptimut.svg" alt="EmbeddedScriptImut" width="413" height="55"/>

```ebnf
rule EmbeddedScriptImut ::=
    (  'script' EmbeddedScriptContent ) ?  
  ;

```



## Rule OperatorKind

The `OperatorKind` rule defines a modular path like reference to a builtin tremor operator.

Operators are programmed in rust native code and referenced via a virtual module path.



<img src="./svg/operatorkind.svg" alt="OperatorKind" width="267" height="42"/>

```ebnf
rule OperatorKind ::=
    Ident  '::' Ident 
  ;

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



## Rule DefinitionArgs

The `DefinitionArgs` rule defines an arguments block without an `end` block.



<img src="./svg/definitionargs.svg" alt="DefinitionArgs" width="223" height="55"/>

```ebnf
rule DefinitionArgs ::=
    ArgsClause ?  
  ;

```



## Rule EmbeddedScript

The `EmbeddedScript` rule defines a script using the [Script DSL](/docs/language/Script) [ [Full](/docs/language/Full#rule-script) ].

The script is enclosed in `script` .. `end` blocks.



<img src="./svg/embeddedscript.svg" alt="EmbeddedScript" width="363" height="42"/>

```ebnf
rule EmbeddedScript ::=
     'script' TopLevelExprs  'end' 
  ;

```



## Rule Ports

The `Ports` rule defines a `,` comma delimited set of stream ports.



<img src="./svg/ports.svg" alt="Ports" width="275" height="86"/>

```ebnf
rule Ports ::=
    Sep!(Ports, <Ident>, ",") 
  ;

```



## Rule Pipeline

The `Pipeline` rule defines a block of statements in a `pipeline` .. `end` block.

The block MAY begin with an optional set of `ConfigDirectives`.



<img src="./svg/pipeline.svg" alt="Pipeline" width="633" height="55"/>

```ebnf
rule Pipeline ::=
     'pipeline' ConfigDirectives ?  PipelineCreateInner  'end' 
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



## Rule MaybePort

The `MaybePort` rule defines an optional `Port`.



<img src="./svg/maybeport.svg" alt="MaybePort" width="237" height="55"/>

```ebnf
rule MaybePort ::=
    (  '/' Ident ) ?  
  ;

```



## Rule WindowDefn

The `WindowDefn` defines a temporal basis over which a stream of events is applicable.



<img src="./svg/windowdefn.svg" alt="WindowDefn" width="259" height="42"/>

```ebnf
rule WindowDefn ::=
     '[' Windows  ']' 
  ;

```



## Rule Windows

The `Windows` rule defines a sequence of window definitions that are `,` comma delimited.



<img src="./svg/windows.svg" alt="Windows" width="159" height="42"/>

```ebnf
rule Windows ::=
    Windows_ 
  ;

```



## Rule Windows_

The `Windows_` rule defines a sequence of window definitions that are `,` comma delimited.



<img src="./svg/windows_.svg" alt="Windows_" width="307" height="86"/>

```ebnf
rule Windows_ ::=
    Sep!(Windows_, Window, ",") 
  ;

```



## Rule Window

The `Window` rule defines a modular target to a window definition.



<img src="./svg/window.svg" alt="Window" width="199" height="42"/>

```ebnf
rule Window ::=
    ModularTarget 
  ;

```



## Rule GroupDef

The `GroupDef` rule defines the parts of a grouping dimension.

Group segments can be derived from:
* Expressions - for which their serialized values are used.
* Set expressions - which computes a set based on an expression.
* Each expressions - which iterates an expression to compute a set.



<img src="./svg/groupdef.svg" alt="GroupDef" width="393" height="108"/>

```ebnf
rule GroupDef ::=
    ExprImut 
  |  'set'  '(' GroupDefs  ')' 
  |  'each'  '(' ExprImut  ')' 
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



## Rule GroupDefs

The `GroupDefs` rule defines a `,` comma delimited set of `GroupDef` rules.



<img src="./svg/groupdefs.svg" alt="GroupDefs" width="175" height="42"/>

```ebnf
rule GroupDefs ::=
    GroupDefs_ 
  ;

```



## Rule GroupDefs_

The `GroupDefs_` rule defines a `,` comma delimited set of `GroupDef` rules.



<img src="./svg/groupdefs_.svg" alt="GroupDefs_" width="339" height="86"/>

```ebnf
rule GroupDefs_ ::=
    Sep!(GroupDefs_, GroupDef, ",") 
  ;

```



## Rule EmbeddedScriptContent

The `EmbeddedScriptContent` rule defines an embedded script expression. 



<img src="./svg/embeddedscriptcontent.svg" alt="EmbeddedScriptContent" width="159" height="42"/>

```ebnf
rule EmbeddedScriptContent ::=
    ExprImut 
  ;

```



## Rule TopLevelExprs

The `TopLevelExprs` rule defines semi-colon separated sequence of top level
tremor expressions with an optional terminating semi-colon



<img src="./svg/toplevelexprs.svg" alt="TopLevelExprs" width="427" height="87"/>

```ebnf
rule TopLevelExprs ::=
    TopLevelExpr  ';' TopLevelExprs 
  | TopLevelExpr  ';' ?  
  ;

```



## Rule PipelineCreateInner

The `PipelineCreateInner` is an internal rule of the `Pipeline` rule.

The rule defines a `;` semi-colon delimited set of one or many `Stmt`s.



<img src="./svg/pipelinecreateinner.svg" alt="PipelineCreateInner" width="299" height="87"/>

```ebnf
rule PipelineCreateInner ::=
    Stmt  ';' Stmts 
  | Stmt  ';' ?  
  ;

```




