# RFC Template (RFC Title goes here)

- Feature Name: Clustering - Stage 1
- Start Date: 2023-11-14
- Tremor Issue: [tremor-rs/tremor-runtime#2219](https://github.com/tremor-rs/tremor-runtime/pull/2219)
- RFC PR: [tremor-rs/tremor-www#308](https://github.com/tremor-rs/tremor-www/pull/308)

## Summary
[summary]: #summary

This RFC covers the introduction of the most basic clustering functionality to tremor. New features introduced are a shared KV store (exposed as a connector), cluster membership management, and cluster application deployment (in an all-node or single-node fashion). No further features or functionality are introduced in this RFC and are out of scope as expansion on the clustering functionality is expected to be handled in additional RFCs.

## Motivation
[motivation]: #motivation

In scenarios with a significant event load, it is quickly possible to saturate a single pipeline's real-time capability to process all the data. As of today, the workaround is to deploy multiple independent tremor nodes, each taking part in the event load. This is not ideal, as it requires manual intervention to scale up and down and only allows for a single tremor instance to be used as a single point of entry for all events.

In addition, methods for storing dynamic configuration such as files or the `kv` connector are instance-limited, and configuration changes must be made separately to every node in a multi-node deployment.

The distributed application framework, the cluster management, and the shared data store resolve those issues by allowing one to see a cluster deployment as a single entity that can share applications and configuration.

Aside from the depreciation of the old, largely defunct API for remote managing nodes, this change does not affect the existing use cases. Single-node tremors can still be run and are unaffected by this RFC or the changes it introduces.

## Guide-level Explanation
[guide-level-explanation]: #guide-level-explanation

Stage 1 clustering consists of three main components:

### Cluster Membership Management

The cluster membership is managed by RAFT consensus; a strongly consistent algorithm ensures that any committed change will persist as long as half the cluster nodes are reachable. To interact with this, the CLI introduces a new `cluster` namespace to allow creating, joining, leaving, and inspecting the cluster - the implementation details of the CLI are out of scope for this RFC as they will fluidly change.

### Shared KV store

Based on the same RAFT consensus mechanism, a key-value store is implemented. This store serves as a place to store and share cluster configuration and applications and builds the foundation of the functionality provided by the cluster. An API for inspecting the KV store is exposed for testing purposes.

In addition, a new `cluster_kv` connector is introduced that allows interaction with the KV store from within tremor pipelines, allowing a pipeline to access shared data between all its incarnations in a cluster. It has simple `read`, `consistent read`, and `write` semantics.

The `cluister_kv` connector is not meant to replace a dedicated database but for situations where some simple dynamic information needs to be stored and occasionally received by a pipeline.

### Tremor Applications

Deploying into a cluster comes with some new challenges, the biggest one being that multiple nodes are not guaranteed to be identical. Historically, with modularity introduced, a pipeline depended on the standard library and any additional libraries installed on the machine the pipeline ran. 

This method works poorly in a cluster, for once the system initialing the pipeline is likely not part of the cluster but an administrative system, meaning it would require a user to keep this system's libraries directly in sync with the cluster. In addition, the cluster nodes are not guaranteed to be identical, deployed at different times, and differ in available libraries.

To resolve this problem, clustering stage 1 introduced the concept of a **tremor application**; this is an archive that contains all the code, libraries, configuration, and metadata required to run a pipeline packed as a tar archive (fortunately, the naming works both with the file format and with it being a Tremor ARchive ;) ). This archive is then deployed to the cluster and can be started via the API. The cluster will then ensure the application is started on all nodes (or, in the case of a single node application, a single node).

## Reference-level Explanation
[reference-level-explanation]: #reference-level-explanation

### Tremor Application

The tremor application archive is a tar file with some well-defined entries:

- `app.json` - a JSON file containing the application metadata
- `main.troy` - the main entry point to the application containing at least one flow definition
- any additional libraries referenced in the `main.troy`

#### `main.troy`

The entry-point file needs to contain at least one flow definition; any deploy statements will be ignored as the deployment of an application is handled via the API.

The flow `main` takes a special meaning as the default flow of the application. When starting an application, this flow is started by default; it is, however, possible to provide more than one flow or a flow with a name different than `main`. Those flows can then be started separately via the API.

The flow arguments, defined via the `args` clause, can be provided via the API when starting the flow.

#### `app.json`

This metadata file is automatically created to contain details on the application, its flows, its dependencies, and the files in the archive. It is not meant to be manually modified or created.

The content of the `app.json` is an implementation detail and **not** a defined interface, it may change at any time without prior notice. It should **not** be edited manually, and no expectations should be had on the content. This extends to it's encoding as JSON and the file itself.

Fort the sake of completeness the initial `app.json` includes the following structure:

```json
{
    "name": "example",  # name of the application
    "sha256": "...",    # sha256 hash of the files in the archive
    "flows": {          # a list of all the flows defined in the main main.troy
        "main": {       # name of the flow
            "args": {}  # arguments of the flow and their default values or `null`
        }
    }
}
```

#### included libraries

Those libraries are automatically combined in the archive and indexed in the `app.json`. When deployed, they will replace the libraries installed on the node. This means when deploying an application, no node local files are consulted.

## Drawbacks
[drawbacks]: #drawbacks

Since this is a pure addition and not a change, there are no drawbacks to prior versions of tremor; however, there are some possible drawbacks in the approach taken.

* Strong consistency is a demanding constraint for node management. It poses the problem that cluster reconfiguration might not be possible in the face of a partial outage. This tradeoff is, however, just that, a tradeoff; the alternative of an eventual consistent backend for all configurations imposes other challenges, and for better or worse, the decision was made to go with strong consistency.

* The cluster_kv connector is not tested for high-performance needs as building a distributed kv store in itself is a massive undertaking, and its purpose is to allow shared configuration, not to be a fully-fledged kv store. Improvements can be made to this, but they can happen after the initial release.

* Raft expects all actions committed to the log to be successful; however, tremors internal API can't make a strong guarantee of this, so we are in a situation where we have to do this on a best-effort basis. For example, parsing the application technically could fail even so logically it shouldn't since that already was done during application creation.

## Rationale and Alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

An alternative would have been an eventual consistent backend; the primary choice to avoid this was that there are no established libraries for this in Rust at the point of writing this, and it's easier to reduce constraints later than to enforce more restrictions.

## Prior Art
[prior-art]: #prior-art

RAFT is a well-known algorithm for strongly consistent systems.

Erlang Application archives and the JVMs JAR files inspire the Tremor Archive.

## Unresolved Questions
[unresolved-questions]: #unresolved-questions

The biggest unresolved question is handling failed requests in the LOGs well; while they should not happen, there is no guarantee that they won't occur during an application's lifecycle.

## Future Possibilities
[future-possibilities]: #future-possibilities

The design of stage 1 was internally named the **micro ring** as the future goal is to limit cluster membership and configuration storage to raft while outsourcing work to a **macro ring** that works as an eventual consistent system in a ring-based configuration. This would allow combining the benefits from a strongly consistent configuration with eventual consistent workload management.

Another later-stage implementation is cluster-wide communication, the option to forward events from one node to another and create a form of location independence. This will allow splitting out ingress, egress, and processing and more elaborate deployment and data partitioning strategies.

Lastly, cluster-aware deployments and more advanced placement strategies are a reasonable follow-up to this RFC; so far, only `all` and `one` node deployments exist, but more advanced strategies are possible with further development. This would combine nicely with the partitioning of data and the cluster-wide communication mentioned above.