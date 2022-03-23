# Deploy Grammar

## Rule Deploy

### Deployment Language Entrypoint

This is the top level rule of the tremor deployment language `troy`



<img src="svg/Deploy.svg" alt="Deploy" width="713" height="100"/>

```ebnf
rule Deploy ::=
    ConfigDirectives ModComment DeployStmts  '<end-of-stream>' ?  
  | ModComment DeployStmts  '<end-of-stream>' ?  
  ;

```



### Deployment Language Entrypoint

This is the top level rule of the tremor deployment language `troy`



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



## Rule DeployStmts

The `DeployStmts` rule defines the statements that are legal in a deployment
module.

Statements in a deployment modules are `;` semi-colon delimited.

There MUST be at least one.

There MAY be more than one.



<img src="svg/DeployStmts.svg" alt="DeployStmts" width="395" height="87"/>

```ebnf
rule DeployStmts ::=
    DeployStmt  ';' DeployStmts 
  | DeployStmt  ';' ?  
  ;

```



The `DeployStmts` rule defines the statements that are legal in a deployment
module.

Statements in a deployment modules are `;` semi-colon delimited.

There MUST be at least one.

There MAY be more than one.



## Rule DeployStmt

The `DeployStmt` rule constrains the statements that are legal in a `.troy` deployment module.

Importing modules via the `use` clause is allowed.

Flow definitions and `deploy` commands are allowed.



<img src="svg/DeployStmt.svg" alt="DeployStmt" width="255" height="108"/>

```ebnf
rule DeployStmt ::=
    DefineFlow 
  | DeployFlowStmt 
  | Use 
  ;

```



The `DeployStmt` rule constrains the statements that are legal in a `.troy` deployment module.

Importing modules via the `use` clause is allowed.

Flow definitions and `deploy` commands are allowed.



## Rule DefineFlow

<img src="svg/DefineFlow.svg" alt="DefineFlow" width="809" height="42"/>

```ebnf
rule DefineFlow ::=
    DocComment  'define'  'flow' Ident DefinitionArgs  'flow' FlowStmts  'end' 
  ;

```



## Rule DeployFlowStmt

<img src="svg/DeployFlowStmt.svg" alt="DeployFlowStmt" width="827" height="75"/>

```ebnf
rule DeployFlowStmt ::=
    DocComment  'deploy'  'flow' Ident  'from' ModularTarget CreationWithEnd 
  | DocComment  'deploy'  'flow' Ident CreationWithEnd 
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



<img src="svg/Use.svg" alt="Use" width="449" height="75"/>

```ebnf
rule Use ::=
     'use' ModularTarget 
  |  'use' ModularTarget  'as' Ident 
  ;

```



Imports definitions from an external source for use in the current source file.

The contents of a source file form a module.

### TREMOR_PATH

The `TREMOR_PATH` environment path variable is a `:` delimited set of paths.

Each path is an absolute or relative path to a directory.

When using relative paths - these are relative to the working directory where the
`tremor` executable is executed from.

The tremor standard library MUST be added to the path to be accessible to scripts.



## Rule DocComment

The `DocComment` rule specifies documentation comments in tremor.

Documentation comments are optional.

A documentation comment begins with a `##` double-hash and they are line delimited.

Muliple successive comments are coalesced together to form a complete comment.

The content of a documentation comment is markdown syntax.



<img src="svg/DocComment.svg" alt="DocComment" width="231" height="55"/>

```ebnf
rule DocComment ::=
    ( DocComment_ ) ?  
  ;

```



The `DocComment` rule specifies documentation comments in tremor.

Documentation comments are optional.

A documentation comment begins with a `##` double-hash and they are line delimited.

Muliple successive comments are coalesced together to form a complete comment.

The content of a documentation comment is markdown syntax.



## Rule Ident

An `Ident` is an identifier - a user defined name for a tremor value.



<img src="svg/Ident.svg" alt="Ident" width="167" height="42"/>

```ebnf
rule Ident ::=
     '<ident>' 
  ;

```



An `Ident` is an identifier - a user defined name for a tremor value.



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



## Rule CreationWithEnd

The `CreationWithEnd` rule defines a `with` block of expressions with a terminal `end` keyword.



<img src="svg/CreationWithEnd.svg" alt="CreationWithEnd" width="247" height="55"/>

```ebnf
rule CreationWithEnd ::=
    WithEndClause ?  
  ;

```



The `CreationWithEnd` rule defines a `with` block of expressions with a terminal `end` keyword.



## Rule ConnectorKind

The `ConnectorKind` rule identifies a builtin connector in tremor.

Connectors in tremor are provided by the runtime and builtin. They can be resolved
through an identifier. 

### Examples

The `http_server` identifies a HTTP server connector.

The `metronome` identifies a periodic metronome.



<img src="svg/ConnectorKind.svg" alt="ConnectorKind" width="135" height="42"/>

```ebnf
rule ConnectorKind ::=
    Ident 
  ;

```



The `ConnectorKind` rule identifies a builtin connector in tremor.

Connectors in tremor are provided by the runtime and builtin. They can be resolved
through an identifier. 

### Examples

The `http_server` identifies a HTTP server connector.

The `metronome` identifies a periodic metronome.



## Rule FlowStmts

The `FlowStmts` rule defines a mandatory `;` semi-colon delimited sequence of `FlowStmtInner` rules.



<img src="svg/FlowStmts.svg" alt="FlowStmts" width="175" height="42"/>

```ebnf
rule FlowStmts ::=
    FlowStmts_ 
  ;

```



The `FlowStmts` rule defines a mandatory `;` semi-colon delimited sequence of `FlowStmtInner` rules.



## Rule FlowStmts_

The `FlowStmts_` rule defines a `;` semi-colon delimited sequence of `FlowStmtInner` rules.



<img src="svg/FlowStmts_.svg" alt="FlowStmts_" width="379" height="86"/>

```ebnf
rule FlowStmts_ ::=
    Sep!(FlowStmts_, FlowStmtInner, ";") 
  ;

```



The `FlowStmts_` rule defines a `;` semi-colon delimited sequence of `FlowStmtInner` rules.



## Rule FlowStmtInner

The `FlowStmtInner` rule defines the body of a flow definition.



<img src="svg/FlowStmtInner.svg" alt="FlowStmtInner" width="199" height="141"/>

```ebnf
rule FlowStmtInner ::=
    Define 
  | Create 
  | Connect 
  | Use 
  ;

```



The `FlowStmtInner` rule defines the body of a flow definition.



## Rule CreateKind

The `CreateKind` rule encapsulates the artefact types that can be created in the tremor deploymant language.



<img src="svg/CreateKind.svg" alt="CreateKind" width="231" height="75"/>

```ebnf
rule CreateKind ::=
     'connector' 
  |  'pipeline' 
  ;

```



The `CreateKind` rule encapsulates the artefact types that can be created in the tremor deploymant language.



## Rule Define

The `Define` rule allows connectors and pipelines to be specified.



<img src="svg/Define.svg" alt="Define" width="263" height="75"/>

```ebnf
rule Define ::=
    DefinePipeline 
  | DefineConnector 
  ;

```



The `Define` rule allows connectors and pipelines to be specified.



## Rule Create

The `Create` rule creates instances of connectors and pipelines in a flow.



<img src="svg/Create.svg" alt="Create" width="749" height="75"/>

```ebnf
rule Create ::=
     'create' CreateKind Ident  'from' ModularTarget CreationWithEnd 
  |  'create' CreateKind Ident CreationWithEnd 
  ;

```



The `Create` rule creates instances of connectors and pipelines in a flow.



## Rule Connect

The `Connect` rule defines routes between connectors and pipelines running in a flow.



<img src="svg/Connect.svg" alt="Connect" width="749" height="108"/>

```ebnf
rule Connect ::=
     'connect'  '/' ConnectFromConnector  'to'  '/' ConnectToPipeline 
  |  'connect'  '/' ConnectFromPipeline  'to'  '/' ConnectToConnector 
  |  'connect'  '/' ConnectFromPipeline  'to'  '/' ConnectToPipeline 
  ;

```



The `Connect` rule defines routes between connectors and pipelines running in a flow.



## Rule DefinePipeline

The `DefinePipeline` rule creates a named pipeline.

A pipeline is a query operation composed using the query langauge DSL
instead of a builtin operation provided by tremor written in the rust
programming language.

The named pipeline can be parameterized and instanciated via the `CreatePipeline` rule



<img src="svg/DefinePipeline.svg" alt="DefinePipeline" width="1077" height="55"/>

```ebnf
rule DefinePipeline ::=
    DocComment  'define'  'pipeline' Ident (  'from' Ports ) ?  (  'into' Ports ) ?  DefinitionArgs Pipeline 
  ;

```



The `DefinePipeline` rule creates a named pipeline.

A pipeline is a query operation composed using the query langauge DSL
instead of a builtin operation provided by tremor written in the rust
programming language.

The named pipeline can be parameterized and instanciated via the `CreatePipeline` rule



## Rule DefineConnector

The `DefineConnector` rule defines a connector.

A connector is a runtime artefact that allows tremor to connect to the outside
world, or for the outside connector to connect to tremor to send and/or receive
data.

The named connector can be parameterized and instanciated via the `Create` rule



<img src="svg/DefineConnector.svg" alt="DefineConnector" width="835" height="55"/>

```ebnf
rule DefineConnector ::=
    DocComment  'define'  'connector' Ident  'from' ConnectorKind ArgsWithEnd ?  
  ;

```



The `DefineConnector` rule defines a connector.

A connector is a runtime artefact that allows tremor to connect to the outside
world, or for the outside connector to connect to tremor to send and/or receive
data.

The named connector can be parameterized and instanciated via the `Create` rule



## Rule ConnectFromConnector

The `ConnectFromConnector` rule defines a route from a connector instance.



<img src="svg/ConnectFromConnector.svg" alt="ConnectFromConnector" width="409" height="42"/>

```ebnf
rule ConnectFromConnector ::=
     'connector'  '/' Ident MaybePort 
  ;

```



The `ConnectFromConnector` rule defines a route from a connector instance.



## Rule ConnectToPipeline

The `ConnectToPipeline` rule defines route to a pipeline instance.



<img src="svg/ConnectToPipeline.svg" alt="ConnectToPipeline" width="401" height="42"/>

```ebnf
rule ConnectToPipeline ::=
     'pipeline'  '/' Ident MaybePort 
  ;

```



The `ConnectToPipeline` rule defines route to a pipeline instance.



## Rule ConnectFromPipeline

The `ConnectFromPipeline` rule defines route from a pipeline instance.



<img src="svg/ConnectFromPipeline.svg" alt="ConnectFromPipeline" width="401" height="42"/>

```ebnf
rule ConnectFromPipeline ::=
     'pipeline'  '/' Ident MaybePort 
  ;

```



The `ConnectFromPipeline` rule defines route from a pipeline instance.



## Rule ConnectToConnector

The `ConnectToConnector` rule defines a route to a connector instance.



<img src="svg/ConnectToConnector.svg" alt="ConnectToConnector" width="409" height="42"/>

```ebnf
rule ConnectToConnector ::=
     'connector'  '/' Ident MaybePort 
  ;

```



The `ConnectToConnector` rule defines a route to a connector instance.



## Rule MaybePort

The `MaybePort` rule defines an optional `Port`.



<img src="svg/MaybePort.svg" alt="MaybePort" width="237" height="55"/>

```ebnf
rule MaybePort ::=
    (  '/' Ident ) ?  
  ;

```



The `MaybePort` rule defines an optional `Port`.



## Rule ArgsWithEnd

The `ArgsWithEnd` rule defines an arguments block with an `end` block.



<img src="svg/ArgsWithEnd.svg" alt="ArgsWithEnd" width="357" height="55"/>

```ebnf
rule ArgsWithEnd ::=
    ArgsClause ?  WithEndClause 
  ;

```



The `ArgsWithEnd` rule defines an arguments block with an `end` block.



## Rule DefinitionArgs

The `DefinitionArgs` rule defines an arguments block without an `end` block.



<img src="svg/DefinitionArgs.svg" alt="DefinitionArgs" width="223" height="55"/>

```ebnf
rule DefinitionArgs ::=
    ArgsClause ?  
  ;

```



The `DefinitionArgs` rule defines an arguments block without an `end` block.




