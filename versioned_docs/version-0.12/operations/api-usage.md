# API usage

At the moment tremor supports a fairly minimal api. A documentation can be found [here](../api/index.md).

There is one part of the API worth calling out as it is a fairly powerful and completely new concept.

With the [`/v1/flows/{flow-id}`](../api/index.md#tag/flows/operation/patch_flow_status) call we can pause a flow. Pausing a flow will start the queiecense process and put all connectors in the flow into paused state - meaning they'll not produce any further messsages.

The same can be done with the [`/v1/flows/{flow-id}/connectors/{connector-id}`](../api/index.md#tag/flows/operation/patch_flow_connector_status) which will pause only a single connector.
