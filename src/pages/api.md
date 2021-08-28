---
title: Tremor API
description: Tremor REST API.
draft: false
hide_table_of_contents: false
---

## Document Status

Work in Progress

## Well-known API Endpoints

This document summarises the Tremor REST API.

|Url|Description|
|---|---|
|http://localhost:9898/|The default ( development ) endpoint on a local ( development ) host|

## Paths

The endpoint paths supported by the Tremor REST API.

    
### __GET__ /onramp

Lists onramps.

*Description:*

Returns a list of identifiers for each onramp stored in the repository.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

find_onramps

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/registry_set](#schema-registry_set)|
> |200|application/yaml|[#/components/schemas/registry_set](#schema-registry_set)|


### __POST__ /onramp

Publish a new onramp to the Tremor artefact repository.

*Description:*

Publishes a new onramp to the Tremor artefact repository if the artefact id
is unique.

Returns artefact data, on success.

If an onramp of the same name already exists, a conflict error is returned.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

publish_onramp

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |201|application/json|[#/components/schemas/onramp](#schema-onramp)|
> |201|application/yaml|[#/components/schemas/onramp](#schema-onramp)|
> |409|empty|no content|


### __GET__ /onramp/{artefact-id}

Finds onramp data from tremor artefact repository.

*Description:*

Given a valid artefact identifier of an artefact stored in the Tremor artefact repository.

Returns artefact data, on success.

Response data may be either JSON or YAML formatted ( defaults to JSON ).


*OperationId:*

get_onramp_by_id

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/onramp_state](#schema-onramp_state)|
> |200|application/yaml|[#/components/schemas/onramp_state](#schema-onramp_state)|
> |404|empty|no content|


### __DELETE__ /onramp/{artefact-id}

Remove an onramp from Tremor artefact repository.

*Description:*


Given a valid artefact identifier of an artefact stored in the Tremor artefact repository.

Returns old artefact data on success.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

delete_onramp_by_id

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/onramp](#schema-onramp)|
> |200|application/yaml|[#/components/schemas/onramp](#schema-onramp)|
> |409|empty|no content|
> |404|empty|no content|


### __GET__ /offramp

Lists oframps.

*Description:*

Returns a list of identifiers for each offramp stored in the repository.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

find_offramps

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/registry_set](#schema-registry_set)|
> |200|application/yaml|[#/components/schemas/registry_set](#schema-registry_set)|


### __POST__ /offramp

Publish a new offramp to the Tremor artefact repository.

*Description:*

Publishes a new offramp to the Tremor artefact repository if the artefact id
is unique.

Returns artefact data on success.

If an arterfact of the same name already exists, a conflict error is returned.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

publish_offramp

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |201|application/json|[#/components/schemas/offramp](#schema-offramp)|
> |201|application/yaml|[#/components/schemas/offramp](#schema-offramp)|
> |409|empty|no content|


### __GET__ /offramp/{artefact-id}

Get offramp data from Tremor artefact repository.

*Description:*

Given a valid artefact identifier of an artefact stored in the Tremor artefact repository.

Returns artefact data, on success.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

get_offramp_by_id

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/offramp_state](#schema-offramp_state)|
> |200|application/yaml|[#/components/schemas/offramp_state](#schema-offramp_state)|
> |404|empty|no content|


### __DELETE__ /offramp/{artefact-id}

Remove artefact from Tremor artefact repository.

*Description:*

Given a valid artefact identifier of an artefact stored in the Tremor artefact repository.

Returns old artefact data on success.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

delete_offramp_by_id

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/offramp](#schema-offramp)|
> |200|application/yaml|[#/components/schemas/offramp](#schema-offramp)|
> |409|empty|no content|
> |404|empty|no content|


### __GET__ /pipeline

Lists pipelines

*Description:*

Returns a list of identifiers for each pipeline stored in the repository.

Response data is a trickle source code string.


*OperationId:*

find_pipelines

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/registry_set](#schema-registry_set)|
> |200|application/yaml|[#/components/schemas/registry_set](#schema-registry_set)|


### __POST__ /pipeline

Publish a new pipeline to the Tremor artefact repository.

*Description:*

Publishes a new pipeline to the Tremor artefact repository if the artefact id
is unique.

The request body need to be valid trickle.

Returns artefact data on success.

If an pipeline of the same name already exists, a conflict error is returned.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

publish_pipeline

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |201|application/json|[#/components/schemas/pipeline](#schema-pipeline)|
> |201|application/yaml|[#/components/schemas/pipeline](#schema-pipeline)|
> |201|application/vnd.trickle|[#/components/schemas/pipeline](#schema-pipeline)|
> |409|empty|no content|


### __GET__ /pipeline/{artefact-id}

Get pipeline data from Tremor artefact repository.

*Description:*

Given a valid pipeline artefact identifier of a pipeline artefact stored in the Tremor artefact repository.

Returns pipeline source code string on success.

Response data may be either JSON or YAML formatted (defaults to JSON),
but is essentially a trickle source code string.


*OperationId:*

get_pipeline_by_id

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/pipeline](#schema-pipeline)|
> |200|application/yaml|[#/components/schemas/pipeline](#schema-pipeline)|
> |200|application/vnd.trickle|[#/components/schemas/pipeline](#schema-pipeline)|
> |404|empty|no content|


### __DELETE__ /pipeline/{artefact-id}

Remove pipeline from Tremor artefact repository.

*Description:*

Given a valid artefact identifier of an artefact stored in the Tremor artefact repository.

Returns old artefact data on success.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

delete_pipeline_by_id

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/pipeline](#schema-pipeline)|
> |200|application/yaml|[#/components/schemas/pipeline](#schema-pipeline)|
> |200|application/vnd.trickle|[#/components/schemas/pipeline](#schema-pipeline)|
> |409|empty|no content|
> |404|empty|no content|


### __GET__ /binding

Lists bindings.

*Description:*

Returns a list of identifiers for each binding stored in the repository.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

find_bindings

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/registry_set](#schema-registry_set)|
> |200|application/yaml|[#/components/schemas/registry_set](#schema-registry_set)|


### __POST__ /binding

Publish a new binding to the Tremor artefact repository.

*Description:*

Publishes a new binding to the Tremor artefact repository if the artefact id
is unique.

Returns artefact data on success.

If an arterfact of the same name already exists, a conflict error is returned.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

publish_binding

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |201|application/json|[#/components/schemas/binding](#schema-binding)|
> |201|application/yaml|[#/components/schemas/binding](#schema-binding)|
> |409|empty|no content|


### __GET__ /binding/{artefact-id}

Get binding data from Tremor artefact repository.

*Description:*

Given a valid artefact identifier of an artefact stored in the Tremor artefact repository.

Returns artefact data on success.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

get_binding_by_id

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/binding_state](#schema-binding_state)|
> |200|application/yaml|[#/components/schemas/binding_state](#schema-binding_state)|
> |404|empty|no content|


### __DELETE__ /binding/{artefact-id}

Remove binding from Tremor artefact repository.

*Description:*

Given a valid artefact identifier of an artefact stored in the Tremor artefact repository.

Returns old artefact data on success.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

delete_binding_by_id

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/binding](#schema-binding)|
> |200|application/yaml|[#/components/schemas/binding](#schema-binding)|
> |404|empty|no content|


### __GET__ /binding/{artefact-id}/{instance-id}

Get deployed artefact servant data from Tremor artefact registry.

*Description:*

Given a valid identifier of a binding artefact stored in the Tremor artefact repository.

Given a valid binding instance identifier for a deployed and running instance of the binding deployed and accesible via the Tremor instance registry.

Returns binding instance data on success.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

get_binding_instance_by_id

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/binding](#schema-binding)|
> |200|application/yaml|[#/components/schemas/binding](#schema-binding)|
> |404|empty|no content|


### __POST__ /binding/{artefact-id}/{instance-id}

Publish, deploy and activate a binding.

*Description:*

Given a valid binding artefact identifier of a binding artefact stored in the Tremor artefact repository.

Given a valid binding instance identifier for a deployed and running instance of the binding deployed and accesible via the Tremor instance registry.

Creates new instances of artefacts (if required), publishes instances
to the Tremor instance registry. If instances are onramps, offramps or
pipelines, new registry values will be created. In the case of onramps
and offramps, these are deployed *after* any dependant pipeline instances,
and then they are interconnected.

Returns the binding instance data on success.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

activate-binding

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |201|application/json|[#/components/schemas/binding](#schema-binding)|
> |201|application/yaml|[#/components/schemas/binding](#schema-binding)|
> |404|empty|no content|


### __DELETE__ /binding/{artefact-id}/{instance-id}

Deactivate and unpublish deployed bindings.

*Description:*

Given a valid binding artefact identifier of a binding artefact stored in the Tremor artefact repository.

Given a valid binding instance identifier for a deployed and running instance of the binding deployed and accesible via the Tremor instance registry.

Deactivates, stops and unpublishes the target instances and any
dependant instances that are no longer referenced by the runtime.

Returns old instance data on success.

Response data may be either JSON or YAML formatted (defaults to JSON).


*OperationId:*

deactivate-binding

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/binding](#schema-binding)|
> |200|application/yaml|[#/components/schemas/binding](#schema-binding)|
> |404|empty|no content|


### __GET__ /version

Gets the current version.

*Description:*


This endpoint returns version information for the current
version of Tremor. Versioning policy follows [Semantic Versioning](https://semver.org/).


*OperationId:*

get_version

*Returns:*

> |Status Code|Content Type|Schema Type|
> |---|---|---|
> |200|application/json|[#/components/schemas/version](#schema-version)|


## Schemas

JSON Schema for types defioned in the Tremor REST API.
    
### Schema for type: __version__
<a name="schema-version"></a>

Version information:

```json
{
    "description": "Version information",
    "properties": {
        "additionalProperties": false,
        "debug": {
            "description": "True if this is a debug build",
            "type": "boolean"
        },
        "version": {
            "description": "The semantic version code",
            "type": "string"
        }
    },
    "required": [
        "version"
    ]
}
```

### Schema for type: __registry_set__
<a name="schema-registry_set"></a>

A list of registry artefacts:

```json
{
    "description": "A list of registry artefacts",
    "items": {
        "$ref": "#/components/schemas/artefact_id"
    },
    "type": "array"
}
```

### Schema for type: __instance_set__
<a name="schema-instance_set"></a>

A list of artefact instances:

```json
{
    "description": "A list of artefact instances",
    "items": {
        "$ref": "#/components/schemas/instance_id"
    },
    "type": "array"
}
```

### Schema for type: __artefact_id__
<a name="schema-artefact_id"></a>

No description.

```json
{
    "pattern": "^[a-z][a-zA-Z_:]*$",
    "type": "string"
}
```

### Schema for type: __instance_id__
<a name="schema-instance_id"></a>

No description.

```json
{
    "$ref": "#/components/schemas/artefact_id"
}
```

### Schema for type: __port_id__
<a name="schema-port_id"></a>

No description.

```json
{
    "$ref": "#/components/schemas/artefact_id"
}
```

### Schema for type: __artefact__
<a name="schema-artefact"></a>

No description.

```json
{
    "oneOf": [
        {
            "$ref": "#/components/schemas/pipeline"
        },
        {
            "$ref": "#/components/schemas/onramp"
        },
        {
            "$ref": "#/components/schemas/offramp"
        },
        {
            "$ref": "#/components/schemas/binding"
        }
    ]
}
```

### Schema for type: __instance__
<a name="schema-instance"></a>

No description.

```json
{
    "oneOf": [
        {
            "$ref": "#/components/schemas/mapping"
        }
    ]
}
```

### Schema for type: __publish_ok__
<a name="schema-publish_ok"></a>

Response when a registry publish was succesful:

```json
{
    "description": "Response when a registry publish was succesful",
    "properties": {
        "id": {
            "$ref": "#/components/schemas/artefact_id",
            "description": "The id of the pubished artefact"
        }
    },
    "required": [
        "id"
    ]
}
```

### Schema for type: __pipeline__
<a name="schema-pipeline"></a>

State of a pipeline, expressed as trickle source code:

```json
{
    "description": "State of an pipeline, expressed as trickle source code.",
    "type": "string"
}
```

### Schema for type: __onramp_state__
<a name="schema-onramp_state"></a>

State of an onramp, including specification and instances:

```json
{
    "additionalProperties": false,
    "description": "State of an onramp, including specification and instances",
    "properties": {
        "artefact": {
            "$ref": "#/components/schemas/onramp"
        },
        "instances": {
            "$ref": "#/components/schemas/instance_set"
        }
    },
    "type": "object"
}
```

### Schema for type: __onramp__
<a name="schema-onramp"></a>

A Tremor onramp specification:

```json
{
    "additionalProperties": false,
    "description": "A tremor onramp specification",
    "properties": {
        "codec": {
            "$ref": "#/components/schemas/codec"
        },
        "codec_map": {
            "$ref": "#/components/schemas/codec_map"
        },
        "config": {
            "description": "A map of key/value pairs used to configure this onramp",
            "type": "object"
        },
        "description": {
            "description": "Documentation for this type",
            "type": "string"
        },
        "err_required": {
            "description": "Whether a pipeline needs to be connected to the err port before startup",
            "type": "boolean"
        },
        "id": {
            "$ref": "#/components/schemas/artefact_id"
        },
        "linked": {
            "description": "Whether this offramp is linked or not",
            "type": "boolean"
        },
        "metrics_interval_s": {
            "description": "interval in which metrics info is published",
            "minimum": 0,
            "type": "integer"
        },
        "postprocessors": {
            "additionalItems": false,
            "items": {
                "$ref": "#/components/schemas/postprocessor"
            },
            "type": "array"
        },
        "preprocessors": {
            "additionalItems": false,
            "items": {
                "$ref": "#/components/schemas/preprocessor"
            },
            "type": "array"
        },
        "type": {
            "$ref": "#/components/schemas/onramp_type"
        }
    },
    "required": [
        "type",
        "id"
    ],
    "type": "object"
}
```

### Schema for type: __offramp_state__
<a name="schema-offramp_state"></a>

State of an offramp, including specification and instances:

```json
{
    "additionalProperties": false,
    "description": "State of an offramp, including specification and instances",
    "properties": {
        "artefact": {
            "$ref": "#/components/schemas/offramp"
        },
        "instances": {
            "$ref": "#/components/schemas/instance_set"
        }
    },
    "type": "object"
}
```

### Schema for type: __offramp__
<a name="schema-offramp"></a>

A Tremor offramp specification:

```json
{
    "additionalProperties": false,
    "description": "A tremor offramp specification",
    "properties": {
        "codec": {
            "$ref": "#/components/schemas/codec"
        },
        "codec_map": {
            "$ref": "#/components/schemas/codec_map"
        },
        "config": {
            "description": "A map of key/value pairs used to configure this onramp",
            "type": "object"
        },
        "description": {
            "description": "Documentation for this type",
            "type": "string"
        },
        "id": {
            "$ref": "#/components/schemas/artefact_id"
        },
        "linked": {
            "description": "Whether this offramp is linked or not",
            "type": "boolean"
        },
        "metrics_interval_s": {
            "description": "interval in which metrics info is published",
            "minimum": 0,
            "type": "integer"
        },
        "postprocessors": {
            "additionalItems": false,
            "items": {
                "$ref": "#/components/schemas/postprocessor"
            },
            "type": "array"
        },
        "preprocessors": {
            "additionalItems": false,
            "items": {
                "$ref": "#/components/schemas/preprocessor"
            },
            "type": "array"
        },
        "type": {
            "$ref": "#/components/schemas/offramp_type"
        }
    },
    "required": [
        "type",
        "id"
    ],
    "type": "object"
}
```

### Schema for type: __binding_state__
<a name="schema-binding_state"></a>

State of a binding, including specification and instances:

```json
{
    "additionalProperties": false,
    "description": "State of an binding, including specification and instances",
    "properties": {
        "artefact": {
            "$ref": "#/components/schemas/binding"
        },
        "instances": {
            "$ref": "#/components/schemas/instance_set"
        }
    },
    "type": "object"
}
```

### Schema for type: __binding__
<a name="schema-binding"></a>

A Tremor binding specification:

```json
{
    "additionalProperties": false,
    "description": "A tremor binding specification",
    "properties": {
        "description": {
            "type": "string"
        },
        "id": {
            "$ref": "#/components/schemas/artefact_id"
        },
        "links": {
            "$ref": "#/components/schemas/binding_map"
        }
    },
    "required": [
        "id",
        "links"
    ],
    "type": "object"
}
```

### Schema for type: __binding_map__
<a name="schema-binding_map"></a>

A map of binding specification links:

```json
{
    "additionalProperties": false,
    "description": "A map of binding specification links",
    "patternProperties": {
        "^(tremor://localhost)?/(onramp|pipeline)/[a-zA-Z][A-Za-z0-9_]*/[a-zA-Z][A-Za-z0-9_]*$": {
            "additionalItems": false,
            "items": {
                "$ref": "#/components/schemas/binding_dst"
            },
            "type": "array"
        }
    },
    "type": "object"
}
```

### Schema for type: __binding_dst__
<a name="schema-binding_dst"></a>

No description.

```json
{
    "pattern": "^(tremor://localhost)?/(pipeline|offramp)/[a-zA-Z][A-Za-z0-9_]*/[a-zA-Z][A-Za-z0-9_]*$",
    "type": "string"
}
```

### Schema for type: __mapping__
<a name="schema-mapping"></a>

A Tremor mapping specification.

```json
{
    "description": "A tremor mapping specification",
    "type": "object"
}
```

### Schema for type: __offramp_type__
<a name="schema-offramp_type"></a>

Supported offramp types:

```json
{
    "description": "supported offramp types",
    "enum": [
        "blackhole",
        "debug",
        "elastic",
        "exit",
        "file",
        "kafka",
        "newrelic",
        "postgres",
        "rest",
        "stderr",
        "stdout",
        "tcp",
        "udp",
        "ws"
    ],
    "type": "string"
}
```

### Schema for type: __onramp_type__
<a name="schema-onramp_type"></a>

Supported onramp types:

```json
{
    "description": "supported onramp types",
    "enum": [
        "blaster",
        "crononome",
        "file",
        "kafka",
        "metronome",
        "postgres",
        "rest",
        "tcp",
        "udp",
        "ws"
    ],
    "type": "string"
}
```

### Schema for type: __codec__
<a name="schema-codec"></a>

The data format supported for encoding/decoding to/from Tremor types:

```json
{
    "description": "The data format supported for encoding/decoding to/from tremor types",
    "enum": [
        "binflux",
        "influx",
        "json",
        "msgpack",
        "null",
        "statsd",
        "string",
        "yaml"
    ],
    "type": "string"
}
```

### Schema for type: __codec_map__
<a name="schema-codec_map"></a>

A map from mime-type to codec:

```json
{
    "additionalProperties": {
        "$ref": "#/components/schemas/codec"
    },
    "description": "A map from mime-type to codec",
    "type": "object"
}
```

### Schema for type: __preprocessor__
<a name="schema-preprocessor"></a>

Supported preprocessors:

```json
{
    "description": "Supported preprocessors",
    "enum": [
        "base64",
        "decompress",
        "gelf-chunking",
        "gzip",
        "length-prefixed",
        "lines",
        "lines-null",
        "lines-pipe",
        "lines-no-buffer",
        "lines-cr-no-buffer",
        "lz4",
        "remove-empty",
        "snappy",
        "textual-length-prefix",
        "xz",
        "zlib"
    ],
    "type": "string"
}
```

### Schema for type: __postprocessor__
<a name="schema-postprocessor"></a>

Supported postprocessors:

```json
{
    "description": "Supported postprocessors",
    "enum": [
        "base64",
        "gelf-chunking",
        "gzip",
        "length-prefixed",
        "lines",
        "lz4",
        "snappy",
        "textual-length-prefix",
        "xz",
        "zlib"
    ],
    "type": "string"
}
```

