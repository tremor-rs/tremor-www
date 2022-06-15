# API usage

At the moment tremor supports a fairly minimal api. A documentation can be found [here](../api/index.md).

There is one part of the API worth calling out as it is a fairly powerful and completely new concept:

## Pause / Resume

With the [`/v1/flows/{flow-id}`](../api/index.md#tag/flows/operation/patch_flow_status) call we can pause a flow. Pausing a flow will start the quiescense process and put all connectors in the flow into paused state - meaning they'll not produce any further messsages.

The same can be done with the [`/v1/flows/{flow-id}/connectors/{connector-id}`](../api/index.md#tag/flows/operation/patch_flow_connector_status) which will pause only a single connector.

## Status

The [`/v1/status`](../api/index.md#tag/status/operation/get_runtime_status) can be used to get status information on the running Tremor cluster and all its deployed [Flows]. It will error if any of the deployed flows is in an unhealthy state.

Example:

```console
$ curl -si localhost:9898/v1/status       
HTTP/1.1 200 OK
content-length: 56
content-type: application/json
date: Tue, 31 May 2022 11:51:19 GMT

{"all_running":true,"num_flows":1,"flows":{"running":1}}
```

[Flows]: ../language/index.md#flows