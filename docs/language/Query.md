# Query Grammar

## Rule Query

### Query Language Entrypoint

This is the top level rule of the tremor query language `trickle`


<img src="svg/Query.svg" alt="Query" width="555" height="100"/>

```ebnf
rule Query ::=
    ConfigDirectives Stmts  '<end-of-stream>' ?  
  | Stmts  '<end-of-stream>' ?  
  ;

```



### Query Language Entrypoint

This is the top level rule of the tremor query language `trickle`


## Rule ConfigDirectives

The `ConfigDirectives` rule allows line delimited compiler, interpreter or
runtime hints to be specified.




<img src="svg/ConfigDirectives.svg" alt="ConfigDirectives" width="421" height="75"/>

```ebnf
rule ConfigDirectives ::=
    ConfigDirective ConfigDirectives 
  | ConfigDirective 
  ;

```



The `ConfigDirectives` rule allows line delimited compiler, interpreter or
runtime hints to be specified.




## Rule Stmts

The `Stmts` rule defines a `;` semi-colon delimited sequence of `Stmt` rules.



<img src="svg/Stmts.svg" alt="Stmts" width="299" height="87"/>

```ebnf
rule Stmts ::=
    Stmt  ';' Stmts 
  | Stmt  ';' ?  
  ;

```



The `Stmts` rule defines a `;` semi-colon delimited sequence of `Stmt` rules.



## Rule ConfigDirective

A `ConfigDirective` is a directive to the tremor runtime.

Directives MUST begin on a new line with the `#!config` shebang  config token.



<img src="svg/ConfigDirective.svg" alt="ConfigDirective" width="269" height="42"/>

```ebnf
rule ConfigDirective ::=
     '#!config' WithExpr 
  ;

```



A `ConfigDirective` is a directive to the tremor runtime.

Directives MUST begin on a new line with the `#!config` shebang  config token.



## Rule WithExpr

The `WithExpr` rule defines a name value binding.



<img src="svg/WithExpr.svg" alt="WithExpr" width="283" height="42"/>

```ebnf
rule WithExpr ::=
    Ident  '=' ExprImut 
  ;

```



The `WithExpr` rule defines a name value binding.



## Rule Stmt

The `Stmt` rule defines the legal statements in a query script.

Queries in tremor support:
* Defining named `window`, `operator`, `script` and `pipeline` definitions.
* Creating node instances of `stream`, `pipeline`, `operator` and `script` operations.
* Linking nodes togther to form an execution graph via the `select` operation.



<img src="svg/Stmt.svg" alt="Stmt" width="1237" height="537"/>

```ebnf
rule Stmt ::=
    ModuleStmt 
  |  'define' WindowKind  'window' Ident WithScriptClause 
  |  'define' OperatorKind  'operator' Ident WithClause 
  |  'define' OperatorKind  'operator' Ident 
  |  'define'  'script' Ident ScriptWithClause EmbeddedScript 
  |  'define'  'script' Ident EmbeddedScript 
  |  'create'  'stream' Ident 
  |  'create'  'operator' Ident  'from' ModularTarget WithClause 
  |  'create'  'operator' Ident  'from' ModularTarget 
  |  'create'  'operator' Ident WithClause 
  |  'create'  'operator' Ident 
  |  'create'  'script' Ident  'from' ModularTarget WithClause 
  |  'create'  'script' Ident  'from' ModularTarget 
  |  'create'  'script' Ident WithClause 
  |  'create'  'script' Ident 
  |  'select' ComplexExprImut  'from' StreamPort WindowClause WhereClause GroupByClause  'into' StreamPort HavingClause 
  ;

```



The `Stmt` rule defines the legal statements in a query script.

Queries in tremor support:
* Defining named `window`, `operator`, `script` and `pipeline` definitions.
* Creating node instances of `stream`, `pipeline`, `operator` and `script` operations.
* Linking nodes togther to form an execution graph via the `select` operation.



## Rule ModuleStmt

The `ModuleStmt` rule defines the statement types that are valid in a tremor module.




<img src="svg/ModuleStmt.svg" alt="ModuleStmt" width="581" height="42"/>

```ebnf
rule ModuleStmt ::=
     'mod' Ident  'with' ModComment ModuleStmts  'end' 
  ;

```



The `ModuleStmt` rule defines the statement types that are valid in a tremor module.




## Rule Ident

An `Ident` is an identifier - a user defined name for a tremor value.



<img src="svg/Ident.svg" alt="Ident" width="167" height="42"/>

```ebnf
rule Ident ::=
     '<ident>' 
  ;

```



An `Ident` is an identifier - a user defined name for a tremor value.



## Rule ModComment

The `ModComment` rule specifies module comments in tremor.

Documentation comments for modules are optional.

A module documentation comment begins with a `###` triple-hash and they are line delimited.

Muliple successive comments are coalesced together to form a complete comment.

The content of a module documentation comment is markdown syntax.



<img src="svg/ModComment.svg" alt="ModComment" width="231" height="55"/>

```ebnf
rule ModComment ::=
    ( ModComment_ ) ?  
  ;

```



The `ModComment` rule specifies module comments in tremor.

Documentation comments for modules are optional.

A module documentation comment begins with a `###` triple-hash and they are line delimited.

Muliple successive comments are coalesced together to form a complete comment.

The content of a module documentation comment is markdown syntax.



## Rule ModuleStmts

The `ModuleStmts` rule defines a set of module statements.

Module statements are a `;` semi-colon delimited set of `ModuleStmt` rules



<img src="svg/ModuleStmts.svg" alt="ModuleStmts" width="435" height="87"/>

```ebnf
rule ModuleStmts ::=
    ModuleInnerStmt  ';' ModuleStmts 
  | ModuleInnerStmt  ';' ?  
  ;

```



The `ModuleStmts` rule defines a set of module statements.

Module statements are a `;` semi-colon delimited set of `ModuleStmt` rules



## Rule ModuleInnerStmt

<img src="svg/ModuleInnerStmt.svg" alt="ModuleInnerStmt" width="671" height="306"/>

```ebnf
rule ModuleInnerStmt ::=
    ModuleStmt 
  |  'define' WindowKind  'window' Ident WithScriptClause 
  |  'define' OperatorKind  'operator' Ident WithClause 
  |  'define' OperatorKind  'operator' Ident 
  |  'define'  'script' Ident ScriptWithClause EmbeddedScript 
  |  'define'  'script' Ident EmbeddedScript 
  | Const 
  | FnDecl 
  | Intrinsic 
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


<img src="svg/WindowKind.svg" alt="WindowKind" width="223" height="75"/>

```ebnf
rule WindowKind ::=
     'sliding' 
  |  'tumbling' 
  ;

```



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


## Rule WithScriptClause

<img src="svg/WithScriptClause.svg" alt="WithScriptClause" width="489" height="42"/>

```ebnf
rule WithScriptClause ::=
     'with' WithExprs EmbeddedScriptImut  'end' 
  ;

```



## Rule OperatorKind

The `OperatorKind` rule defines a modular path like reference to a builtin tremor operator.

Operators are programmed in rust native code and referenced via a virtual module path.



<img src="svg/OperatorKind.svg" alt="OperatorKind" width="267" height="42"/>

```ebnf
rule OperatorKind ::=
    Ident  '::' Ident 
  ;

```



The `OperatorKind` rule defines a modular path like reference to a builtin tremor operator.

Operators are programmed in rust native code and referenced via a virtual module path.



## Rule WithClause

The `WithClause` rule defines a `with` block with a `,` comma delimited set of `WithExpr` rules.



<img src="svg/WithClause.svg" alt="WithClause" width="293" height="42"/>

```ebnf
rule WithClause ::=
    ScriptWithClause  'end' 
  ;

```



The `WithClause` rule defines a `with` block with a `,` comma delimited set of `WithExpr` rules.



## Rule ScriptWithClause

<img src="svg/ScriptWithClause.svg" alt="ScriptWithClause" width="245" height="42"/>

```ebnf
rule ScriptWithClause ::=
     'with' WithExprs 
  ;

```



## Rule EmbeddedScript

The `EmbeddedScript` rule defines a script using the [Script DSL](/docs/language/Script) [ [Full](/docs/language/Full#rule-script) ].

The script is enclosed in `script` .. `end` blocks.



<img src="svg/EmbeddedScript.svg" alt="EmbeddedScript" width="299" height="42"/>

```ebnf
rule EmbeddedScript ::=
     'script' Exprs  'end' 
  ;

```



The `EmbeddedScript` rule defines a script using the [Script DSL](/docs/language/Script) [ [Full](/docs/language/Full#rule-script) ].

The script is enclosed in `script` .. `end` blocks.



## Rule Const

The `Const` rule defines a rule that binds an immutable expression to an identifier.

As the value cannot be changed at runtime.



<img src="svg/Const.svg" alt="Const" width="527" height="42"/>

```ebnf
rule Const ::=
    DocComment  'const' Ident  '=' SimpleExprImut 
  ;

```



The `Const` rule defines a rule that binds an immutable expression to an identifier.

As the value cannot be changed at runtime.



## Rule FnDecl

The `FnDecl` rule allows user defined functions to be defined.

This rule allows tremor users to create functions for reuse in one or many tremor applications.



<img src="svg/FnDecl.svg" alt="FnDecl" width="975" height="207"/>

```ebnf
rule FnDecl ::=
    DocComment  'fn' Ident  '('  '.'  '.'  '.'  ')'  'with' Exprs  'end' 
  | DocComment  'fn' Ident  '(' FnArgs  ','  '.'  '.'  '.'  ')'  'with' Exprs  'end' 
  | DocComment  'fn' Ident  '('  ')'  'with' Exprs  'end' 
  | DocComment  'fn' Ident  '(' FnArgs  ')'  'with' Exprs  'end' 
  | DocComment  'fn' Ident  '('  ')'  'of' FnCases  'end' 
  | DocComment  'fn' Ident  '(' FnArgs  ')'  'of' FnCases  'end' 
  ;

```



The `FnDecl` rule allows user defined functions to be defined.

This rule allows tremor users to create functions for reuse in one or many tremor applications.



## Rule Intrinsic

The `intrinsic` rule defines intrinsic function signatures.

This rule allows tremor maintainers to document the builtin functions implemented as
native rust code. The facility also allows document generation tools to document builtin
intrinsic functions in the same way as user defined functions.

In short, these can be thought of as runtime provided.

For information on how to define user defined functions see the [function](#rule-fndecl) rule.



<img src="svg/Intrinsic.svg" alt="Intrinsic" width="1071" height="141"/>

```ebnf
rule Intrinsic ::=
    DocComment  'intrinsic'  'fn' Ident  '('  ')'  'as' ModularTarget 
  | DocComment  'intrinsic'  'fn' Ident  '(' FnArgs  ')'  'as' ModularTarget 
  | DocComment  'intrinsic'  'fn' Ident  '(' FnArgs  ','  '.'  '.'  '.'  ')'  'as' ModularTarget 
  | DocComment  'intrinsic'  'fn' Ident  '('  '.'  '.'  '.'  ')'  'as' ModularTarget 
  ;

```



The `intrinsic` rule defines intrinsic function signatures.

This rule allows tremor maintainers to document the builtin functions implemented as
native rust code. The facility also allows document generation tools to document builtin
intrinsic functions in the same way as user defined functions.

In short, these can be thought of as runtime provided.

For information on how to define user defined functions see the [function](#rule-fndefn) rule.



## Rule ModularTarget

A `ModularTarget` indexes into tremor's module path.

In tremor a `module` is a file on the file system.

A `module` is also a unit of compilation.

A `ModularTarget` is a `::` double-colon delimited set of identifiers.

Leading `::` are not supported in a modular target..

Trailing `::` are not supported in a modular target.



<img src="svg/ModularTarget.svg" alt="ModularTarget" width="331" height="75"/>

```ebnf
rule ModularTarget ::=
    Ident 
  | ModPath  '::' Ident 
  ;

```



A `ModularTarget` indexes into tremor's module path.

In tremor a `module` is a file on the file system.

A `module` is also a unit of compilation.

A `ModularTarget` is a `::` double-colon delimited set of identifiers.

Leading `::` are not supported in a modular target..

Trailing `::` are not supported in a modular target.



## Rule ComplexExprImut

The `ComplexExprImut` rule defines complex immutable expression in tremor.



<img src="svg/ComplexExprImut.svg" alt="ComplexExprImut" width="215" height="108"/>

```ebnf
rule ComplexExprImut ::=
    MatchImut 
  | ForImut 
  | ExprImut 
  ;

```



The `ComplexExprImut` rule defines complex immutable expression in tremor.



## Rule StreamPort

The `StreamPort` rule defines a stream by name with an optional named `Port`.

When the `Port` is omitted, tremor will internally default the `Port` to the
appropriate `in` or `out` port. Where the `err` or user defined `Port`s are
preferred, the optional `Port` specification SHOULD be provided.



<img src="svg/StreamPort.svg" alt="StreamPort" width="237" height="42"/>

```ebnf
rule StreamPort ::=
    Ident MaybePort 
  ;

```



The `StreamPort` rule defines a stream by name with an optional named `Port`.

When the `Port` is omitted, tremor will internally default the `Port` to the
appropriate `in` or `out` port. Where the `err` or user defined `Port`s are
preferred, the optional `Port` specification SHOULD be provided.



## Rule WindowClause

The `WindowClause` rule defines an optional window definition for a supporting operation.



<img src="svg/WindowClause.svg" alt="WindowClause" width="223" height="55"/>

```ebnf
rule WindowClause ::=
    ( WindowDefn ) ?  
  ;

```



The `WindowClause` rule defines an optional window definition for a supporting operation.



## Rule WhereClause

The `WhereClause` defines a predicate expression used to filter ( forward or discard ) events in an operation.

The `where` clause is executed before a operation processes an event.



<img src="svg/WhereClause.svg" alt="WhereClause" width="349" height="55"/>

```ebnf
rule WhereClause ::=
    (  'where' ComplexExprImut ) ?  
  ;

```



The `WhereClause` defines a predicate expression used to filter ( forward or discard ) events in an operation.

The `where` clause is executed before a operation processes an event.



## Rule GroupByClause

The `GroupByClause` defines the group by clause of a supporting operation in tremor.

An operator that uses a group by clause maintains the operation for each group captured
by the grouping dimensions specified in this clause.



<img src="svg/GroupByClause.svg" alt="GroupByClause" width="355" height="55"/>

```ebnf
rule GroupByClause ::=
    (  'group'  'by' GroupDef ) ?  
  ;

```



The `GroupByClause` defines the group by clause of a supporting operation in tremor.

An operator that uses a group by clause maintains the operation for each group captured
by the grouping dimensions specified in this clause.



## Rule HavingClause

The `HavingClause` defines a predicate expression used to filter ( forward or discard ) events in an operation.

The `having` clause is executed after an operation has processed an event.


<img src="svg/HavingClause.svg" alt="HavingClause" width="357" height="55"/>

```ebnf
rule HavingClause ::=
    (  'having' ComplexExprImut ) ?  
  ;

```



The `HavingClause` defines a predicate expression used to filter ( forward or discard ) events in an operation.

The `having` clause is executed after an operation has processed an event.


## Rule MaybePort

The `MaybePort` rule defines an optional `Port`.



<img src="svg/MaybePort.svg" alt="MaybePort" width="237" height="55"/>

```ebnf
rule MaybePort ::=
    (  '/' Ident ) ?  
  ;

```



The `MaybePort` rule defines an optional `Port`.



## Rule ModPath

The `ModPath` rule defines a modular path.

A modular path is a sequence of `Ident`s separated by a `::` double-colon.



<img src="svg/ModPath.svg" alt="ModPath" width="331" height="75"/>

```ebnf
rule ModPath ::=
    ModPath  '::' Ident 
  | Ident 
  ;

```



The `ModPath` rule defines a modular path.

A modular path is a sequence of `Ident`s separated by a `::` double-colon.



## Rule WindowDefn

The `WindowDefn` defines a temporal basis over which a stream of events is applicable.



<img src="svg/WindowDefn.svg" alt="WindowDefn" width="259" height="42"/>

```ebnf
rule WindowDefn ::=
     '[' Windows  ']' 
  ;

```



The `WindowDefn` defines a temporal basis over which a stream of events is applicable.



## Rule Window

The `Window` rule defines a modular target to a window definition.



<img src="svg/Window.svg" alt="Window" width="331" height="75"/>

```ebnf
rule Window ::=
    Ident 
  | ModPath  '::' Ident 
  ;

```



The `Window` rule defines a modular target to a window definition.



## Rule Windows

The `Windows` rule defines a sequence of window definitions that are `,` comma delimited.



<img src="svg/Windows.svg" alt="Windows" width="159" height="42"/>

```ebnf
rule Windows ::=
    Windows_ 
  ;

```



The `Windows` rule defines a sequence of window definitions that are `,` comma delimited.



## Rule Windows_

The `Windows_` rule defines a sequence of window definitions that are `,` comma delimited.



<img src="svg/Windows_.svg" alt="Windows_" width="307" height="86"/>

```ebnf
rule Windows_ ::=
    Sep!(Windows_, Window, ",") 
  ;

```



The `Windows_` rule defines a sequence of window definitions that are `,` comma delimited.



## Rule GroupDef

The `GroupDef` rule defines the parts of a grouping dimension.

Group segments can be derived from:
* Expressions - for which their serialized values are used.
* Set expressions - which computes a set based on an expression.
* Each expressions - which iterates an expression to compute a set.



<img src="svg/GroupDef.svg" alt="GroupDef" width="393" height="108"/>

```ebnf
rule GroupDef ::=
    ExprImut 
  |  'set'  '(' GroupDefs  ')' 
  |  'each'  '(' ExprImut  ')' 
  ;

```



The `GroupDef` rule defines the parts of a grouping dimension.

Group segments can be derived from:
* Expressions - for which their serialized values are used.
* Set expressions - which computes a set based on an expression.
* Each expressions - which iterates an expression to compute a set.



## Rule ExprImut

The `ExprImut` is the root of immutable expressions in tremor.



<img src="svg/ExprImut.svg" alt="ExprImut" width="175" height="42"/>

```ebnf
rule ExprImut ::=
    OrExprImut 
  ;

```



The `ExprImut` is the root of immutable expressions in tremor.



## Rule GroupDefs

The `GroupDefs` rule defines a `,` comma delimited set of `GroupDef` rules.



<img src="svg/GroupDefs.svg" alt="GroupDefs" width="175" height="42"/>

```ebnf
rule GroupDefs ::=
    GroupDefs_ 
  ;

```



The `GroupDefs` rule defines a `,` comma delimited set of `GroupDef` rules.



## Rule GroupDefs_

The `GroupDefs_` rule defines a `,` comma delimited set of `GroupDef` rules.



<img src="svg/GroupDefs_.svg" alt="GroupDefs_" width="339" height="86"/>

```ebnf
rule GroupDefs_ ::=
    Sep!(GroupDefs_, GroupDef, ",") 
  ;

```



The `GroupDefs_` rule defines a `,` comma delimited set of `GroupDef` rules.



## Rule EmbeddedScriptImut

The `EmbeddedScriptImut` rule defines an optional embedded `script`.
 


<img src="svg/EmbeddedScriptImut.svg" alt="EmbeddedScriptImut" width="413" height="55"/>

```ebnf
rule EmbeddedScriptImut ::=
    (  'script' EmbeddedScriptContent ) ?  
  ;

```



The `EmbeddedScriptImut` rule defines an optional embedded `script`.
 


## Rule EmbeddedScriptContent

The `EmbeddedScriptContent` rule defines an embedded script expression. 



<img src="svg/EmbeddedScriptContent.svg" alt="EmbeddedScriptContent" width="159" height="42"/>

```ebnf
rule EmbeddedScriptContent ::=
    ExprImut 
  ;

```



The `EmbeddedScriptContent` rule defines an embedded script expression. 



## Rule WithExprs

The `WithExprs` rule defines a `,` comma delimited set of `WithExpr` rules.



<img src="svg/WithExprs.svg" alt="WithExprs" width="175" height="42"/>

```ebnf
rule WithExprs ::=
    WithExprs_ 
  ;

```



The `WithExprs` rule defines a `,` comma delimited set of `WithExpr` rules.



## Rule WithExprs_

<img src="svg/WithExprs_.svg" alt="WithExprs_" width="339" height="86"/>

```ebnf
rule WithExprs_ ::=
    Sep!(WithExprs_, WithExpr, ",") 
  ;

```



## Rule Exprs

<img src="svg/Exprs.svg" alt="Exprs" width="379" height="87"/>

```ebnf
rule Exprs ::=
    MayBeConstExpr  ';' Exprs 
  | MayBeConstExpr  ';' ?  
  ;

```




