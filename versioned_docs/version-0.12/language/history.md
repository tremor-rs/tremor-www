# History

## Changes from 0.11 to 0.12


### Binding and Mapping become Flows

The main thing that changed from 0.11 to 0.12 is that for configuring Tremor, the binding and mapping YAML have been removed and the Tremor deployment language has been added. Users are now able to configure Tremor in one file and don't have to use yaml, trickle and tremor-script files.

In the previous deployment model, users had to specify their deployment configurations inside a YAML file. This file contained the used onramp and offramp configurations. It also contained one or more `binding` which described what a [Flow](./index.md#flows) is describing with its connect statements now: The connections between onramps/offramps (which become connectors) and pipelines that form the event flow of the application. It also contained one or more `mappings`, which created running instances of the bindings and provided some mapping fields that could be used for defining mutliple instances of the same offramp or pipeline. The [Flow](./index.md#flows) that we created to replace what a `binding` was, and the [Deployment](./index.md#deploy) of flows that replace what a `mapping` was, are far more powerful that their former counterparts, due to the support for [Arguments](./index.md#arguments) and the [module system](./index.md#modules).

Tremor now takes a `.troy` file that contains [Flow definitions](./index.md#flows) and [deploys](./index.md#deploy) them. This file may include further [modules](./index.md#modules) from other files.

### Onramps and Offramps become Connectors

The concept of onramps and offramps has been generalized into [Connectors] and during this process, various improvements to the runtime have been added. A connector is an entity that can be both a source (onramp) and a sink (offramp) of events. It maintains a connection to the external system it provides connectivity to (e.g. a TCP connection to an upstream server), is pausable and resumable, as are [Flows](./index.md#flows). As well as pipeline operators, connectors have ports through which they can connected to pipelines.

#### Pause and Resume

Via the new API, Connectors can be paused and resumed.

#### Reconnect

Connectors try to maintain their connectivity and are able to reconnect if the connection gets lost.

#### Quiescence

Upon regular process termination all events are flushed out of any pipelines or internal queues, so that no event gets lost.


### Other Breaking syntax changes

[Window-](./reference/query.md#rule-definewindow) and [Operator-Definitions](./reference/query.md#rule-defineoperator) changed their syntax in a breaking way.

[Connectors]: ./../reference/connectors